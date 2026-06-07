export type TodoTitle = string & { readonly _brand: 'TodoTitle' }

const MAX_LENGTH = 255

export const TodoTitle = {
  of(value: string): TodoTitle {
    const trimmed = value.trim()
    if (trimmed === '') throw new Error('TodoTitle must not be empty')
    if (trimmed.length > MAX_LENGTH) {
      throw new Error(`TodoTitle must be ${MAX_LENGTH} characters or fewer`)
    }
    return trimmed as TodoTitle
  },
  equals(a: TodoTitle, b: TodoTitle): boolean {
    return a === b
  },
  unwrap(title: TodoTitle): string {
    return title
  },
}
