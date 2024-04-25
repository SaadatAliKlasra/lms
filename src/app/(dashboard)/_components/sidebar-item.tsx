"use client"

import React from 'react'
import { LucideIcon } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

type Props = {
  route: {
    icon: LucideIcon
    label: string
    href: string
  }
}

const SidebarItem = ({ route }: Props) => {
  const pathName = usePathname()
  const router = useRouter()
  const isActive =
    (pathName === "/" && route.href === "/") ||
    pathName === route.href ||
    pathName?.startsWith(`${route.href}/`);

  const clickHandler = () => {
    router.push(route.href)
  }

  return (
    <button onClick={clickHandler} type='button' className={cn("flex items-center gap-x-2 text-slate-500 text-sm font-[500] pl-6 transition-all hover:text-slate-600 hover:bg-slate-300/20", isActive && "text-sky-700 bg-sky-200/20 hover:bg-sky-200/20 hover:text-sky-700")}>
      <div className='flex items-center gap-x-2 py-4'>
        <route.icon size={22} className={cn("text-slate-500", isActive && "text-sky-700")} />
        {route.label}
      </div>
      <div className={cn('ml-auto opacity-0 border-2 border-sky-700 h-full transition-all', isActive && 'opacity-100')} />
    </button>
  )
}

export default SidebarItem