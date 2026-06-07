import type { ITodoRepository } from '../../domain/todo/ITodoRepository.ts'
import type { TodoId } from '../../domain/todo/value-objects/TodoId.ts'

export class DeleteTodoUseCase {
  private readonly repository: ITodoRepository
  constructor(repository: ITodoRepository) { this.repository = repository }

  execute(id: TodoId): Promise<void> {
    return this.repository.delete(id)
  }
}
