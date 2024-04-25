"use client"

import * as z from "zod"
import axios from 'axios'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'

import React from 'react'
import { Pencil } from "lucide-react"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea"
import { Course } from "@prisma/client"
import { Input } from "@/components/ui/input"
import { formatPrice } from "@/lib/format"

type Props = {
  initialData: Course
}
const formSchema = z.object({
  price: z.coerce.number()

})
const PriceForm = (props: Props) => {
  const [isEditing, setIsEditing] = React.useState(false)


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { price: props.initialData.price || undefined },
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
        Course Price
        <Button variant="ghost" onClick={toggleEditingHandler}>
          {isEditing ? <>Cancel</> : (
            <><Pencil className="h-4 w-4 mr-2" />
              Edit Price</>
          )}
        </Button>
      </div>
      {!isEditing && (
        <div className={cn("text-sm mt-2", !props.initialData.price && "text-slate-500 italic")}>
          {formatPrice(props.initialData.price || undefined)}
        </div>
      )}
      {isEditing && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(formSubmitHandler)} className='space-y-4 mt-4'>
            <FormField control={form.control} name='price' render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor='price'>Course Price</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" disabled={isSubmitting} placeholder="e.g 100" {...field} />
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

export default PriceForm