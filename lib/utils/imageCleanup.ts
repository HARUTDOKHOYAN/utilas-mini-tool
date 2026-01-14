import { StorageServiceFactory } from '@/lib/services/SrorageService/storageServiceFactory';
import { MiniToolDto } from '@/lib/models/DTOs/MiniToolDto';
import { MiniToolPrevDto } from '@/lib/models/DTOs/MiniToolPrevDto';

/**
 * Checks if a string is a base64 data URL (legacy format)
 */
export function isBase64DataUrl(str: string): boolean {
  return typeof str === 'string' && str.trim().startsWith('data:image/');
}

/**
 * Checks if a string is a storage URL (not base64)
 */
export function isStorageUrl(str: string): boolean {
  if (!str || typeof str !== 'string') return false;
  // Check for storage URLs (HTTP/HTTPS URLs or file:// URLs)
  return str.startsWith('http://') ||
         str.startsWith('https://') ||
         str.startsWith('file://');
}

/**
 * Extracts all image URLs from a tool object
 */
export function extractImageUrls(tool: MiniToolDto | MiniToolPrevDto): string[] {
  const urls: string[] = [];

  // Extract thumbnail
  if (tool.thumbnail && isStorageUrl(tool.thumbnail)) {
    urls.push(tool.thumbnail);
  }

  // Extract keyFeatures images (only for MiniToolDto)
  if ('keyFeatures' in tool && Array.isArray(tool.keyFeatures)) {
    for (const feature of tool.keyFeatures) {
      if (feature?.image && isStorageUrl(feature.image)) {
        urls.push(feature.image);
      }
    }
  }

  // Extract description block images (only for MiniToolDto)
  if ('description' in tool && Array.isArray(tool.description)) {
    for (const block of tool.description) {
      if (block?.image && isStorageUrl(block.image)) {
        urls.push(block.image);
      }
    }
  }

  return urls;
}

/**
 * Deletes images from storage
 */
export async function deleteImagesFromStorage(urls: string[]): Promise<void> {
  if (urls.length === 0) return;

  const storageService = StorageServiceFactory.getService();
  
  // Delete all images in parallel
  await Promise.allSettled(
    urls.map(url => storageService.deleteFile(url))
  );
}

/**
 * Extracts and deletes all images from a tool
 */
export async function cleanupToolImages(tool: MiniToolDto | MiniToolPrevDto): Promise<void> {
  const urls = extractImageUrls(tool);
  await deleteImagesFromStorage(urls);
}

/**
 * Compares two tool objects and returns image URLs that were removed
 */
export function getRemovedImageUrls(
  oldTool: MiniToolDto | MiniToolPrevDto,
  newTool: MiniToolDto | MiniToolPrevDto
): string[] {
  const oldUrls = new Set(extractImageUrls(oldTool));
  const newUrls = new Set(extractImageUrls(newTool));
  
  const removed: string[] = [];
  for (const url of oldUrls) {
    if (!newUrls.has(url)) {
      removed.push(url);
    }
  }
  
  return removed;
}

