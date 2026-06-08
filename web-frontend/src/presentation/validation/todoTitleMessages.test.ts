import { describe, it, expect } from 'vitest'
import { formatTodoTitleIssue } from './todoTitleMessages.ts'

describe('formatTodoTitleIssue', () => {
  it('maps EMPTY to a non-empty message', () => {
    expect(formatTodoTitleIssue({ code: 'EMPTY' })).toMatch(/required/i)
  })

  it('interpolates maxLength into the TOO_LONG message', () => {
    const message = formatTodoTitleIssue({
      code: 'TOO_LONG',
      params: { maxLength: 255, actualLength: 256 },
    })
    expect(message).toContain('255')
  })
})
