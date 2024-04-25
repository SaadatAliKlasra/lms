import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse, userAgent } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest, { params }: { params: { courseId: string } }) {
  try {
    const { userId } = auth()
    const { url } = await req.json()

    if (!userId) {
      return new NextResponse("UnAuthorized", { status: 401 })
    }

    const courseOwner = await prisma.course.findUnique({
      where: {
        id: params.courseId,
        userId: userId
      }
    })
    if (!courseOwner) {
      return new NextResponse("Forbidden", { status: 403 })
    }
    const attachements = await prisma.attachment.create({
      data: {
        url,
        name: url.split('/').pop(),
        courseId: params.courseId
      }
    })
    return NextResponse.json(attachements)
  } catch (error: any) {
    console.log("[COURSE ATTACHEMENTS]", error.message)
    return new NextResponse("Internal Server Error", { status: 500 })
  }

}