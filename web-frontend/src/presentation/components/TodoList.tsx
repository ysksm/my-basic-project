import type { TodoAggregate } from '../../domain/todo/aggregates/TodoAggregate.ts'
import type { TodoId } from '../../domain/todo/value-objects/TodoId.ts'
import { TodoItem } from './TodoItem.tsx'

type Props = {
  todos: TodoAggregate[]
  onToggle: (id: TodoId) => Promise<void>
  onDelete: (id: TodoId) => Promise<void>
}

export function TodoList({ todos, onToggle, onDelete }: Props) {
  if (todos.length === 0) return <p>No todos yet.</p>
  return (
    <ul>
      {todos.map(todo => (
        <TodoItem key={todo.id} todo={todo} onToggle={onToggle} onDelete={onDelete} />
      ))}
    </ul>
  )
}
