import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import MiniToolTag from '@/lib/models/MiniToolTag';
import { requireAuth } from '@/lib/auth';

export async function GET() {
  try {
    await connectDB();

    const tags = await MiniToolTag.find()
      .sort({ name: 1 })
      .lean();

    return NextResponse.json(tags.map(tag => tag.name));
  } catch (error) {
    console.error("Error fetching tags:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const { authorized } = await requireAuth();
    if (!authorized) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    const body = await request.json();
    const { name } = body;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { message: "Tag name is required." },
        { status: 400 }
      );
    }

    const normalizedName = name.trim().toLowerCase();

    // Check if tag already exists
    const existingTag = await MiniToolTag.findOne({ name: normalizedName });
    if (existingTag) {
      return NextResponse.json(
        { message: "Tag already exists.", name: normalizedName },
        { status: 200 }
      );
    }

    const tag = await MiniToolTag.create({ name: normalizedName });

    return NextResponse.json({ name: tag.name }, { status: 201 });
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json(
        { message: "Tag already exists." },
        { status: 409 }
      );
    }
    console.error("Error creating tag:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

