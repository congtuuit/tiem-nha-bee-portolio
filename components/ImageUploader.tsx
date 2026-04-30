"use client";

import { useState } from "react";
import imageCompression from "browser-image-compression";
import { UploadCloud, X, Loader2 } from "lucide-react";
import Image from "next/image";

interface ImageUploaderProps {
  onUploadSuccess: (url: string) => void;
  existingImages?: string[];
  maxImages?: number;
}

interface UploadResponse {
  signedUrl: string;
  publicUrl: string;
  key: string;
}

export function ImageUploader({
  onUploadSuccess,
  existingImages = [],
  maxImages = 5,
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (existingImages.length >= maxImages) {
      setError(`Bạn chỉ có thể tải lên tối đa ${maxImages} ảnh.`);
      return;
    }

    try {
      setIsUploading(true);
      setError(null);

      // 1. Tối ưu ảnh (Compress)
      const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1280,
        fileType: "image/webp",
        initialQuality: 0.8,
        useWebWorker: true,
      };
      const compressedFile = await imageCompression(file, options);

      // 2. Lấy Presigned URL
      const presignedRes = await fetch("/api/upload/presigned", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: compressedFile.name,
          contentType: compressedFile.type,
        }),
      });

      if (!presignedRes.ok) throw new Error("Không thể tạo URL tải lên");

      const { signedUrl, publicUrl, key } = await presignedRes.json() as UploadResponse;

      // 3. Tải lên R2 qua S3 API
      const uploadRes = await fetch(signedUrl, {
        method: "PUT",
        body: compressedFile,
      });

      if (!uploadRes.ok) throw new Error("Lỗi khi tải ảnh lên server");

      // 4. Trả về URL public
      onUploadSuccess(publicUrl);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Đã xảy ra lỗi khi tải ảnh.");
    } finally {
      setIsUploading(false);
      // Reset file input
      e.target.value = "";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        {existingImages.map((url, idx) => (
          <div
            key={idx}
            className="relative w-24 h-24 rounded-lg overflow-hidden border border-neutral-200"
          >
            <Image src={url} alt={`Uploaded ${idx}`} fill className="object-cover" />
          </div>
        ))}

        {existingImages.length < maxImages && (
          <label className="w-24 h-24 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-neutral-300 hover:border-amber-500 hover:bg-amber-50 cursor-pointer transition-colors relative">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
              disabled={isUploading}
            />
            {isUploading ? (
              <Loader2 className="w-6 h-6 text-amber-500 animate-spin" />
            ) : (
              <>
                <UploadCloud className="w-6 h-6 text-neutral-400 mb-1" />
                <span className="text-xs text-neutral-500 font-medium">Tải ảnh</span>
              </>
            )}
          </label>
        )}
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
