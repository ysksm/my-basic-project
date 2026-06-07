import { useTodos } from '../hooks/useTodos.ts'
import { TodoForm } from '../components/TodoForm.tsx'
import { TodoList } from '../components/TodoList.tsx'

export function TodoPage() {
  const { todos, loading, error, createTodo, toggleTodo, deleteTodo } = useTodos()

  return (
    <main>
      <h1>Todo</h1>
      <TodoForm onSubmit={createTodo} />
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && (
        <TodoList todos={todos} onToggle={toggleTodo} onDelete={deleteTodo} />
      )}
    </main>
  )
}
