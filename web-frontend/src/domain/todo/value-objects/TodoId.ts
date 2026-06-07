// Branded type — nominal typing without classes
export type TodoId = number & { readonly _brand: 'TodoId' }

// Companion object
export const TodoId = {
  /** Validated factory — use for user-supplied values */
  of(value: number): TodoId {
    if (!Number.isInteger(value) || value <= 0) {
      throw new Error(`TodoId must be a positive integer, got: ${value}`)
    }
    return value as TodoId
  },
  /** Trusted factory — use when the value comes from a reliable source (e.g. DB) */
  fromTrusted(value: number): TodoId {
    return value as TodoId
  },
  equals(a: TodoId, b: TodoId): boolean {
    return a === b
  },
  unwrap(id: TodoId): number {
    return id
  },
}
