import React from 'react'
import Image from 'next/image'

type Props = {}

const Logo = (props: Props) => {
  return (
    <Image src='/logo.svg' alt='logo' width={30} height={30} />
  )
}

export default Logo