export interface Todo {
  id: number
  text: string
  completed: boolean
  date: string
  supTodos: Todo[] & { supTodos: Todo[] }[]
}

export interface Entry {
  id: number
  text: string
  date: string
  supEntries: Entry[]
}
