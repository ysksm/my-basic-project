import { CreateTodoUseCase } from '../application/todo/CreateTodoUseCase.ts'
import { DeleteTodoUseCase } from '../application/todo/DeleteTodoUseCase.ts'
import { ListTodosUseCase } from '../application/todo/ListTodosUseCase.ts'
import { UpdateTodoUseCase } from '../application/todo/UpdateTodoUseCase.ts'
import type { ITodoRepository } from '../domain/todo/ITodoRepository.ts'
import { TodoApiRepository } from '../infrastructure/api/TodoApiRepository.ts'

export interface DIContainer {
  listTodosUseCase: ListTodosUseCase
  createTodoUseCase: CreateTodoUseCase
  updateTodoUseCase: UpdateTodoUseCase
  deleteTodoUseCase: DeleteTodoUseCase
}

export function createContainer(
  repository: ITodoRepository = new TodoApiRepository(),
): DIContainer {
  return {
    listTodosUseCase: new ListTodosUseCase(repository),
    createTodoUseCase: new CreateTodoUseCase(repository),
    updateTodoUseCase: new UpdateTodoUseCase(repository),
    deleteTodoUseCase: new DeleteTodoUseCase(repository),
  }
}
