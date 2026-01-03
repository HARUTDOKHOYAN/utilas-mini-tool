import {useCallback, useState} from "react";
import {uploadImageToBase64} from "@/lib/utils/blobToBase64Converter";

type UseThumbnailConvertingOptions = {
  onError?: (message: string, error: unknown) => void;
};

export function useThumbnailConverting(options: UseThumbnailConvertingOptions = {}) {
  const { onError } = options;
  const [thumbnailConverting, setThumbnailConverting] = useState(false);

  const handleFileChange = useCallback(
    async (
      e: React.ChangeEvent<HTMLInputElement>,
      onConverted: (base64: string) => void
    ) => {
      const file = e.target.files?.[0];
      if (!file) return;

      try {
        setThumbnailConverting(true);
        const base64 = await uploadImageToBase64(file);
        onConverted(base64);
      }
      catch (err) {
        const msg =
          err instanceof Error ? err.message : "Failed to convert image to base64.";
        if (onError) {
          onError(msg, err);
        } else {
          // Default behavior for client usage
          // eslint-disable-next-line no-console
          console.error(msg, err);
          window.alert(msg);
        }
        // Reset the file input so user can re-select the same file
        e.currentTarget.value = "";
      } finally {
        setThumbnailConverting(false);
      }
    },
    [onError]
  );

  return { thumbnailConverting, handleFileChange };
}


