import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import MiniToolPrev, {IMiniToolPrev} from '@/lib/models/MiniToolPrev';
import {ComponentFiltering} from "@/lib/ToolFiltering/Filters";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const q = searchParams.get('q');
    const componentFilter = searchParams.getAll('componentFilter');

    if (!q || q.trim() === "") {
      return NextResponse.json(
        { message: "Query parameter 'q' is required." },
        { status: 400 }
      );
    }

    let tools : IMiniToolPrev[] | unknown = await GetTools(q);
    tools = ComponentFiltering(tools,componentFilter)
    return NextResponse.json(tools);

  } catch (error) {
    console.error("Error searching tools:", error);
    return NextResponse.json(
      { message: "Internal server error while searching tools." },
      { status: 500 }
    );
  }
}

function  GetTools(query: string): Promise<IMiniToolPrev> | unknown
{
    const searchQuery = query.trim();
    const searchRegex = new RegExp(searchQuery, "i");

    return   MiniToolPrev.find({
        $or: [
            { title: searchRegex },
        ],
    })
        .sort({ createdAt: -1 })
        .lean() as unknown as IMiniToolPrev[];

}

