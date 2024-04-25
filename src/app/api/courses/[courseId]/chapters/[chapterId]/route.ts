
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { auth } from "@clerk/nextjs"


export async function PUT(req: NextRequest, { params }: { params: { courseId: string, chapterId: string } }) {
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
    const chapter = await prisma.chapter.update({
      where: {
        id: params.chapterId
      },
      data: {
        title,
        description,
        videoUrl,
        isPublished,
        isFree
      }
    })
    return NextResponse.json(chapter)
  } catch (error: any) {
    console.error("[CHAPTERS]", error.message)
    return new NextResponse("Internal Error", { status: 500 })
  }
}


export async function DELETE(req: NextRequest, { params }: { params: { courseId: string, chapterId: string } }) {
  try {
    const { userId } = auth()

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

    const chapter = await prisma.chapter.findUnique({
      where: {
        id: params.chapterId
      }
    })
    if (!chapter) {
      return new NextResponse("Not found", { status: 404 })
    }
    await prisma.chapter.delete({
      where: {
        id: params.chapterId
      }
    })
    return NextResponse.json(chapter)
  } catch (error: any) {
    console.error("[CHAPTERS]", error.message)
    return new NextResponse("Internal Error", { status: 500 })
  }
}