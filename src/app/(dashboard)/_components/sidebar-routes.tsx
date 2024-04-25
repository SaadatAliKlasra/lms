"use client"

import React from 'react'
import { Layout, Compass, List, BarChart } from 'lucide-react'
import SidebarItem from './sidebar-item'
import { usePathname } from 'next/navigation'

type Props = {}

const guestRoutes = [
  {
    icon: Layout,
    label: 'Dashboard',
    href: '/',
  },
  {
    icon: Compass,
    label: 'Browse',
    href: '/search',
  },
]
const teacherRoutes = [
  {
    icon: List,
    label: 'Courses',
    href: '/teacher/courses',
  },
  {
    icon: BarChart,
    label: 'Analytics',
    href: '/teacher/analytics',
  },
]
const SidebarRoutes = (props: Props) => {
  const pathName = usePathname()
  const isTeacherPage = pathName?.includes('/teacher')
  const routes = isTeacherPage ? teacherRoutes : guestRoutes
  return (
    <div className='flex flex-col w-full'>
      {routes.map((route, index) => (
        <SidebarItem key={index} route={route} />
      ))}

    </div>
  )
}

export default SidebarRoutes