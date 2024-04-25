import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, { params }: { params: { courseId: string } }) {
  try {
    const { userId } = auth()
    const { courseId } = params
    const values = await req.json()

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }
    const course = await prisma?.course.update({
      where: {
        id: courseId
      },
      data: {
        ...values
      }

    })
    return NextResponse.json(course)
  } catch (error) {
    console.log("[COURSE_ID] PATCH", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { courseId: string } }) {
  try {
    const { userId } = auth()
    const { courseId } = params

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }
    const course = await prisma?.course.delete({
      where: {
        id: courseId,
        userId
      }
    })
    return NextResponse.json(course)
  } catch (error) {
    console.log("[COURSE_ID] DELETE", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}