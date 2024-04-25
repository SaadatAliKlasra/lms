import React from 'react'
import Navbar from './_components/navbar'
import Sidebar from './_components/sidebar'
type Props = {
  children: React.ReactNode
}

const layout = (props: Props) => {
  return (
    <div className='h-full'>
      <div className='h-[80px] md:pl-56 fixed inset-y-0 w-full z-50'>
        <Navbar />
      </div>
      <div className='hidden md:flex h-full w-56 flex-col fixed inset-y-0 z-50'>
        <Sidebar />
      </div>
      <main className='md:pl-56 pt-[80px] h-full'>
        <div className='p-6 h-full'>
          {props.children}
        </div>
      </main>
    </div>
  )
}

export default layout