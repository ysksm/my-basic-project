import type { ITodoRepository } from '../../domain/todo/ITodoRepository.ts'
import type { TodoId } from '../../domain/todo/Todo.ts'

export class DeleteTodoUseCase {
  private readonly repository: ITodoRepository
  constructor(repository: ITodoRepository) { this.repository = repository }

  async execute(id: TodoId): Promise<void> {
    return this.repository.delete(id)
  }
}
