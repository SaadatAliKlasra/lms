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
      },
      include: {
        chapters: true
      }
    })
    if (!course) {
      return new NextResponse("Not Found", { status: 404 })
    }
    if (course.isPublished) {
      return new NextResponse("Bad Request", { status: 400 })
    }
    const hasPublishedChapters = course.chapters.some(chapter => chapter.isPublished)

    if (!hasPublishedChapters) {
      return new NextResponse("You need atleast one chapter to be published", { status: 401 })
    }
    if (!course.title || !course.description || !course.imageUrl || !course.categoryId) {
      return new NextResponse("Missing required fields!", { status: 401 })

    }

    const updatedCourse = await prisma?.course.update({
      where: {
        id: params.courseId,
        userId
      },
      data: {
        isPublished: true
      }
    })

    return NextResponse.json(updatedCourse)
  } catch (error) {
    console.log("[COURSE_ID] PUBLISH PATCH", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}