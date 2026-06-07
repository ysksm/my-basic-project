import { useCallback, useEffect, useState } from 'react'
import type { TodoAggregate } from '../../domain/todo/aggregates/TodoAggregate.ts'
import type { TodoId } from '../../domain/todo/value-objects/TodoId.ts'
import { useDI } from '../../di/DIContext.tsx'

export type UseTodosResult = {
  todos: TodoAggregate[]
  loading: boolean
  error: string | null
  createTodo: (rawTitle: string) => Promise<void>
  toggleTodo: (id: TodoId) => Promise<void>
  deleteTodo: (id: TodoId) => Promise<void>
}

export function useTodos(): UseTodosResult {
  const { listTodosUseCase, createTodoUseCase, updateTodoUseCase, deleteTodoUseCase } = useDI()
  const [todos, setTodos] = useState<TodoAggregate[]>([])
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

  const createTodo = useCallback(async (rawTitle: string) => {
    try {
      const todo = await createTodoUseCase.execute(rawTitle)
      setTodos(prev => [...prev, todo])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error')
    }
  }, [createTodoUseCase])

  const toggleTodo = useCallback(async (id: TodoId) => {
    const todo = todos.find(t => t.id === id)
    if (!todo) return
    try {
      const updated = await updateTodoUseCase.execute(id, { completed: !todo.completed })
      setTodos(prev => prev.map(t => t.id === id ? updated : t))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error')
    }
  }, [todos, updateTodoUseCase])

  const deleteTodo = useCallback(async (id: TodoId) => {
    try {
      await deleteTodoUseCase.execute(id)
      setTodos(prev => prev.filter(t => t.id !== id))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error')
    }
  }, [deleteTodoUseCase])

  return { todos, loading, error, createTodo, toggleTodo, deleteTodo }
}
