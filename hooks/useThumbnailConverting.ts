import {useCallback, useState} from "react";

type UseThumbnailConvertingOptions = {
  onError?: (message: string, error: unknown) => void;
};

export function useThumbnailConverting(options: UseThumbnailConvertingOptions = {}) {
  const { onError } = options;
  const [thumbnailConverting, setThumbnailConverting] = useState(false);

  const handleFileChange = useCallback(
    async (
      e: React.ChangeEvent<HTMLInputElement>,
      onUploaded: (url: string) => void
    ) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        const msg = "Only JPEG, PNG, and WebP images are supported.";
        if (onError) {
          onError(msg, new Error(msg));
        } else {
          window.alert(msg);
        }
        e.currentTarget.value = "";
        return;
      }

      try {
        setThumbnailConverting(true);

        // Generate unique ID for the image
        const imageId = `thumbnail-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

        // Create form data for upload
        const formData = new FormData();
        formData.append('file', file);
        formData.append('id', imageId);

        // Upload using API endpoint with authorization
        const response = await fetch('/api/files', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: 'Upload failed' }));
          throw new Error(errorData.message || `Upload failed with status ${response.status}`);
        }

        const data = await response.json();
        onUploaded(data.url);
      }
      catch (err) {
        const msg =
          err instanceof Error ? err.message : "Failed to upload image.";
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


