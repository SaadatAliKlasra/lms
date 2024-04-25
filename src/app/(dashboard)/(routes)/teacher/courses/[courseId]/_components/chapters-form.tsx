"use client"

import * as z from "zod"
import axios from 'axios'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useState } from "react"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'

import React from 'react'
import { Loader2, Pencil, PlusCircle, Trash } from "lucide-react"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea"
import { Chapter, Course } from "@prisma/client"
import { Input } from "@/components/ui/input"
import ChaptersList from "./chapters-list"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import Editor from "@/components/editor"
import ConfirmModal from "@/components/modals/confirm-modal"


type Props = {
  initialData: Course & { chapters: Chapter[] }
}
const formSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  videoUrl: z.string().url().optional(),
  isPublished: z.boolean().default(false),
  isFree: z.boolean().default(false)
})
const ChaptersForm = (props: Props) => {
  // when user is in edit mode
  const [isEditing, setIsEditing] = useState(false)
  // when state is updating
  const [isUpdating, setisUpdating] = useState(false)
  // id of the chapter being edited
  const [editingChapterId, setEditingChapterId] = useState<string | null>(null);

  const toggleCreateHandler = () => {
    setIsEditing((current) => !current)
    setEditingChapterId(null)
    form.reset({
      title: "",
      description: "",
      videoUrl: "",
      isPublished: false,
      isFree: false
    })
  }


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: "", description: "", videoUrl: "", isPublished: false, isFree: false },
  })

  const { isSubmitting, isValid } = form.formState
  const router = useRouter()


  const chapterCreateHandler = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/courses/${props.initialData.id}/chapters`, values)
      toast.success('Chapter updated')
      setIsEditing(false)
      router.refresh();
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong")
    }
  }
  // reorderHandler
  const reorderHandler = async (updateData: { id: string, position: number }[]) => {
    try {
      setisUpdating(true)
      await axios.put(`/api/courses/${props.initialData.id}/chapters/reorder`, {
        list: updateData
      })
      toast.success('Chapters reordered')
      router.refresh()
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong")
    } finally {
      setisUpdating(false)
    }
  }
  const chapterEditHandler = (id: string) => {
    setEditingChapterId(id);
    setIsEditing(true);
    const chapterToEdit = props.initialData.chapters.find(chapter => chapter.id === id);
    if (chapterToEdit) {
      form.reset({
        title: chapterToEdit.title,
        description: chapterToEdit.description || "",
        videoUrl: chapterToEdit.videoUrl || "",
        isPublished: chapterToEdit.isPublished,
        isFree: chapterToEdit.isFree
      }); // Fill the form with existing data
    }
  };
  const chapterUpdateHandler = async (values: z.infer<typeof formSchema>) => {
    setIsEditing(true)
    try {
      await axios.put(`/api/courses/${props.initialData.id}/chapters/${editingChapterId}`, values);
      toast.success('Chapter updated');
      router.refresh();
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    } finally {
      setIsEditing(false);
    }
  };
  // on delete
  const onDeleteHandler = async () => {
    setIsEditing(true)
    try {
      await axios.delete(`/api/courses/${props.initialData.id}/chapters/${editingChapterId}`)
      toast.success('Chapter deleted')
      router.refresh();
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong")
    } finally {
      setIsEditing(false)
    }
  }
  return (
    <div className="relative mt-6 border bg-slate-100 rounded-md p-4">
      {isUpdating && <div className="absolute h-full w-full bg-slate-500/20 top-0 right-0 rounded-md flex items-center justify-center">
        <Loader2 className="animate-spin h-6 w-6 text-sky-700" />
      </div>}
      <div className="font-medium flex items-center justify-between">
        Course Chapters
        <Button variant="ghost" onClick={toggleCreateHandler}>
          {isEditing ? <>Cancel</> : (
            <><PlusCircle className="h-4 w-4 mr-2" />
              Add a Chapter</>
          )}
        </Button>
      </div>
      {isEditing && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(editingChapterId ? chapterUpdateHandler : chapterCreateHandler)} className='space-y-4 mt-4'>
            <FormField control={form.control} name='title' render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor='title'>Title</FormLabel>
                <FormControl>
                  <Input disabled={isSubmitting} placeholder="e.g Introduction to the course" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name='description' render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor='description'>Description</FormLabel>
                <FormControl>
                  <Editor {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name='videoUrl' render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor='videoUrl'>Video URL</FormLabel>
                <FormControl>
                  <Input disabled={isSubmitting} placeholder="https://www.vimeo.com/xyz" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name='isFree' render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox className="mt-0.5" checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <FormDescription>
                  Check this box if you want to make this chapter free for preview.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name='isPublished' render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox className="mt-0.5" checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <FormDescription>
                  Check this box to publish the chapter.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            <div className="flex items-center gap-x-2">
              <Button disabled={!isValid || isSubmitting} size="sm" variant="default" type="submit">{editingChapterId ? "Update" : "Create"}</Button>
              {editingChapterId &&
                (<ConfirmModal onConfirm={onDeleteHandler}>
                  <Button size="sm" variant="destructive" disabled={isSubmitting}>
                    <Trash className="h-4 w-4" />
                  </Button>
                </ConfirmModal>)
              }
            </div>
          </form>
        </Form>
      )}
      {!isEditing && (
        <>
          <div className={cn("text-sm mt-2", !props.initialData.chapters.length && "text-slate-500 italic")}>
            {!props.initialData.chapters.length && "No chapters added yet"}
            <ChaptersList onEdit={chapterEditHandler} onReorder={reorderHandler} items={props.initialData.chapters || []} />
          </div>
          <p className="text-xs text-muted-foreground mt-4">Drag and drop to reorder the chapters</p>
        </>

      )}
    </div>

  )
}

export default ChaptersForm