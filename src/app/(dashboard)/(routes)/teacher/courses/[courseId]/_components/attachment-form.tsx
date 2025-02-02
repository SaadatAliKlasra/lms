"use client"

import * as z from "zod"
import axios from 'axios'

import { Button } from '@/components/ui/button'

import React from 'react'
import { File, ImageIcon, Loader2, Pencil, PlusCircle, X } from "lucide-react"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
import { Attachment, Course } from "@prisma/client"
import Image from "next/image"
import FileUpload from "@/components/file-upload"

type Props = {
  initialData: Course & { attachments: Attachment[] }
}
const formSchema = z.object({
  url: z.string().min(1)

})
const AttachmentForm = (props: Props) => {
  const [isEditing, setIsEditing] = React.useState(false)
  const [deletingId, isDeleteingId] = React.useState<string | null>(null)

  const router = useRouter()

  const toggleEditingHandler = () => setIsEditing((current) => !current)

  // handlers
  const formSubmitHandler = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/courses/${props.initialData.id}/attachments`, values)
      toast.success('Course updated')
      toggleEditingHandler()
      router.refresh();
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong")
    }
  }
  const onDeleteHandler = async (id: string) => {
    isDeleteingId(id)
    try {
      await axios.delete(`/api/courses/${props.initialData.id}/attachments/${id}`)
      toast.success('Attachment deleted')
      router.refresh();
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong")
    } finally {
      isDeleteingId(null)
    }
  }

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course Attachments
        <Button variant="ghost" onClick={toggleEditingHandler}>
          {isEditing && <>Cancel</>}
          {!isEditing && (
            <><PlusCircle className="h-4 w-4 mr-2" />
              Add a file</>
          )}

        </Button>
      </div>
      {!isEditing && (
        <>
          {props.initialData.attachments.length === 0 ? (
            <p className="text-sm mt-2 text-slate-500 italic">
              No attachments yet
            </p>
          ) : (
            <div className="space-y-2">
              {props.initialData.attachments.map((attachment) => (
                <div key={attachment.id} className="flex justify-between items-center p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md">
                  <div className="flex justify-center">
                    <File className="h-4 w-4 mr-2 flex-shrink-0" />
                    <a href={attachment.url} target="_blank" rel="noreferrer" className="text-sm underline line-clamp-1">{attachment.name}</a>
                  </div>
                  <div>
                    {deletingId === attachment.id ? (
                      <div>
                        <Loader2 className="h-4 w-4 animate-spin" />
                      </div>
                    ) : (
                      <div>
                        <button onClick={() => onDeleteHandler(attachment.id)} className="ml-auto hover:opacity-75 transition">
                          <X className="h-4 w-4" />
                        </button>
                      </div>

                    )}
                  </div>
                </div>

              ))}
            </div>
          )}
        </>
      )}
      {isEditing && (
        <div>
          <FileUpload endPoint="courseAttachment" onChange={(url) => {
            if (url) {
              formSubmitHandler({ url })
            }
          }} />
          <div className="text-xs text-muted-foreground mt-4">
            Add anything your students might need.
          </div>
        </div>
      )}
    </div>

  )
}

export default AttachmentForm