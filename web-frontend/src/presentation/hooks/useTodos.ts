import { useCallback, useEffect, useState } from 'react'
import type { Todo, TodoId } from '../../domain/todo/Todo.ts'
import { useDI } from '../../di/DIContext.tsx'

interface UseTodosResult {
  todos: Todo[]
  loading: boolean
  error: string | null
  createTodo: (title: string) => Promise<void>
  toggleTodo: (id: TodoId) => Promise<void>
  deleteTodo: (id: TodoId) => Promise<void>
}

export function useTodos(): UseTodosResult {
  const { listTodosUseCase, createTodoUseCase, updateTodoUseCase, deleteTodoUseCase } = useDI()
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      setTodos(await listTodosUseCase.execute())
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [listTodosUseCase])

  useEffect(() => { void load() }, [load])

  const createTodo = useCallback(async (title: string) => {
    const todo = await createTodoUseCase.execute(title)
    setTodos(prev => [...prev, todo])
  }, [createTodoUseCase])

  const toggleTodo = useCallback(async (id: TodoId) => {
    const todo = todos.find(t => t.id === id)
    if (!todo) return
    const updated = await updateTodoUseCase.execute(id, { completed: !todo.completed })
    setTodos(prev => prev.map(t => t.id === id ? updated : t))
  }, [todos, updateTodoUseCase])

  const deleteTodo = useCallback(async (id: TodoId) => {
    await deleteTodoUseCase.execute(id)
    setTodos(prev => prev.filter(t => t.id !== id))
  }, [deleteTodoUseCase])

  return { todos, loading, error, createTodo, toggleTodo, deleteTodo }
}
