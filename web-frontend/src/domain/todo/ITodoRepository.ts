import type { Todo, TodoId } from './Todo.ts'

export interface CreateTodoParams {
  title: string
}

export interface UpdateTodoParams {
  title?: string
  completed?: boolean
}

export interface ITodoRepository {
  findAll(): Promise<Todo[]>
  findById(id: TodoId): Promise<Todo | null>
  create(params: CreateTodoParams): Promise<Todo>
  update(id: TodoId, params: UpdateTodoParams): Promise<Todo>
  delete(id: TodoId): Promise<void>
}
