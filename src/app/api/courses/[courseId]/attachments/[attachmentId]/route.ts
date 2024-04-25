import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function DELETE(req: NextRequest, { params }: { params: { courseId: string, attachmentId: string } }) {
  try {
    const { userId } = auth()
    const { courseId, attachmentId } = params

    if (!userId) {
      return new NextResponse("UnAuthorized", { status: 401 })
    }

    const courseOwner = await prisma.course.findUnique({
      where: {
        id: courseId,
        userId: userId
      }
    })
    if (!courseOwner) {
      return new NextResponse("Forbidden", { status: 403 })
    }
    const attachment = await prisma.attachment.delete({
      where: {
        id: attachmentId,
      }
    })
    return NextResponse.json(attachment)

  } catch (error: any) {
    console.log("[COURSE ATTACHEMENTS]", error.message)
    return new NextResponse("Internal Server Error", { status: 500 })

  }
}