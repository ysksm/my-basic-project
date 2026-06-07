import type {
  CreateTodoParams,
  ITodoRepository,
  UpdateTodoParams,
} from '../../domain/todo/ITodoRepository.ts'
import type { Todo, TodoId } from '../../domain/todo/Todo.ts'
import { apiClient } from './apiClient.ts'

interface TodoDto {
  id: number
  title: string
  completed: boolean
  created_at: string
}

function toTodo(dto: TodoDto): Todo {
  return {
    id: dto.id,
    title: dto.title,
    completed: dto.completed,
    createdAt: new Date(dto.created_at),
  }
}

export class TodoApiRepository implements ITodoRepository {
  async findAll(): Promise<Todo[]> {
    const dtos = await apiClient.get<TodoDto[]>('/todos')
    return dtos.map(toTodo)
  }

  async findById(id: TodoId): Promise<Todo | null> {
    try {
      const dto = await apiClient.get<TodoDto>(`/todos/${id}`)
      return toTodo(dto)
    } catch {
      return null
    }
  }

  async create(params: CreateTodoParams): Promise<Todo> {
    const dto = await apiClient.post<TodoDto>('/todos', { title: params.title })
    return toTodo(dto)
  }

  async update(id: TodoId, params: UpdateTodoParams): Promise<Todo> {
    const dto = await apiClient.put<TodoDto>(`/todos/${id}`, params)
    return toTodo(dto)
  }

  async delete(id: TodoId): Promise<void> {
    await apiClient.delete(`/todos/${id}`)
  }
}
