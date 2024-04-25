import { auth } from "@clerk/nextjs"
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function PUT(req: NextRequest, { params }: { params: { courseId: string } }) {
  try {
    const { userId } = auth()
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }
    const { list } = await req.json()
    const ownCourse = await prisma.course.findUnique({
      where: {
        id: params.courseId,
        userId
      }
    })
    if (!ownCourse) {
      return new NextResponse("Unauthorized", { status: 401 })
    }
    for (let item of list) {
      await prisma.chapter.update({
        where: {
          id: item.id
        },
        data: {
          position: item.position
        }
      })
    }

    return new NextResponse("Success", { status: 200 })

  } catch (error: any) {
    console.error("[CHAPTERS REORDER]", error?.message || "Something went wrong")
  }
}