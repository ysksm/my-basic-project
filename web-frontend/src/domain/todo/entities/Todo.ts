import type { TodoId } from '../value-objects/TodoId.ts'
import type { TodoTitle } from '../value-objects/TodoTitle.ts'

// Entity — identity by TodoId
export type Todo = {
  readonly id: TodoId
  readonly title: TodoTitle
  readonly completed: boolean
  readonly createdAt: Date
}

export type TodoProps = {
  readonly id: TodoId
  readonly title: TodoTitle
  readonly createdAt: Date
}

export type TodoReconstructProps = TodoProps & { readonly completed: boolean }

// Companion object
export const Todo = {
  /** Create a brand-new todo (completed defaults to false) */
  create(props: TodoProps): Todo {
    return { ...props, completed: false }
  },
  /** Reconstitute from persistence — preserves the stored completed flag */
  reconstruct(props: TodoReconstructProps): Todo {
    return { ...props }
  },
  complete(todo: Todo): Todo {
    return { ...todo, completed: true }
  },
  uncomplete(todo: Todo): Todo {
    return { ...todo, completed: false }
  },
  changeTitle(todo: Todo, title: TodoTitle): Todo {
    return { ...todo, title }
  },
  isSameAs(a: Todo, b: Todo): boolean {
    return a.id === b.id
  },
}
