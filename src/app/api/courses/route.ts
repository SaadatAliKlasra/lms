import { auth } from "@clerk/nextjs"
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
export async function POST(req: NextRequest) {
  try {
    const { userId } = auth()
    const { title } = await req.json()

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }
    // create course 
    const course = await prisma.course.create({
      data: {
        title: title,
        userId: userId
      }
    })
    return NextResponse.json(course)
  } catch (error) {
    console.log("[COURSES]", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}