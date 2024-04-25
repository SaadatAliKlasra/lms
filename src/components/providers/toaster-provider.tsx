"use client"

import React from 'react'
import { Toaster } from 'react-hot-toast'
type Props = {}

const ToasterProvider = (props: Props) => {
  return <Toaster
    position="bottom-right"
    reverseOrder={false}
  />
}

export default ToasterProvider