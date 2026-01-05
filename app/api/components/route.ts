import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import MiniToolComponent from '@/lib/models/MiniToolComponent';

export async function GET() {
  try {
    await connectDB();

    const components = await MiniToolComponent.find()
      .sort({ name: 1 })
      .lean();

    return NextResponse.json(components.map(component => component.name));
  } catch (error) {
    console.error("Error fetching components:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
