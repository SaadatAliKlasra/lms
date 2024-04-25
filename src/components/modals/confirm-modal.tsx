"use client"
import React from "react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog"

type Props = {
  children: React.ReactNode,
  onConfirm: () => void
}

const ConfirmModal = ({ children, onConfirm }: Props) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure?
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription>
          This action cannot be undone
        </AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogCancel>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default ConfirmModal