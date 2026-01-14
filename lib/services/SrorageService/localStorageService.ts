import {IStorageService} from "@/lib/services/SrorageService/IStorageService";

export class LocalStorageService implements IStorageService {
    private readonly apiUrl = 'http://192.168.0.201:4010';
    private readonly authToken = '78aac01fb05e8eb59100e60cc356afe9068e04970888ce6b4f14184cb585b1e6';

    constructor() {
        // No local storage setup needed
    }

    public async storeFile(id: string, buffer: Buffer, mimeType: string = 'application/zip'): Promise<string>
    {
        const getExtensionFromMimeType = (mimeType:string): string => {
            const mimeToExt = {
                'image/webp': 'webp',
                'image/jpeg': 'jpg',
                'image/jpg': 'jpg',
                'image/png': 'png',
                'image/gif': 'gif',
                'application/pdf': 'pdf',
                'text/plain': 'txt',
                'application/json': 'json',
                'text/markdown': 'md',
                'text/x-markdown': 'md',
                'application/zip': 'zip'
            };

            return mimeToExt[mimeType.toLowerCase() as keyof typeof mimeToExt] || '';
        };

// Your upload code with fix:
        const extension = getExtensionFromMimeType(mimeType);
        const filename = extension ? `${id}.${extension}` : id;

        const file = new File([new Uint8Array(buffer)], filename, { type: mimeType });

        const myHeaders = new Headers();
        myHeaders.append("accept", "application/json");
        myHeaders.append("Authorization", `Bearer ${this.authToken}`);

        const formdata = new FormData();
        formdata.append("file", file);

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: formdata
        };

        try {
            const response = await fetch(`${this.apiUrl}/api/files/upload`, requestOptions);

            if (!response.ok) {
                throw new Error(`Upload failed with status: ${response.status}`);
            }

            const result = await response.json();

            if (!result.success || !result.data?._id) {
                throw new Error('API response does not contain valid file data');
            }

            // Return the download URL using the file ID
            console.error(result.data);

            return result.data.downloadLink;
        } catch (error) {
            console.error('Error uploading file:', error);
            throw new Error(`Failed to upload file: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    public async deleteFile(url: string): Promise<void> {
        try {
            // Extract file ID from download URL
            const fileId = url.split('/api/files/download/')[1];
            if (!fileId) {
                console.warn(`[LocalStorageService] Could not extract file ID from URL: ${url}`);
                return;
            }

            const myHeaders = new Headers();
            myHeaders.append("accept", "application/json");
            myHeaders.append("Authorization", `Bearer ${this.authToken}`);

            const requestOptions = {
                method: "DELETE",
                headers: myHeaders
            };

            const response = await fetch(`${this.apiUrl}/api/files/${fileId}`, requestOptions);

            if (!response.ok) {
                console.warn(`[LocalStorageService] Failed to delete file: ${url}, status: ${response.status}`);
            }
        } catch (error) {
            console.warn(`[LocalStorageService] Error deleting file: ${url}`, error);
        }
    }
}