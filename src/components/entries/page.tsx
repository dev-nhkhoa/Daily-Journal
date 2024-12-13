'use client'

// Imports
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { Entry } from '@/types/entry'
import { format } from 'date-fns'
import React from 'react'

// Props interface
interface JournalSectionProps {
  entries: Entry[]
  setEntries: React.Dispatch<React.SetStateAction<Entry[]>>
  selectedDate: string | null
  lineHeight: string
}

export default function JournalSection({ entries, setEntries, selectedDate, lineHeight }: JournalSectionProps) {
  // State for entries

  const [editEntry, setEditEntry] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [addingSupEntryId, setAddingSupEntryId] = useState<number | null>(null)
  const [newSupEntry, setNewSupEntry] = useState('')
  const [editingSupEntryId, setEditingSupEntryId] = useState<number | null>(null)
  const [editSupEntry, setEditSupEntry] = useState('')

  const handleSubmitEditEntry = (e: React.FormEvent) => {
    e.preventDefault()
    if (editEntry.trim() && editingId !== null) {
      const currentDate = format(new Date(), 'yyyy-MM-dd')
      const currentTime = format(new Date(), 'hh:mm:ss a')
      const entryHeader = `${currentDate} ${currentTime}`

      setEntries(
        entries.map((entry) => (entry.id === editingId ? { ...entry, text: `${entryHeader}\n${editEntry}` } : entry)),
      )
      setEditingId(null)
      setEditEntry('')
    }
  }

  const handleSubmitSupEntry = (parentId: number) => {
    if (newSupEntry.trim()) {
      const currentDate = format(new Date(), 'yyyy-MM-dd')
      const currentTime = format(new Date(), 'hh:mm:ss a')
      const entryHeader = `${currentDate} ${currentTime}`

      setEntries(
        entries.map((entry) => {
          if (entry.id === parentId) {
            return {
              ...entry,
              supEntries: [
                ...entry.supEntries,
                {
                  id: Date.now(),
                  text: `${entryHeader}\n${newSupEntry}`,
                  date: selectedDate || format(new Date(), 'yyyy-MM-dd'),
                  supEntries: [],
                },
              ],
            }
          }
          return entry
        }),
      )

      setNewSupEntry('')
      setAddingSupEntryId(null)
    }
  }

  // Entry edit/delete handlers
  const handleEditEntry = (id: number) => {
    const entryToEdit = entries.find((entry) => entry.id === id)
    if (entryToEdit) {
      setEditEntry(entryToEdit.text.split('\n').slice(1).join('\n'))
      setEditingId(id)
    }
  }

  const handleDeleteEntry = (id: number) => {
    setEntries(entries.filter((entry) => entry.id !== id))
  }

  const handleEditSupEntry = (parentId: number, supEntryId: number) => {
    const parentEntry = entries.find((entry) => entry.id === parentId)
    const supEntryToEdit = parentEntry?.supEntries.find((supEntry) => supEntry.id === supEntryId)
    if (supEntryToEdit) {
      setEditSupEntry(supEntryToEdit.text.split('\n').slice(1).join('\n'))
      setEditingSupEntryId(supEntryId)
    }
  }

  const handleSubmitEditSupEntry = (parentId: number, supEntryId: number) => {
    if (editSupEntry.trim()) {
      const currentDate = format(new Date(), 'yyyy-MM-dd')
      const currentTime = format(new Date(), 'hh:mm:ss a')
      const entryHeader = `${currentDate} ${currentTime}`

      setEntries(
        entries.map((entry) => {
          if (entry.id === parentId) {
            return {
              ...entry,
              supEntries: entry.supEntries.map((supEntry) =>
                supEntry.id === supEntryId ? { ...supEntry, text: `${entryHeader}\n${editSupEntry}` } : supEntry,
              ),
            }
          }
          return entry
        }),
      )
      setEditingSupEntryId(null)
      setEditSupEntry('')
    }
  }

  const handleDeleteSupEntry = (parentId: number, supEntryId: number) => {
    setEntries(
      entries.map((entry) => {
        if (entry.id === parentId) {
          return {
            ...entry,
            supEntries: entry.supEntries.filter((supEntry) => supEntry.id !== supEntryId),
          }
        }
        return entry
      }),
    )
  }

  // Render component
  return (
    <div className="space-y-4">
      {/* Content Grid */}
      <div className="w-full flex flex-col gap-4">
        {/* Journal Entries Section */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Journal Entries</h2>
          {entries.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No journal entries yet. Click the &quot;Add Journal&quot; button to create one.
            </p>
          ) : (
            <ul className="space-y-2">
              {entries.map((entry) => (
                <li key={entry.id} className="group">
                  {editingId === entry.id ? (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault()
                        handleSubmitEditEntry(e)
                      }}
                      className="flex flex-col gap-2"
                    >
                      <Textarea
                        value={editEntry}
                        onChange={(e) => setEditEntry(e.target.value)}
                        className="min-h-[100px] w-full"
                        style={{ lineHeight }}
                      />
                      <div className="flex justify-end gap-2">
                        <Button type="submit">Save</Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setEditingId(null)
                            setEditEntry('')
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div className="flex flex-col">
                      <div className="flex items-start">
                        <span className="mr-2 flex-shrink-0">•</span>
                        <div className="flex-grow overflow-hidden">
                          <p
                            className="text-justify break-words cursor-pointer whitespace-pre-wrap"
                            onClick={() => handleEditEntry(entry.id)}
                            style={{ lineHeight }}
                          >
                            {entry.text.split('\n').map((line, index) => (
                              <React.Fragment key={index}>
                                {index === 0 ? (
                                  <strong className="text-primary">
                                    <span className="text-secondary-foreground">{line.split(' ')[0]}</span>
                                    <span className="ml-2">{line.split(' ').slice(1).join(' ')}</span>
                                  </strong>
                                ) : (
                                  line
                                )}
                                {index < entry.text.split('\n').length - 1 && <br />}
                              </React.Fragment>
                            ))}
                          </p>
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity ml-2 flex-shrink-0">
                          <Button variant="outline" size="icon" onClick={() => setAddingSupEntryId(entry.id)}>
                            <Plus className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon" onClick={() => handleDeleteEntry(entry.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Sub Entries */}
                      {entry.supEntries && entry.supEntries.length > 0 && (
                        <ul className="ml-8 mt-2 space-y-2">
                          {entry.supEntries.map((supEntry) => (
                            <li key={supEntry.id} className="group flex items-start">
                              <span className="mr-2 flex-shrink-0">◦</span>
                              {editingSupEntryId === supEntry.id ? (
                                <form
                                  onSubmit={(e) => {
                                    e.preventDefault()
                                    handleSubmitEditSupEntry(entry.id, supEntry.id)
                                  }}
                                  className="flex flex-col gap-2 flex-grow"
                                >
                                  <Textarea
                                    value={editSupEntry}
                                    onChange={(e) => setEditSupEntry(e.target.value)}
                                    className="min-h-[80px] w-full"
                                    style={{ lineHeight }}
                                  />
                                  <div className="flex justify-end gap-2">
                                    <Button type="submit" size="sm">
                                      Save
                                    </Button>
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        setEditingSupEntryId(null)
                                        setEditSupEntry('')
                                      }}
                                    >
                                      Cancel
                                    </Button>
                                  </div>
                                </form>
                              ) : (
                                <div className="w-full flex flex-col flex-grow">
                                  <div className="flex items-start">
                                    <div className="flex-grow overflow-hidden">
                                      <p
                                        className="text-justify break-words cursor-pointer whitespace-pre-wrap"
                                        onClick={() => handleEditSupEntry(entry.id, supEntry.id)}
                                        style={{ lineHeight }}
                                      >
                                        {supEntry.text.split('\n').map((line, index) => (
                                          <React.Fragment key={index}>
                                            {index === 0 ? (
                                              <strong className="text-primary">
                                                <span className="text-secondary-foreground">{line.split(' ')[0]}</span>
                                                <span className="ml-2">{line.split(' ').slice(1).join(' ')}</span>
                                              </strong>
                                            ) : (
                                              line
                                            )}
                                            {index < supEntry.text.split('\n').length - 1 && <br />}
                                          </React.Fragment>
                                        ))}
                                      </p>
                                    </div>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity ml-2 flex-shrink-0">
                                      <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => handleEditSupEntry(entry.id, supEntry.id)}
                                      >
                                        <Pencil className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => handleDeleteSupEntry(entry.id, supEntry.id)}
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </li>
                          ))}
                        </ul>
                      )}

                      {/* Add Sub Entry Form */}
                      {addingSupEntryId === entry.id && (
                        <div className="ml-8 mt-2">
                          <form
                            onSubmit={(e) => {
                              e.preventDefault()
                              handleSubmitSupEntry(entry.id)
                            }}
                            className="flex flex-col gap-2"
                          >
                            <Textarea
                              value={newSupEntry}
                              onChange={(e) => setNewSupEntry(e.target.value)}
                              placeholder="Enter a sub-entry..."
                              className="min-h-[80px]"
                              style={{ lineHeight }}
                            />
                            <div className="flex justify-end gap-2">
                              <Button type="submit" size="sm">
                                Add
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setAddingSupEntryId(null)
                                  setNewSupEntry('')
                                }}
                              >
                                Cancel
                              </Button>
                            </div>
                          </form>
                        </div>
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
