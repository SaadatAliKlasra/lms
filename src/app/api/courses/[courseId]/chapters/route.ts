import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db"

export async function POST(req: NextRequest, { params }: { params: { courseId: string } }) {
  try {
    const { userId } = auth()
    const { title, description, videoUrl, isPublished, isFree } = await req.json()
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }
    const courseOwner = await prisma.course.findUnique({
      where: {
        id: params.courseId,
        userId
      }
    })
    if (!courseOwner) {
      return new NextResponse("Unauthorized", { status: 401 })
    }
    const lasterChapter = await prisma.chapter.findFirst({
      where: {
        courseId: params.courseId,
      },
      orderBy: {
        position: "desc"
      }
    })
    const newPosition = lasterChapter ? lasterChapter.position + 1 : 1
    const chapter = await prisma.chapter.create({
      data: {
        title,
        description,
        videoUrl,
        isPublished,
        isFree,
        courseId: params.courseId,
        position: newPosition
      }
    })
    return NextResponse.json(chapter)
  } catch (error: any) {
    console.error("[CHAPTERS]", error.message)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
