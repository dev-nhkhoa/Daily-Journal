'use client'

// Imports

import { Entry, Todo } from '@/types/entry'

import React from 'react'
import JournalSection from './entries/page'
import Todos from './todos/page'

// Props interface
interface JournalEntriesProps {
  entries: Entry[]
  setEntries: React.Dispatch<React.SetStateAction<Entry[]>>
  todos: Todo[]
  setTodos: (todos: Todo[]) => void
  selectedDate: string | null
  lineHeight: string
}

export default function JournalEntries({
  entries,
  setEntries,
  todos,
  setTodos,
  selectedDate,
  lineHeight,
}: JournalEntriesProps) {
  // Render component
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[calc(100vh-8rem)] overflow-hidden">
      <div className="overflow-y-auto px-2">
        <JournalSection entries={entries} setEntries={setEntries} selectedDate={selectedDate} lineHeight={lineHeight} />
      </div>
      <div className="overflow-y-auto px-2">
        <Todos todos={todos} setTodos={setTodos} selectedDate={selectedDate} lineHeight={lineHeight} />
      </div>
    </div>
  )
}
