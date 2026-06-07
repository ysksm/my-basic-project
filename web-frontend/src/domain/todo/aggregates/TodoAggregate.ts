import { Todo } from '../entities/Todo.ts'
import type { TodoProps, TodoReconstructProps } from '../entities/Todo.ts'
import type { TodoId } from '../value-objects/TodoId.ts'
import type { TodoTitle } from '../value-objects/TodoTitle.ts'

// Aggregate root — boundary for consistency rules
// In this bounded context, Todo entity is the sole aggregate root.
export type TodoAggregate = Todo

export type UpdateTodoAggregateParams = {
  readonly title?: TodoTitle
  readonly completed?: boolean
}

// Companion object
export const TodoAggregate = {
  create(props: TodoProps): TodoAggregate {
    return Todo.create(props)
  },
  reconstruct(props: TodoReconstructProps): TodoAggregate {
    return Todo.reconstruct(props)
  },
  applyUpdate(aggregate: TodoAggregate, params: UpdateTodoAggregateParams): TodoAggregate {
    let updated = aggregate
    if (params.title !== undefined) {
      updated = Todo.changeTitle(updated, params.title)
    }
    if (params.completed !== undefined) {
      updated = params.completed ? Todo.complete(updated) : Todo.uncomplete(updated)
    }
    return updated
  },
  isSameAs(a: TodoAggregate, b: TodoAggregate): boolean {
    return Todo.isSameAs(a, b)
  },
  getId(aggregate: TodoAggregate): TodoId {
    return aggregate.id
  },
}
