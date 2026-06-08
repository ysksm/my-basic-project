import { useMemo } from 'react'
import { TodoTitle } from '../../domain/todo/value-objects/TodoTitle.ts'
import { formatTodoTitleIssue } from '../validation/todoTitleMessages.ts'

export type TodoTitleValidation = {
  readonly isValid: boolean
  readonly errorMessage: string | null // first issue, mapped to a display string
  readonly maxLength: number // domain-sourced, for input maxLength + counter
}

// Reuses the domain rule (TodoTitle.validate) for real-time form feedback,
// then maps the resulting code to a presentation message. The domain stays
// unaware of React, fields, and wording.
export function useTodoTitleValidation(rawTitle: string): TodoTitleValidation {
  return useMemo(() => {
    const result = TodoTitle.validate(rawTitle)
    return {
      isValid: result.valid,
      errorMessage: result.valid ? null : formatTodoTitleIssue(result.issues[0]),
      maxLength: TodoTitle.MAX_LENGTH,
    }
  }, [rawTitle])
}
