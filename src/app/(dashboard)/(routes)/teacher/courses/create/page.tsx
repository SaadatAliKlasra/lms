"use client"

import React from 'react'
import { z } from "zod"
import axios from 'axios'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import toast from 'react-hot-toast'

const formSchema = z.object({
  title: z.string().min(1, {
    message: 'Title is required',
  })
})

type Props = {}

const Page = (props: Props) => {

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  })

  const { isSubmitting, isValid } = form.formState
  const router = useRouter()
  const submitHandler = (values: z.infer<typeof formSchema>) => {
    axios.post('/api/courses', values).then((res) => {
      router.push(`/teacher/courses/${res.data.id}`)
      toast.success('Course created successfully')
    }).catch((err) => {
      toast.error(err.message)
    })
  }
  return (
    <div className='max-w-5xl mx-auto flex md:items-center md:justify-center h-full'>
      <div>
        <h1 className='text-2xl'>Name Your Course</h1>
        <p className='text-sm text-slate-600'>What would you like to name your course?</p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(submitHandler)} className='space-y-8 mt-8'>
            <FormField control={form.control} name='title' render={({ field }) => (<FormItem>
              <FormLabel htmlFor='title'>Course Title</FormLabel>
              <FormControl>
                <Input disabled={isSubmitting} placeholder="e.g Advance English Course" {...field} />
              </FormControl>
              <FormDescription>What will you teach in this course?</FormDescription>
              <FormMessage />
            </FormItem>)} />
            <div className='flex items-center gap-x-2'>
              <Link href="/teacher/courses">
                <Button type='button' variant="ghost">Cancel</Button>
              </Link>
              <Button type='submit' disabled={!isValid || isSubmitting}>Continue</Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default Page