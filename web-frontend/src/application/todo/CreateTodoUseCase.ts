import type { TodoAggregate } from '../../domain/todo/aggregates/TodoAggregate.ts'
import type { ITodoRepository } from '../../domain/todo/ITodoRepository.ts'
import { TodoTitle } from '../../domain/todo/value-objects/TodoTitle.ts'

export class CreateTodoUseCase {
  private readonly repository: ITodoRepository
  constructor(repository: ITodoRepository) { this.repository = repository }

  execute(rawTitle: string): Promise<TodoAggregate> {
    const title = TodoTitle.of(rawTitle)  // validation at domain boundary
    return this.repository.create(title)
  }
}
