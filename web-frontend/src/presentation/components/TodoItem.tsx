import type { Todo, TodoId } from '../../domain/todo/Todo.ts'

interface TodoItemProps {
  todo: Todo
  onToggle: (id: TodoId) => Promise<void>
  onDelete: (id: TodoId) => Promise<void>
}

export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  return (
    <li>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => void onToggle(todo.id)}
      />
      <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
        {todo.title}
      </span>
      <button onClick={() => void onDelete(todo.id)}>Delete</button>
    </li>
  )
}
