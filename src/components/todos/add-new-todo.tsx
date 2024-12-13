'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { format } from 'date-fns'
import { Todo } from '@/types/entry'
import { PlusIcon } from 'lucide-react'

interface AddNewTodoProps {
  todos: Todo[]
  setTodos: (todos: Todo[]) => void
  selectedDate: string | null
}

const AddNewTodo = ({ todos, setTodos, selectedDate }: AddNewTodoProps) => {
  const [newTodo, setNewTodo] = useState('')
  const [open, setOpen] = useState(false)

  const handleSubmitTodo = (e: React.FormEvent) => {
    e.preventDefault()
    if (newTodo.trim()) {
      setTodos([
        ...todos,
        {
          id: Date.now(),
          text: newTodo,
          completed: false,
          date: selectedDate || format(new Date(), 'yyyy-MM-dd'),
          supTodos: [],
        },
      ])
      setNewTodo('')
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full md:w-auto text-primary" variant="outline">
          <PlusIcon className="w-4 h-4 mr-2" />
          Add Todo
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Todo</DialogTitle>
        </DialogHeader>
        <form className="flex-1" onSubmit={handleSubmitTodo}>
          <div className="flex flex-col gap-2">
            <Input
              type="text"
              placeholder="Enter a new todo..."
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
            />
            <Button type="submit" className="w-full md:w-auto">
              Add Todo
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AddNewTodo
