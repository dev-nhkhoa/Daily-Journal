'use client'

// Imports
import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { Pencil, Trash2, MoveRight, Plus } from 'lucide-react'
import { Todo } from '@/types/entry'
import { format, addDays } from 'date-fns'
import React from 'react'

// Props interface
interface TodosProps {
  todos: Todo[]
  setTodos: (todos: Todo[]) => void
  selectedDate: string | null
  lineHeight: string
}

export default function Todos({ todos, setTodos, selectedDate, lineHeight }: TodosProps) {
  // State for todos
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null)
  const [addingSupTodoId, setAddingSupTodoId] = useState<number | null>(null)
  const [newSupTodo, setNewSupTodo] = useState('')
  const [editingSupTodoId, setEditingSupTodoId] = useState<number | null>(null)
  const [editingTodoText, setEditingTodoText] = useState('')

  const handleSubmitSupTodo = (parentId: number) => {
    if (newSupTodo.trim()) {
      if (editingSupTodoId !== null) {
        setTodos(
          todos.map((todo) => {
            if (todo.id === parentId) {
              return {
                ...todo,
                supTodos: todo.supTodos.map((supTodo) =>
                  supTodo.id === editingSupTodoId ? { ...supTodo, text: newSupTodo } : supTodo,
                ),
              }
            }
            return todo
          }),
        )
        setEditingSupTodoId(null)
      } else {
        setTodos(
          todos.map((todo) => {
            if (todo.id === parentId) {
              return {
                ...todo,
                supTodos: [
                  ...todo.supTodos,
                  {
                    id: Date.now(),
                    text: newSupTodo,
                    completed: false,
                    date: selectedDate || format(new Date(), 'yyyy-MM-dd'),
                    supTodos: [],
                  },
                ],
              }
            }
            return todo
          }),
        )
      }
      setNewSupTodo('')
      setAddingSupTodoId(null)
    }
  }

  // Todo edit/delete/toggle handlers
  const handleEditTodo = (id: number) => {
    const todoToEdit = todos.find((todo) => todo.id === id)
    if (todoToEdit) {
      setEditingTodoId(id)
      setEditingTodoText(todoToEdit.text)
    }
  }

  const handleSubmitEditTodo = (id: number) => {
    if (editingTodoText.trim()) {
      setTodos(todos.map((todo) => (todo.id === id ? { ...todo, text: editingTodoText } : todo)))
      setEditingTodoId(null)
      setEditingTodoText('')
    }
  }

  const handleEditSupTodo = (parentId: number, supTodoId: number) => {
    const parentTodo = todos.find((todo) => todo.id === parentId)
    const supTodoToEdit = parentTodo?.supTodos.find((supTodo) => supTodo.id === supTodoId)
    if (supTodoToEdit) {
      setNewSupTodo(supTodoToEdit.text)
      setEditingSupTodoId(supTodoId)
      setAddingSupTodoId(parentId)
    }
  }

  const handleDeleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  const handleDeleteSupTodo = (parentId: number, supTodoId: number) => {
    setTodos(
      todos.map((todo) => {
        if (todo.id === parentId) {
          return {
            ...todo,
            supTodos: todo.supTodos.filter((supTodo) => supTodo.id !== supTodoId),
          }
        }
        return todo
      }),
    )
  }

  const handleToggleTodo = (id: number, parentId?: number) => {
    if (parentId) {
      setTodos(
        todos.map((todo) => {
          if (todo.id === parentId) {
            const updatedSupTodos = todo.supTodos.map((supTodo) =>
              supTodo.id === id ? { ...supTodo, completed: !supTodo.completed } : supTodo,
            )

            // Check if all sub-todos are completed
            const allSupTodosCompleted =
              updatedSupTodos.length > 0 && updatedSupTodos.every((supTodo) => supTodo.completed)

            return {
              ...todo,
              supTodos: updatedSupTodos,
              completed: allSupTodosCompleted,
            }
          }
          return todo
        }),
      )
    } else {
      setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)))
    }
  }

  const handleTransferTodo = (todoId: number) => {
    const todoToTransfer = todos.find((t) => t.id === todoId)

    if (todoToTransfer) {
      const nextDay = addDays(new Date(todoToTransfer.date), 1)
      const nextDayString = nextDay.toISOString().split('T')[0]

      setTodos(todos.map((todo) => (todo.id === todoId ? { ...todo, date: nextDayString } : todo)))
    }
  }

  // Render component
  return (
    <div className="space-y-4">
      {/* Todos Section */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Todos</h2>
        {todos.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">
            No todos yet. Click the &quot;Add Todo&quot; button to create one.
          </p>
        ) : (
          todos.map((todo) => (
            <Card key={todo.id} className="mb-2 hover:shadow-md transition-shadow">
              <CardContent className="p-3">
                <div className="flex flex-col">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={todo.completed}
                      onCheckedChange={() => handleToggleTodo(todo.id)}
                      className="mt-1"
                    />
                    <div className="flex-grow overflow-hidden">
                      {editingTodoId === todo.id ? (
                        <form
                          onSubmit={(e) => {
                            e.preventDefault()
                            handleSubmitEditTodo(todo.id)
                          }}
                          className="flex gap-2 flex-col"
                        >
                          <Textarea
                            value={editingTodoText}
                            onChange={(e) => setEditingTodoText(e.target.value)}
                            className="flex-grow mb-2"
                          />
                          <div className="flex gap-2">
                            <Button type="submit" size="sm">
                              Save
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setEditingTodoId(null)
                                setEditingTodoText('')
                              }}
                            >
                              Cancel
                            </Button>
                          </div>
                        </form>
                      ) : (
                        <p
                          className={`break-words w-full whitespace-pre-wrap ${
                            todo.completed ? 'line-through text-slate-500' : ''
                          } cursor-pointer`}
                          style={{ lineHeight }}
                          onClick={() => handleEditTodo(todo.id)}
                        >
                          {todo.text}
                        </p>
                      )}
                      {/* Sub Todos */}
                      {todo.supTodos && todo.supTodos.length > 0 && (
                        <ul className="ml-8 mt-3 space-y-2 w-full">
                          {todo.supTodos.map((supTodo) => (
                            <li
                              key={supTodo.id}
                              className="flex items-center gap-3 transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg p-2 w-full"
                            >
                              <Checkbox
                                checked={supTodo.completed}
                                onCheckedChange={() => handleToggleTodo(supTodo.id, todo.id)}
                                className="flex-shrink-0"
                              />
                              <div className="flex-grow min-w-0">
                                {editingSupTodoId === supTodo.id ? (
                                  <form
                                    onSubmit={(e) => {
                                      e.preventDefault()
                                      handleSubmitSupTodo(todo.id)
                                    }}
                                    className="flex gap-2 flex-col"
                                  >
                                    <Textarea
                                      value={newSupTodo}
                                      onChange={(e) => setNewSupTodo(e.target.value)}
                                      className="flex-grow mb-2"
                                    />
                                    <div className="flex gap-2">
                                      <Button type="submit" size="sm">
                                        Save
                                      </Button>
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                          setEditingSupTodoId(null)
                                          setNewSupTodo('')
                                          setAddingSupTodoId(null)
                                        }}
                                      >
                                        Cancel
                                      </Button>
                                    </div>
                                  </form>
                                ) : (
                                  <p
                                    className={`break-words whitespace-pre-wrap text-sm ${
                                      supTodo.completed ? 'line-through text-slate-500' : ''
                                    }`}
                                  >
                                    {supTodo.text}
                                  </p>
                                )}
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleEditSupTodo(todo.id, supTodo.id)}
                                  className="opacity-60 hover:opacity-100 transition-opacity flex-shrink-0"
                                >
                                  <Pencil className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDeleteSupTodo(todo.id, supTodo.id)}
                                  className="opacity-60 hover:opacity-100 transition-opacity flex-shrink-0"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setAddingSupTodoId(supTodo.id)}
                                  className="opacity-60 hover:opacity-100 transition-opacity flex-shrink-0"
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                      {/* Add Sub Todo Form */}
                      {addingSupTodoId === todo.id && !editingSupTodoId && (
                        <div className="ml-8 mt-3 w-full">
                          <form
                            onSubmit={(e) => {
                              e.preventDefault()
                              handleSubmitSupTodo(todo.id)
                            }}
                            className="flex gap-2 w-full flex-col"
                          >
                            <Input
                              value={newSupTodo}
                              onChange={(e) => setNewSupTodo(e.target.value)}
                              placeholder="Enter a sub-todo..."
                              className="w-full"
                            />
                            <div className="flex gap-2 mt-2">
                              <Button type="submit" size="sm" className="px-4">
                                Add
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setAddingSupTodoId(null)
                                  setNewSupTodo('')
                                }}
                              >
                                Cancel
                              </Button>
                            </div>
                          </form>
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Todo Actions */}
                  <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setAddingSupTodoId(todo.id)}
                      className="hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <Plus className="h-3.5 w-3.5 mr-1" />
                      Add Sub-todo
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditTodo(todo.id)}
                      className="hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <Pencil className="h-3.5 w-3.5 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteTodo(todo.id)}
                      className="hover:bg-red-100 dark:hover:bg-red-900/30"
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-1" />
                      Delete
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleTransferTodo(todo.id)}
                      className="hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <MoveRight className="h-3.5 w-3.5 mr-1" />
                      Transfer
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
