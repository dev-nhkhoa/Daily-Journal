'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { format } from 'date-fns'
import { Entry } from '@/types/entry'
import { PlusIcon } from 'lucide-react'

interface AddNewEntryProps {
  setEntries: React.Dispatch<React.SetStateAction<Entry[]>>
  selectedDate: string | null
}

const AddNewEntry = ({ setEntries, selectedDate }: AddNewEntryProps) => {
  const [newEntry, setNewEntry] = useState('')
  const [open, setOpen] = useState(false)

  const handleSubmitEntry = (e: React.FormEvent) => {
    e.preventDefault()
    if (newEntry.trim()) {
      const currentDate = format(new Date(), 'yyyy-MM-dd')
      const currentTime = format(new Date(), 'hh:mm:ss a')
      const entryHeader = `${currentDate} ${currentTime}`

      setEntries((prevEntries) => [
        ...prevEntries,
        {
          id: Date.now(),
          text: `${entryHeader}\n${newEntry}`,
          date: selectedDate || format(new Date(), 'yyyy-MM-dd'),
          supEntries: [],
        },
      ])
      setNewEntry('')
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full md:w-auto text-primary" variant="outline">
          <PlusIcon className="w-4 h-4 mr-2" />
          Add Journal
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Journal Entry</DialogTitle>
        </DialogHeader>
        <form className="flex-1" onSubmit={handleSubmitEntry}>
          <div className="flex flex-col gap-1">
            <Textarea
              placeholder="Enter your journal entry..."
              className="min-h-[100px]"
              value={newEntry}
              onChange={(e) => setNewEntry(e.target.value)}
            />
            <Button type="submit" className="w-full md:w-auto">
              Add Journal
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AddNewEntry
