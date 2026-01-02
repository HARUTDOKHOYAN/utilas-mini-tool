function inferImageMimeTypeFromUrl(url: string): string | "" {
    const clean = url.split("?")[0].split("#")[0].toLowerCase();
    if (clean.endsWith(".jpg") || clean.endsWith(".jpeg")) return "image/jpeg";
    if (clean.endsWith(".png")) return "image/png";
    if (clean.endsWith(".webp")) return "image/webp";
    return "";
}

function isAllowedImageMimeType(mime: string): boolean {
    return mime === "image/jpeg" || mime === "image/png" || mime === "image/webp";
}

async function blobToDataUrl(blob: Blob, fallbackMimeType?: string): Promise<string> {
    const mime = blob.type || fallbackMimeType || "application/octet-stream";

    // Browser path
    if (typeof FileReader !== "undefined") {
        return await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onerror = () => reject(reader.error ?? new Error("Failed to read image."));
            reader.onload = () => resolve(String(reader.result));
            reader.readAsDataURL(blob);
        });
    }

    // Server/Node path
    const ab = await blob.arrayBuffer();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const B: any = (globalThis as any).Buffer;
    if (!B) {
        throw new Error("Base64 conversion is not supported in this runtime.");
    }
    const base64 = B.from(ab).toString("base64");
    return `data:${mime};base64,${base64}`;
}

/**
 * Converts an uploaded image (jpeg/png/webp) to a Base64 data URL.
 *
 * - Accepts a URL (including `blob:` object URLs), or a `File`/`Blob`.
 * - Returns a `data:image/*;base64,...` string.
 */
export async function uploadImageToBase64(source: string | File | Blob): Promise<string> {
    // If caller already gives a data URL, just return it.
    if (typeof source === "string" && source.trim().startsWith("data:image/")) {
        return source.trim();
    }

    let blob: Blob;
    let inferredMime = "";

    if (typeof source === "string") {
        inferredMime = inferImageMimeTypeFromUrl(source);
        const res = await fetch(source, { cache: "no-store" });
        if (!res.ok) {
            throw new Error(`Failed to download image (${res.status} ${res.statusText}).`);
        }
        blob = await res.blob();
    } else {
        blob = source;
    }

    const mime = blob.type || inferredMime;
    if (!mime || !isAllowedImageMimeType(mime)) {
        throw new Error("Only JPEG, PNG, and WebP images are supported.");
    }

    const dataUrl = await blobToDataUrl(blob, mime);


    if (!dataUrl.startsWith("data:image/")) {
        throw new Error("Failed to convert image to Base64.");
    }

    return dataUrl;
}