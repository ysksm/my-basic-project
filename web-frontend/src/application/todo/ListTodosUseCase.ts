import type { TodoAggregate } from '../../domain/todo/aggregates/TodoAggregate.ts'
import type { ITodoRepository } from '../../domain/todo/ITodoRepository.ts'

export class ListTodosUseCase {
  private readonly repository: ITodoRepository
  constructor(repository: ITodoRepository) { this.repository = repository }

  execute(): Promise<TodoAggregate[]> {
    return this.repository.findAll()
  }
}
