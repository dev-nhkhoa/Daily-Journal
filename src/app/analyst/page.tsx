'use client'

import { useState, useEffect } from 'react'
import { Todo } from '@/types/entry'
import { format, eachDayOfInterval, startOfMonth, endOfMonth } from 'date-fns'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

export default function AnalystPage() {
  const [todos, setTodos] = useState<Todo[]>([])

  useEffect(() => {
    const savedTodos = localStorage.getItem('todos')
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos))
    }
  }, [])

  const currentMonth = new Date()
  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  })

  const todosByDay = daysInMonth.map((day) => {
    const dayStr = format(day, 'yyyy-MM-dd')
    const dayTodos = todos.filter((todo) => todo.date === dayStr)
    return {
      date: dayStr,
      total: dayTodos.length,
      completed: dayTodos.filter((todo) => todo.completed).length,
    }
  })

  const totalTodos = todos.length
  const completedTodos = todos.filter((todo) => todo.completed).length
  const incompleteTodos = totalTodos - completedTodos

  const pieData = [
    { name: 'Completed', value: completedTodos },
    { name: 'Incomplete', value: incompleteTodos },
  ]

  const COLORS = ['#0088FE', '#00C49F']

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Todo Analysis</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Monthly Todo Heatmap</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={todosByDay}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="total" stroke="#8884d8" name="Total Todos" />
            <Line type="monotone" dataKey="completed" stroke="#82ca9d" name="Completed Todos" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Todo Completion Rate</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
