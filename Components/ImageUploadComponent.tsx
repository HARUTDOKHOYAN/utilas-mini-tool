 "use client";

import {useThumbnailConverting} from "@/hooks/useThumbnailConverting";

type ImageUploadComponentProps = {
  isDisabled?: boolean;
  isRequired?: boolean;
  label?: string;
  helperText?: string;
  onUploaded: (url: string) => void;
};

export function ImageUploadComponent({
  isDisabled = false,
  isRequired = false,
  label = "Thumbnail Image (JPEG/PNG/WebP)",
  helperText = "The uploaded image will be stored and a URL will be generated.",
  onUploaded,
}: ImageUploadComponentProps) {
  const { thumbnailConverting, handleFileChange } = useThumbnailConverting();

  return (
    <label className="flex flex-col gap-2 text-sm font-medium text-zinc-700">
      {label}
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="rounded border border-zinc-300 px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
        required={isRequired}
        disabled={isDisabled || thumbnailConverting}
        onChange={(e) => handleFileChange(e, onUploaded)}
      />
      <span className="text-xs font-normal text-zinc-500">
        {thumbnailConverting ? "Uploading image..." : helperText}
      </span>
    </label>
  );
}