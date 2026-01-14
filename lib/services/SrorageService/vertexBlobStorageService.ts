import {IStorageService} from "@/lib/services/SrorageService/IStorageService";
import {del, put} from "@vercel/blob";

export class VertexBlobStorageService implements IStorageService {

    public async storeFile(id: string, buffer: Buffer, mimeType: string = 'application/zip'): Promise<string> {
        // Determine file extension and path based on mimeType
        let extension = '.zip';
        let folder = 'react-apps';
        
        if (mimeType.startsWith('image/')) {
            folder = 'images';
            if (mimeType === 'image/jpeg') extension = '.jpg';
            else if (mimeType === 'image/png') extension = '.png';
            else if (mimeType === 'image/webp') extension = '.webp';
            else extension = '.jpg'; // default fallback
        }
        
        const fileName = `${folder}/${id}-${Date.now()}${extension}`;

        const blob = await put(fileName, buffer, {
            access: 'public',
            contentType: mimeType,
            token: process.env.BLOB_READ_WRITE_TOKEN,
        });

        console.log(`[Blob Storage] Uploaded file to: ${blob.url}`);
        return blob.url;
    }

    public async deleteFile(url: string): Promise<void> {
        try {
            await del(url, {
                token: process.env.BLOB_READ_WRITE_TOKEN,
            });
            console.log(`[Blob Storage] Deleted blob: ${url}`);
        } catch (error) {
            console.warn(`[Blob Storage] Could not delete blob: ${url}`, error);
        }
    }
}