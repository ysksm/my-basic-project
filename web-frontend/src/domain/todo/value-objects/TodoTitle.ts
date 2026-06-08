import { ValidationResult } from '../../shared/ValidationResult.ts'
import type { ValidationResult as VResult } from '../../shared/ValidationResult.ts'

export type TodoTitle = string & { readonly _brand: 'TodoTitle' }

// Stable codes — no display wording, no field names. The presentation layer
// maps these to messages so the domain stays free of UI/i18n concerns.
export type TodoTitleErrorCode = 'EMPTY' | 'TOO_LONG'

export const TodoTitle = {
  // Public metadata the UI may legitimately reflect (input maxLength, counter).
  // Single source of truth for the rule — never duplicate the number in the UI.
  MAX_LENGTH: 255,

  // Non-throwing, real-time-safe validation against the raw user input.
  validate(value: string): VResult<TodoTitleErrorCode> {
    const trimmed = value.trim()
    if (trimmed === '') {
      return ValidationResult.fail([{ code: 'EMPTY' }])
    }
    if (trimmed.length > TodoTitle.MAX_LENGTH) {
      return ValidationResult.fail([
        {
          code: 'TOO_LONG',
          params: { maxLength: TodoTitle.MAX_LENGTH, actualLength: trimmed.length },
        },
      ])
    }
    return ValidationResult.ok()
  },

  // Enforcement point at the domain boundary — still throws (invariant guard).
  // Implemented in terms of validate() so the rule lives in exactly one place.
  of(value: string): TodoTitle {
    const result = TodoTitle.validate(value)
    if (!result.valid) {
      throw new Error(`Invalid TodoTitle: ${result.issues[0].code}`)
    }
    return value.trim() as TodoTitle
  },

  equals(a: TodoTitle, b: TodoTitle): boolean {
    return a === b
  },
  unwrap(title: TodoTitle): string {
    return title
  },
}
