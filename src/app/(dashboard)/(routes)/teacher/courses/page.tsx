import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { DataTable } from './_components/data-table'
import { columns } from './_components/columns'
import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'

type Props = {}




const Page = async () => {
  const { userId } = auth()
  if (!userId) {
    return redirect('/sign-in')
  }
  const courses = await prisma?.course.findMany({
    where: {
      userId
    },
    orderBy: {
      createdAt: 'desc'

    }
  })

  return (
    <div>
      <DataTable columns={columns} data={courses} />
    </div>
  )
}

export default Page