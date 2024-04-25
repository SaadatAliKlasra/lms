import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs"
import { prisma } from "@/lib/db"

export async function PATCH(req: NextResponse, { params }: { params: { courseId: string } }) {
  try {
    const { userId } = auth()

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }
    const course = await prisma?.course.findUnique({
      where: {
        id: params.courseId,
        userId
      }
    })
    if (!course) {
      return new NextResponse("Not Found", { status: 404 })
    }
    if (!course.isPublished) {
      return new NextResponse("Bad Request", { status: 400 })
    }

    const updatedCourse = await prisma?.course.update({
      where: {
        id: params.courseId,
        userId
      },
      data: {
        isPublished: false
      }
    })

    return NextResponse.json(updatedCourse)
  } catch (error) {
    console.log("[COURSE_ID] UNPUBLISH PATCH", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}