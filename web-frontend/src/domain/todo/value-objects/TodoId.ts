import { ValidationResult } from '../../shared/ValidationResult.ts'
import type { ValidationResult as VResult } from '../../shared/ValidationResult.ts'

// Branded type — nominal typing without classes
export type TodoId = number & { readonly _brand: 'TodoId' }

// Stable codes — no display wording. Maps to UI messages in the presentation layer.
export type TodoIdErrorCode = 'NOT_INTEGER' | 'NOT_POSITIVE'

// Companion object
export const TodoId = {
  // Non-throwing, real-time-safe validation against the raw value.
  validate(value: number): VResult<TodoIdErrorCode> {
    if (!Number.isInteger(value)) {
      return ValidationResult.fail([{ code: 'NOT_INTEGER', params: { value } }])
    }
    if (value <= 0) {
      return ValidationResult.fail([{ code: 'NOT_POSITIVE', params: { value } }])
    }
    return ValidationResult.ok()
  },

  /** Validated factory — use for user-supplied values */
  of(value: number): TodoId {
    const result = TodoId.validate(value)
    if (!result.valid) {
      throw new Error(`Invalid TodoId: ${result.issues[0].code} (got: ${value})`)
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
