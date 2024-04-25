"use client"
import React from 'react'
import { IconType } from 'react-icons'
import { cn } from '@/lib/utils'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import qs from "query-string"

type Props = {
  label: string
  value?: string,
  icon?: IconType
}

const CategoryItem = ({ label, value, icon: Icon }: Props) => {
  const pathName = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentCategoryId = searchParams.get('categoryId')
  const currentTitle = searchParams.get('title')

  const isSelected = currentCategoryId === value
  const btnClickHandler = () => {
    const url = qs.stringifyUrl({
      url: pathName,
      query: {
        title: currentTitle,
        categoryId: isSelected ? null : value
      }
    }, { skipEmptyString: true, skipNull: true })
    router.push(url)
  }

  return (
    <button onClick={btnClickHandler} type='button' className={cn("py-2 px-3 text-sm border border-slate-200 rounded-full flex items-center gap-x-1 hover:border-sky-700 transition", isSelected && "border-sky-700 bg-sky-200/20 text-sky-800"
    )}>
      {Icon && <Icon size={24} />}
      <div className='truncate'>
        {label}
      </div>
    </button>
  )
}

export default CategoryItem