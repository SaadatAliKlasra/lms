import React from 'react'
import { prisma } from '@/lib/db'
import Categories from './_components/categories'

type Props = {}

const Page = async (props: Props) => {
  const categories = await prisma.category.findMany({
    orderBy: {
      name: 'asc'
    }

  })
  return (
    <div>
      <Categories items={categories} />
    </div>
  )
}

export default Page