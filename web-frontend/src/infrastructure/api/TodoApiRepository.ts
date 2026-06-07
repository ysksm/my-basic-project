import type { ITodoRepository } from '../../domain/todo/ITodoRepository.ts'
import type { UpdateTodoAggregateParams } from '../../domain/todo/aggregates/TodoAggregate.ts'
import { TodoAggregate } from '../../domain/todo/aggregates/TodoAggregate.ts'
import type { TodoId } from '../../domain/todo/value-objects/TodoId.ts'
import { TodoId as TodoIdVO } from '../../domain/todo/value-objects/TodoId.ts'
import type { TodoTitle } from '../../domain/todo/value-objects/TodoTitle.ts'
import { TodoTitle as TodoTitleVO } from '../../domain/todo/value-objects/TodoTitle.ts'
import { apiClient } from './apiClient.ts'

type TodoDto = {
  id: number
  title: string
  completed: boolean
  created_at: string
}

function fromDto(dto: TodoDto): TodoAggregate {
  return TodoAggregate.create({
    id: TodoIdVO.fromTrusted(dto.id),
    title: TodoTitleVO.of(dto.title),
    createdAt: new Date(dto.created_at),
  })
}

export class TodoApiRepository implements ITodoRepository {
  async findAll(): Promise<TodoAggregate[]> {
    const dtos = await apiClient.get<TodoDto[]>('/todos')
    return dtos.map(fromDto)
  }

  async findById(id: TodoId): Promise<TodoAggregate | null> {
    try {
      const dto = await apiClient.get<TodoDto>(`/todos/${id}`)
      return fromDto(dto)
    } catch {
      return null
    }
  }

  async create(title: TodoTitle): Promise<TodoAggregate> {
    const dto = await apiClient.post<TodoDto>('/todos', { title: TodoTitleVO.unwrap(title) })
    return fromDto(dto)
  }

  async update(id: TodoId, params: UpdateTodoAggregateParams): Promise<TodoAggregate> {
    const body: Record<string, unknown> = {}
    if (params.title !== undefined) body.title = TodoTitleVO.unwrap(params.title)
    if (params.completed !== undefined) body.completed = params.completed
    const dto = await apiClient.put<TodoDto>(`/todos/${TodoIdVO.unwrap(id)}`, body)
    return fromDto(dto)
  }

  async delete(id: TodoId): Promise<void> {
    await apiClient.delete(`/todos/${TodoIdVO.unwrap(id)}`)
  }
}
