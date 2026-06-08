import type { TodoTitleErrorCode } from '../../domain/todo/value-objects/TodoTitle.ts'
import type { ValidationIssue } from '../../domain/shared/ValidationResult.ts'

// Code -> message map. The single wording/i18n seam: the domain emits codes,
// the presentation layer decides how to phrase them. The exhaustive switch makes
// adding a new domain code a compile error here until a message is provided.
export function formatTodoTitleIssue(
  issue: ValidationIssue<TodoTitleErrorCode>,
): string {
  switch (issue.code) {
    case 'EMPTY':
      return 'Title is required.'
    case 'TOO_LONG':
      return `Title must be ${issue.params?.maxLength ?? ''} characters or fewer.`
  }
}
