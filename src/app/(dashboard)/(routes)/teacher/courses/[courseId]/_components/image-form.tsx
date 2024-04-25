"use client"

import * as z from "zod"
import axios from 'axios'

import { Button } from '@/components/ui/button'

import React from 'react'
import { ImageIcon, Pencil, PlusCircle } from "lucide-react"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
import { Course } from "@prisma/client"
import Image from "next/image"
import FileUpload from "@/components/file-upload"

type Props = {
  initialData: Course
}
const formSchema = z.object({
  imageUrl: z.string().min(1, {
    message: 'Image is required',
  })

})
const ImageForm = (props: Props) => {
  const [isEditing, setIsEditing] = React.useState(false)


  const router = useRouter()

  const toggleEditingHandler = () => setIsEditing((current) => !current)
  const formSubmitHandler = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${props.initialData.id}`, values)
      toast.success('Course updated')
      toggleEditingHandler()
      router.refresh();
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong")
    }
  }

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course Image
        <Button variant="ghost" onClick={toggleEditingHandler}>
          {isEditing && <>Cancel</>}

          {!isEditing && props.initialData.imageUrl && (
            <><Pencil className="h-4 w-4 mr-2" />
              Edit Image</>
          )}
          {!isEditing && !props.initialData.imageUrl && (
            <><PlusCircle className="h-4 w-4 mr-2" />
              Add an Image</>
          )
          }
        </Button>
      </div>
      {!isEditing && (
        !props.initialData.imageUrl ? (
          <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
            <ImageIcon className="h-10 w-10 text-slate-500" />
          </div>
        ) : (
          <div className="relative aspect-video mt-2">
            <Image src={props.initialData.imageUrl} fill className="object-cover rounded-mg" alt="upload image" />
          </div>
        )
      )}
      {isEditing && (
        <div>
          <FileUpload endPoint="courseImage" onChange={(url) => {
            if (url) {
              formSubmitHandler({ imageUrl: url })
            }
          }} />
          <div className="text-xs text-muted-foreground mt-4">
            16:9 aspect ratio recommended
          </div>
        </div>
      )}
    </div>

  )
}

export default ImageForm