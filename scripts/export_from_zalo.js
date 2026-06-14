(async () => {
    function cleanText(text) {
        return text
            .replace(/\u00a0/g, ' ')
            .replace(/[ \t]+\n/g, '\n')
            .replace(/\n{2,}/g, '\n')
            .trim();
    }

    function safeName(name) {
        return String(name || 'item')
            .replace(/[<>:"/\\|?*\x00-\x1F]/g, '_')
            .replace(/\s+/g, '_')
            .replace(/_+/g, '_')
            .replace(/^_+|_+$/g, '')
            .slice(0, 120);
    }

    function folderNameFromText(text, fallback = 'item') {
        const firstLine = (text || '').split('\n')[0]?.trim() || fallback;
        const m = firstLine.match(/^(\d+)\.\s*(.+)$/);
        if (m) return safeName(`${m[1]}_${m[2]}`);
        return safeName(firstLine || fallback);
    }

    function guessExtFromBlob(blob) {
        const mime = blob?.type || '';
        if (mime.includes('jpeg')) return 'jpg';
        if (mime.includes('png')) return 'png';
        if (mime.includes('webp')) return 'webp';
        if (mime.includes('gif')) return 'gif';
        return 'bin';
    }

    function strToU8(str) {
        return new TextEncoder().encode(str);
    }

    function concatU8(arrays) {
        const total = arrays.reduce((n, a) => n + a.length, 0);
        const out = new Uint8Array(total);
        let offset = 0;
        for (const a of arrays) {
            out.set(a, offset);
            offset += a.length;
        }
        return out;
    }

    function dosDateTime(date = new Date()) {
        const year = Math.max(1980, date.getFullYear());
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const hours = date.getHours();
        const mins = date.getMinutes();
        const secs = Math.floor(date.getSeconds() / 2);
        const dosTime = (hours << 11) | (mins << 5) | secs;
        const dosDate = ((year - 1980) << 9) | (month << 5) | day;
        return { dosTime, dosDate };
    }

    const crcTable = (() => {
        const table = new Uint32Array(256);
        for (let i = 0; i < 256; i++) {
            let c = i;
            for (let j = 0; j < 8; j++) {
                c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
            }
            table[i] = c >>> 0;
        }
        return table;
    })();

    function crc32(u8) {
        let crc = 0xFFFFFFFF;
        for (let i = 0; i < u8.length; i++) {
            crc = crcTable[(crc ^ u8[i]) & 0xFF] ^ (crc >>> 8);
        }
        return (crc ^ 0xFFFFFFFF) >>> 0;
    }

    function u16(n) {
        return Uint8Array.of(n & 0xFF, (n >>> 8) & 0xFF);
    }

    function u32(n) {
        return Uint8Array.of(
            n & 0xFF,
            (n >>> 8) & 0xFF,
            (n >>> 16) & 0xFF,
            (n >>> 24) & 0xFF
        );
    }

    function makeZip(files) {
        const localParts = [];
        const centralParts = [];
        let offset = 0;
        const { dosTime, dosDate } = dosDateTime();

        for (const file of files) {
            const nameBytes = strToU8(file.name);
            const data = file.data;
            const crc = crc32(data);
            const size = data.length;

            const localHeader = concatU8([
                u32(0x04034b50),
                u16(20),
                u16(0),
                u16(0),
                u16(dosTime),
                u16(dosDate),
                u32(crc),
                u32(size),
                u32(size),
                u16(nameBytes.length),
                u16(0),
                nameBytes
            ]);

            localParts.push(localHeader, data);

            const centralHeader = concatU8([
                u32(0x02014b50),
                u16(20),
                u16(20),
                u16(0),
                u16(0),
                u16(dosTime),
                u16(dosDate),
                u32(crc),
                u32(size),
                u32(size),
                u16(nameBytes.length),
                u16(0),
                u16(0),
                u16(0),
                u16(0),
                u32(0),
                u32(offset),
                nameBytes
            ]);

            centralParts.push(centralHeader);
            offset += localHeader.length + data.length;
        }

        const centralDir = concatU8(centralParts);
        const localData = concatU8(localParts);

        const endRecord = concatU8([
            u32(0x06054b50),
            u16(0),
            u16(0),
            u16(files.length),
            u16(files.length),
            u32(centralDir.length),
            u32(localData.length),
            u16(0)
        ]);

        return new Blob([localData, centralDir, endRecord], { type: 'application/zip' });
    }

    const rawResults = [...document.querySelectorAll('img[id$="-QUOTE_MESSAGE"]')].map(quoteImg => {
        const baseId = quoteImg.id.replace(/-QUOTE_MESSAGE$/, '');
        const originalImg = document.getElementById(baseId + '-MESSAGE_LIST');
        const messageContainer = quoteImg.closest('.text-message__container');
        const textEl = messageContainer?.querySelector('[data-component="message-text-content"] .text');

        return {
            baseId,
            quoteImageSrc: quoteImg.src,
            originalImageSrc: originalImg?.src || null,
            text: cleanText(textEl?.innerText || textEl?.textContent || '')
        };
    });

    const seen = new Set();
    const results = rawResults.filter(item => {
        const key = `${item.text}||${item.originalImageSrc || ''}`;
        if (!item.text || seen.has(key)) return false;
        seen.add(key);
        return true;
    });

    const usedFolderNames = new Set();
    const files = [];

    for (const item of results) {
        let folderName = folderNameFromText(item.text, item.baseId);
        if (usedFolderNames.has(folderName)) {
            let i = 2;
            while (usedFolderNames.has(`${folderName}_${i}`)) i++;
            folderName = `${folderName}_${i}`;
        }
        usedFolderNames.add(folderName);

        files.push({
            name: `${folderName}/content.txt`,
            data: strToU8(item.text || '')
        });

        files.push({
            name: `${folderName}/meta.json`,
            data: strToU8(JSON.stringify(item, null, 2))
        });

        if (item.originalImageSrc) {
            try {
                const res = await fetch(item.originalImageSrc);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const blob = await res.blob();
                const ext = guessExtFromBlob(blob);
                const buf = new Uint8Array(await blob.arrayBuffer());

                files.push({
                    name: `${folderName}/image.${ext}`,
                    data: buf
                });
            } catch (err) {
                files.push({
                    name: `${folderName}/image_error.txt`,
                    data: strToU8(`Cannot download image: ${item.originalImageSrc}\n${String(err)}`)
                });
            }
        } else {
            files.push({
                name: `${folderName}/image_error.txt`,
                data: strToU8('No originalImageSrc found')
            });
        }
    }

    files.push({
        name: 'results.json',
        data: strToU8(JSON.stringify(results, null, 2))
    });

    const zipBlob = makeZip(files);
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `zalo_export_${Date.now()}.zip`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 5000);

    console.log(`Exported ${results.length} unique items`);
    console.log(results);
})();