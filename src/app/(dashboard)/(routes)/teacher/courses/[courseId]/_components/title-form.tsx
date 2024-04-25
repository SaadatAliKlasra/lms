"use client"

import * as z from "zod"
import axios from 'axios'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from "@/components/ui/input"
import { Button } from '@/components/ui/button'

import React from 'react'
import { Pencil } from "lucide-react"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"

type Props = {
  initialData: {
    id: string
    title: string
  }
}
const formSchema = z.object({
  title: z.string().min(1, {
    message: 'Title is required',
  })

})
const TitleForm = (props: Props) => {
  const [isEditing, setIsEditing] = React.useState(false)


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: props.initialData,
  })

  const { isSubmitting, isValid } = form.formState
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
        Course title
        <Button variant="ghost" onClick={toggleEditingHandler}>
          {isEditing ? <>Cancel</> : (
            <><Pencil className="h-4 w-4 mr-2" />
              Edit Title</>
          )}
        </Button>
      </div>
      {!isEditing && (
        <div className="text-sm mt-2">
          {props.initialData.title}
        </div>
      )}
      {isEditing && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(formSubmitHandler)} className='space-y-4 mt-4'>
            <FormField control={form.control} name='title' render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor='title'>Course Title</FormLabel>
                <FormControl>
                  <Input disabled={isSubmitting} placeholder="e.g Advance English Course" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>)} />
            <div className="flex items-center gap-x-2">
              <Button disabled={!isValid || isSubmitting} type="submit">Save</Button>
            </div>
          </form>
        </Form>
      )}
    </div>

  )
}

export default TitleForm