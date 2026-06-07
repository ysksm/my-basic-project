import type { ITodoRepository } from '../../domain/todo/ITodoRepository.ts'
import type { Todo } from '../../domain/todo/Todo.ts'

export class CreateTodoUseCase {
  private readonly repository: ITodoRepository
  constructor(repository: ITodoRepository) { this.repository = repository }

  async execute(title: string): Promise<Todo> {
    if (title.trim() === '') {
      throw new Error('Title must not be empty')
    }
    return this.repository.create({ title: title.trim() })
  }
}
