import type { ITodoRepository } from '../../domain/todo/ITodoRepository.ts'
import type { Todo } from '../../domain/todo/Todo.ts'

export class ListTodosUseCase {
  private readonly repository: ITodoRepository
  constructor(repository: ITodoRepository) { this.repository = repository }

  async execute(): Promise<Todo[]> {
    return this.repository.findAll()
  }
}
