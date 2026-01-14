export interface IStorageService {
    storeFile(id: string, buffer: Buffer, mimeType?: string): Promise<string>;

    deleteFile(url: string): Promise<void>;
}