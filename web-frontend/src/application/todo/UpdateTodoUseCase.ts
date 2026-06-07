import type { TodoAggregate } from '../../domain/todo/aggregates/TodoAggregate.ts'
import type { ITodoRepository } from '../../domain/todo/ITodoRepository.ts'
import type { TodoId } from '../../domain/todo/value-objects/TodoId.ts'
import { TodoTitle } from '../../domain/todo/value-objects/TodoTitle.ts'

export type UpdateTodoInput = {
  readonly title?: string
  readonly completed?: boolean
}

export class UpdateTodoUseCase {
  private readonly repository: ITodoRepository
  constructor(repository: ITodoRepository) { this.repository = repository }

  execute(id: TodoId, input: UpdateTodoInput): Promise<TodoAggregate> {
    return this.repository.update(id, {
      title: input.title !== undefined ? TodoTitle.of(input.title) : undefined,
      completed: input.completed,
    })
  }
}
