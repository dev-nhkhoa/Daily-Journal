'use client'

import { useState, useEffect, useRef } from 'react'
import { format, subDays, isSameDay, parseISO } from 'date-fns'
import { useInView } from 'react-intersection-observer'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Entry, Todo } from '@/types/entry'
import { cn } from '@/lib/utils'
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader } from './ui/sidebar'

interface SidebarProps {
  entries: Entry[]
  todos: Todo[]
  onSelectDate: (date: string) => void
  selectedDate: string
}

export function JournalSidebar({ entries, todos, onSelectDate, selectedDate }: SidebarProps) {
  const [days, setDays] = useState<Date[]>([new Date()])
  const [ref, inView] = useInView()
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const selectedDayRef = useRef<HTMLLIElement>(null)

  useEffect(() => {
    if (inView) {
      setDays((prevDays) => [
        ...prevDays,
        ...Array.from({ length: 7 }, (_, i) => subDays(prevDays[prevDays.length - 1], i + 1)),
      ])
    }
  }, [inView])

  useEffect(() => {
    if (selectedDayRef.current && scrollAreaRef.current) {
      selectedDayRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [selectedDate])

  const getEntryCount = (date: Date) => {
    const formattedDate = format(date, 'yyyy-MM-dd')
    return entries.filter((entry) => entry.date === formattedDate).length
  }

  const getTodoCount = (date: Date) => {
    const formattedDate = format(date, 'yyyy-MM-dd')
    return todos.filter((todo) => todo.date === formattedDate).length
  }

  const handleDateClick = (date: Date) => {
    const formattedDate = format(date, 'yyyy-MM-dd')
    onSelectDate(formattedDate)
  }

  return (
    <Sidebar>
      <ScrollArea ref={scrollAreaRef} className="h-screen w-64 border-r">
        <SidebarHeader>
          <h2 className="text-lg font-semibold">Journal Days</h2>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <ul className="space-y-0 relative">
              {days.map((day, index) => {
                const isSelected = isSameDay(parseISO(selectedDate), day)
                return (
                  <li key={day.toISOString()} className="relative" ref={isSelected ? selectedDayRef : null}>
                    <Button
                      variant="ghost"
                      className={cn(
                        'w-full justify-start pl-8',
                        isSelected ? 'bg-primary text-primary-foreground' : '',
                      )}
                      onClick={() => handleDateClick(day)}
                    >
                      <span
                        className={cn(
                          'absolute left-2 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-primary',
                          isSelected ? 'bg-primary-foreground' : 'bg-primary',
                        )}
                      ></span>
                      <div className="flex flex-col">
                        <span className="text-sm text-muted-foreground">{format(day, 'MMM d, yyyy')}</span>
                        <span className="text-xs">
                          <span className="text-destructive">{getEntryCount(day)}</span> entries -{' '}
                          <span className="text-destructive">{getTodoCount(day)}</span> todos
                        </span>
                      </div>
                    </Button>
                    {index < days.length - 1 && (
                      <span className="absolute left-3 top-1/2 w-0.5 h-full bg-primary opacity-30"></span>
                    )}
                  </li>
                )
              })}
              <li ref={ref}></li>
            </ul>
          </SidebarGroup>
          <SidebarGroup />
        </SidebarContent>
        <SidebarFooter />
      </ScrollArea>
    </Sidebar>
  )
}
