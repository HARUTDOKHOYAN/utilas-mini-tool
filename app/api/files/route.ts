import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { StorageServiceFactory } from '@/lib/services/SrorageService/storageServiceFactory';

/**
 * POST /api/files
 * Protected endpoint to upload files (authentication required)
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const { authorized } = await requireAuth();
    if (!authorized) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { message: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type (optional - you can customize this)
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/zip'];
    if (!allowedTypes.some(type => file.type.startsWith(type.split('/')[0]))) {
      return NextResponse.json(
        { message: 'Invalid file type' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Generate unique ID for the file
    const fileId = formData.get('id') as string || `file-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    // Get storage service and upload
    const storageService = StorageServiceFactory.getService();
    const fileUrl = await storageService.storeFile(fileId, buffer, file.type);

    return NextResponse.json({
      url: fileUrl,
      id: fileId,
      type: file.type,
      size: file.size
    });
  } catch (error) {
    console.error('[File Upload API] Error:', error);
    return NextResponse.json(
      {
        message: 'Failed to upload file',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/files?url=<file-url>
 * Protected endpoint to delete files (authentication required)
 */
export async function DELETE(request: NextRequest) {
  try {
    // Check authentication
    const { authorized } = await requireAuth();
    if (!authorized) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const fileUrl = searchParams.get('url');

    if (!fileUrl) {
      return NextResponse.json(
        { message: 'File URL is required' },
        { status: 400 }
      );
    }

    // Decode the URL if it was encoded
    const decodedUrl = decodeURIComponent(fileUrl);

    // Get storage service and delete file
    const storageService = StorageServiceFactory.getService();
    await storageService.deleteFile(decodedUrl);

    return NextResponse.json({
      message: 'File deleted successfully',
      url: decodedUrl
    });
  } catch (error) {
    console.error('[File Delete API] Error:', error);
    return NextResponse.json(
      {
        message: 'Failed to delete file',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
