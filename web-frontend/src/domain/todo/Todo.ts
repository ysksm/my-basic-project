export type TodoId = number

export interface Todo {
  readonly id: TodoId
  readonly title: string
  readonly completed: boolean
  readonly createdAt: Date
}
