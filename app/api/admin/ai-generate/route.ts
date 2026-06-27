import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, prompt, mode } = body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY chưa được cấu hình trong .env" },
        { status: 500 }
      );
    }

    let sourceContent = "";

    // If URL provided, scrape the content
    if (url) {
      try {
        const res = await fetch(url, {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          },
        });
        const html = await res.text();

        // Extract text content from HTML (simple approach without cheerio)
        sourceContent = html
          .replace(/<script[\s\S]*?<\/script>/gi, "")
          .replace(/<style[\s\S]*?<\/style>/gi, "")
          .replace(/<nav[\s\S]*?<\/nav>/gi, "")
          .replace(/<footer[\s\S]*?<\/footer>/gi, "")
          .replace(/<header[\s\S]*?<\/header>/gi, "")
          .replace(/<[^>]+>/g, " ")
          .replace(/&nbsp;/g, " ")
          .replace(/&amp;/g, "&")
          .replace(/&lt;/g, "<")
          .replace(/&gt;/g, ">")
          .replace(/\s+/g, " ")
          .trim()
          .substring(0, 8000); // Limit to ~8000 chars for token efficiency
      } catch {
        return NextResponse.json(
          { error: "Không thể truy cập URL này. Hãy thử copy/paste nội dung." },
          { status: 400 }
        );
      }
    }

    // Build the AI prompt
    const systemPrompt = `Bạn là một chuyên gia viết nội dung SEO cho website "Tiệm Nhà Bee" - cửa hàng đồ handmade, len sợi và quà tặng.
Nhiệm vụ: Viết bài blog chuẩn SEO bằng tiếng Việt.

QUY TẮC BẮT BUỘC:
- Viết bài viết HOÀN TOÀN MỚI, không sao chép nguyên văn từ nguồn.
- Sử dụng giọng văn thân thiện, gần gũi nhưng chuyên nghiệp.
- Cấu trúc bài viết rõ ràng với các heading (h2, h3).
- Đoạn văn ngắn gọn, dễ đọc (2-4 câu mỗi đoạn).
- Chèn từ khóa tự nhiên, không nhồi nhét.
- Độ dài bài viết tối thiểu 800 từ.

ĐỊNH DẠNG OUTPUT (BẮT BUỘC trả về JSON):
{
  "title": "Tiêu đề bài viết (hấp dẫn, chứa từ khóa chính)",
  "content": "Nội dung HTML đầy đủ với thẻ <h2>, <h3>, <p>, <ul>, <li>, <strong>, <em>",
  "excerpt": "Tóm tắt ngắn 1-2 câu (dưới 160 ký tự)",
  "seo_title": "Tiêu đề SEO (dưới 60 ký tự)",
  "seo_description": "Mô tả meta (dưới 160 ký tự)",
  "seo_keywords": "từ khóa 1, từ khóa 2, từ khóa 3"
}`;

    let userPrompt = "";

    if (mode === "rewrite" && sourceContent) {
      userPrompt = `Dựa trên nội dung tham khảo dưới đây, hãy viết lại thành một bài blog mới, độc đáo và chuẩn SEO cho "Tiệm Nhà Bee".

NỘI DUNG THAM KHẢO:
---
${sourceContent}
---

${prompt ? `YÊU CẦU BỔ SUNG: ${prompt}` : ""}

Hãy viết lại hoàn toàn với góc nhìn và giọng văn riêng, KHÔNG sao chép. Trả về JSON theo format đã yêu cầu.`;
    } else if (prompt) {
      userPrompt = `Hãy viết một bài blog chuẩn SEO với chủ đề: "${prompt}"

Bài viết phải phù hợp với "Tiệm Nhà Bee" - cửa hàng đồ handmade, len sợi. Trả về JSON theo format đã yêu cầu.`;
    } else {
      return NextResponse.json(
        { error: "Vui lòng nhập URL tham khảo hoặc mô tả chủ đề bài viết." },
        { status: 400 }
      );
    }

    // Call Gemini API
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                { text: systemPrompt + "\n\n" + userPrompt },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 4096,
            responseMimeType: "application/json",
          },
        }),
      }
    );

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error("Gemini API error:", errText);
      return NextResponse.json(
        { error: "Lỗi khi gọi AI. Kiểm tra GEMINI_API_KEY." },
        { status: 500 }
      );
    }

    const geminiData = await geminiRes.json();
    const rawText =
      geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Parse the JSON response from AI
    let aiResult;
    try {
      aiResult = JSON.parse(rawText);
    } catch {
      // If AI doesn't return valid JSON, wrap it
      aiResult = {
        title: "Bài viết mới",
        content: rawText,
        excerpt: "",
        seo_title: "",
        seo_description: "",
        seo_keywords: "",
      };
    }

    return NextResponse.json({ success: true, data: aiResult });
  } catch (error) {
    console.error("AI generate error:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi không mong muốn." },
      { status: 500 }
    );
  }
}
