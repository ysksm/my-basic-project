import { describe, it, expect } from 'vitest'
import { TodoId } from './TodoId.ts'

describe('TodoId.validate', () => {
  it('rejects zero and negatives with NOT_POSITIVE', () => {
    for (const value of [0, -1]) {
      const result = TodoId.validate(value)
      expect(result.valid).toBe(false)
      if (!result.valid) expect(result.issues[0].code).toBe('NOT_POSITIVE')
    }
  })

  it('rejects non-integers with NOT_INTEGER', () => {
    const result = TodoId.validate(1.5)
    expect(result.valid).toBe(false)
    if (!result.valid) expect(result.issues[0].code).toBe('NOT_INTEGER')
  })

  it('accepts a positive integer', () => {
    expect(TodoId.validate(1).valid).toBe(true)
  })
})

describe('TodoId.of', () => {
  it('throws on invalid input', () => {
    expect(() => TodoId.of(0)).toThrow(/NOT_POSITIVE/)
    expect(() => TodoId.of(1.5)).toThrow(/NOT_INTEGER/)
  })

  it('returns a branded value on valid input', () => {
    expect(TodoId.unwrap(TodoId.of(42))).toBe(42)
  })
})
