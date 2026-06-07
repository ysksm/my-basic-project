import type { TodoAggregate, UpdateTodoAggregateParams } from './aggregates/TodoAggregate.ts'
import type { TodoId } from './value-objects/TodoId.ts'
import type { TodoTitle } from './value-objects/TodoTitle.ts'

export interface ITodoRepository {
  findAll(): Promise<TodoAggregate[]>
  findById(id: TodoId): Promise<TodoAggregate | null>
  create(title: TodoTitle): Promise<TodoAggregate>
  update(id: TodoId, params: UpdateTodoAggregateParams): Promise<TodoAggregate>
  delete(id: TodoId): Promise<void>
}
