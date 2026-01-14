import {IStorageService} from "@/lib/services/SrorageService/IStorageService";
import {VertexBlobStorageService} from "@/lib/services/SrorageService/vertexBlobStorageService";
import {LocalStorageService} from "@/lib/services/SrorageService/localStorageService";

export class StorageServiceFactory {
    private static instance: IStorageService | null = null;

    public static refreshService(): void {
        console.log('[Storage Factory] Refreshing service instance');
        this.instance = null;
        this.getService();
    }

    public static getService(): IStorageService {
            const token = process.env.BLOB_READ_WRITE_TOKEN;
            console.log('[Storage Factory] BLOB_READ_WRITE_TOKEN present:', !!token);
            console.log('[Storage Factory] Token value (first 10 chars):', token?.substring(0, 10) + '...');
            console.log('[Storage Factory] Token length:', token?.length || 0);

            if (token && token.trim().length > 0) {
                console.log('[Storage Factory] Using Vercel Blob Storage');
                this.instance = new VertexBlobStorageService();
            } else {
                console.log('[Storage Factory] Using Local Storage (no valid token found)');
                this.instance = new LocalStorageService();
            }
        return this.instance;
    }
}