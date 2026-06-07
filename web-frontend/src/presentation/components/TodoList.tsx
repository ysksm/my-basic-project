import type { Todo, TodoId } from '../../domain/todo/Todo.ts'
import { TodoItem } from './TodoItem.tsx'

interface TodoListProps {
  todos: Todo[]
  onToggle: (id: TodoId) => Promise<void>
  onDelete: (id: TodoId) => Promise<void>
}

export function TodoList({ todos, onToggle, onDelete }: TodoListProps) {
  if (todos.length === 0) {
    return <p>No todos yet.</p>
  }
  return (
    <ul>
      {todos.map(todo => (
        <TodoItem key={todo.id} todo={todo} onToggle={onToggle} onDelete={onDelete} />
      ))}
    </ul>
  )
}
