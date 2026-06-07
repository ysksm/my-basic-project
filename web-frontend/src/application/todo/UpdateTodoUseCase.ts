import type { ITodoRepository, UpdateTodoParams } from '../../domain/todo/ITodoRepository.ts'
import type { Todo, TodoId } from '../../domain/todo/Todo.ts'

export class UpdateTodoUseCase {
  private readonly repository: ITodoRepository
  constructor(repository: ITodoRepository) { this.repository = repository }

  async execute(id: TodoId, params: UpdateTodoParams): Promise<Todo> {
    return this.repository.update(id, params)
  }
}
