import type { TodoAggregate } from '../../domain/todo/aggregates/TodoAggregate.ts'
import type { TodoId } from '../../domain/todo/value-objects/TodoId.ts'

type Props = {
  todo: TodoAggregate
  onToggle: (id: TodoId) => Promise<void>
  onDelete: (id: TodoId) => Promise<void>
}

export function TodoItem({ todo, onToggle, onDelete }: Props) {
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
