import React from 'react'
import { prisma } from '@/lib/db'
import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import { IconBadge } from '@/components/icon-badget'
import { AlertCircle, CircleDollarSign, File, LayoutDashboard, ListChecks } from 'lucide-react'
import TitleForm from './_components/title-form'
import DescriptionForm from './_components/description-form'
import ChaptersForm from './_components/chapters-form'
import ImageForm from './_components/image-form'
import { CategoryForm } from './_components/category-form'
import PriceForm from './_components/price-form'
import AttachmentsForm from './_components/attachment-form'

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { Actions } from './_components/actions'

type Props = {
  params: {
    courseId: string
  }
}

const Page = async ({ params }: Props) => {
  const { userId } = auth()
  if (!userId) {
    return redirect('/sign-in')
  }
  const course = await prisma.course.findUnique({
    where: {
      id: params.courseId,
      userId
    },
    include: {
      chapters: {
        orderBy: {
          position: "asc"
        }
      },
      attachments: {
        orderBy: {
          createdAt: 'desc'
        }

      }
    }
  })
  const categories = await prisma.category.findMany({
    orderBy: {
      name: 'asc'
    }
  })

  if (!course) {
    return redirect("/teacher/courses")
  }
  const requiredFields = [
    course.title,
    course.description,
    course.imageUrl,
    course.price,
    course.categoryId,
    course.chapters.some((chapter) => chapter.isPublished),
  ]
  const totalFields = requiredFields.length
  const completedFields = requiredFields.filter(Boolean).length
  const completionText = `${completedFields}/${totalFields}`

  const isComplete = requiredFields.every(Boolean)

  return (
    <React.Fragment>
      {!course.isPublished && (
        <Alert variant="default" className='bg-yellow-100'>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>
            Course is not Published
          </AlertTitle>
          <AlertDescription>
            This course is unpublished. Please publish it to make it available to students.
          </AlertDescription>
        </Alert>
      )}
      <div>
        <div className='flex items-center justify-between'>
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-medium">
              Course Setup
            </h1>
            <span className='text-sm text-slate-700'>
              {completionText} fields completed
            </span>
          </div>
          {/* add actions */}
          <Actions disabled={!isComplete} courseId={params.courseId} isPublished={course.isPublished} />
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-16'>
          <div>
            <div className='flex items-center gap-x-2'>
              <IconBadge icon={LayoutDashboard} />
              <h2 className='text-xl'>Customize Your Course</h2>
            </div>
            <TitleForm initialData={course} />
            <DescriptionForm initialData={course} />
            <ImageForm initialData={course} />
            <CategoryForm initialData={course} options={categories.map((category) => ({
              label: category.name,
              value: category.id
            }))} />
          </div>
          <div className='space-y-6'>
            <div>
              <div className='flex items-center gap-x-2'>
                <IconBadge icon={ListChecks} />
                <h2 className='text-xl'>Course Chapters</h2>
              </div>
              <ChaptersForm initialData={course} />
            </div>
            <div>
              <div className='flex items-center gap-x-2'>
                <IconBadge icon={CircleDollarSign} />
                <h2 className='text-xl'>Sell Your Course</h2>
              </div>
              <PriceForm initialData={course} />
            </div>
            <div>
              <div className='flex items-center gap-x-2'>
                <IconBadge icon={File} />
                <h2 className='text-xl'>Resources & Attachments</h2>
              </div>
              <AttachmentsForm initialData={course} />
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

export default Page