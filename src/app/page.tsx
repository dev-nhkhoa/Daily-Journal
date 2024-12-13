'use client'

import { useState, useEffect } from 'react'
import JournalEntries from '@/components/journal-entries'
import { Entry, Todo } from '@/types/entry'
import { format } from 'date-fns'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { JournalSidebar } from '@/components/journal-sidebar'
import Link from 'next/link'
import AddNewEntry from '@/components/entries/add-new-entry'
import AddNewTodo from '@/components/todos/add-new-todo'

export default function Home() {
  const [entries, setEntries] = useState<Entry[]>([])
  const [todos, setTodos] = useState<Todo[]>([])
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'))
  const [settings, setSettings] = useState({
    fontStyle: 'sans',
    theme: 'light',
    darkMode: false,
    lineHeight: '1.5',
  })

  useEffect(() => {
    const savedSettings = localStorage.getItem('journalSettings')
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }

    const savedTodos = localStorage.getItem('todos')
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos))
    }
  }, [])

  useEffect(() => {
    document.body.className = settings.darkMode ? 'dark' : ''
  }, [settings.darkMode])

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  const filteredEntries = entries.filter((entry) => entry.date === selectedDate)
  const filteredTodos = todos.filter((todo) => todo.date === selectedDate)

  return (
    <div
      className={`flex flex-col md:flex-row h-screen ${
        settings.fontStyle === 'sans' ? 'font-sans' : settings.fontStyle === 'serif' ? 'font-serif' : 'font-mono'
      }`}
    >
      <SidebarProvider>
        <JournalSidebar entries={entries} todos={todos} onSelectDate={setSelectedDate} selectedDate={selectedDate} />
        <main className="flex-1 overflow-auto">
          <header className="bg-primary text-primary-foreground p-4 rounded-bl-lg rounded-br-lg">
            <div className="container mx-auto flex justify-between items-center">
              <Link href="/" className="text-2xl font-bold">
                Daily Journal
              </Link>
              <div className="flex gap-2 items-center">
                <AddNewEntry setEntries={setEntries} selectedDate={selectedDate} />
                <AddNewTodo setTodos={setTodos} selectedDate={selectedDate} todos={todos} />
              </div>
              <nav>
                <ul className="flex space-x-4">
                  <li>
                    <Link href="/analyst" className="text-sm">
                      Analysis
                    </Link>
                  </li>
                  <li>
                    <Link href="/settings" className="text-sm">
                      Settings
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
          </header>
          <div className="max-w-4xl mx-auto px-2 pt-2">
            <div className="flex items-center justify-between mb-4">
              <SidebarTrigger />
              <h1 className="text-2xl font-bold">{new Date(selectedDate).toLocaleDateString()} - Journal</h1>
            </div>
            <JournalEntries
              entries={filteredEntries}
              setEntries={setEntries}
              todos={filteredTodos}
              setTodos={(newTodos) => {
                const updatedTodos = todos.filter((todo) => todo.date !== selectedDate).concat(newTodos)
                setTodos(updatedTodos)
              }}
              selectedDate={selectedDate}
              lineHeight={settings.lineHeight}
            />
          </div>
        </main>
      </SidebarProvider>
    </div>
  )
}
