import { describe, it, expect } from 'vitest'
import { TodoTitle } from './TodoTitle.ts'

describe('TodoTitle.validate', () => {
  it('rejects an empty string with EMPTY', () => {
    const result = TodoTitle.validate('')
    expect(result.valid).toBe(false)
    if (!result.valid) expect(result.issues[0].code).toBe('EMPTY')
  })

  it('rejects a whitespace-only string with EMPTY', () => {
    const result = TodoTitle.validate('   ')
    expect(result.valid).toBe(false)
    if (!result.valid) expect(result.issues[0].code).toBe('EMPTY')
  })

  it('rejects a too-long string with TOO_LONG and length params', () => {
    const result = TodoTitle.validate('x'.repeat(256))
    expect(result.valid).toBe(false)
    if (!result.valid) {
      expect(result.issues[0].code).toBe('TOO_LONG')
      expect(result.issues[0].params?.maxLength).toBe(255)
      expect(result.issues[0].params?.actualLength).toBe(256)
    }
  })

  it('accepts a trimmable valid string', () => {
    expect(TodoTitle.validate('  hi  ').valid).toBe(true)
  })

  it('treats 255 chars as valid and 256 as invalid (boundary)', () => {
    expect(TodoTitle.validate('x'.repeat(TodoTitle.MAX_LENGTH)).valid).toBe(true)
    expect(TodoTitle.validate('x'.repeat(TodoTitle.MAX_LENGTH + 1)).valid).toBe(false)
  })
})

describe('TodoTitle.of', () => {
  it('throws on invalid input', () => {
    expect(() => TodoTitle.of('')).toThrow(/EMPTY/)
    expect(() => TodoTitle.of('x'.repeat(256))).toThrow(/TOO_LONG/)
  })

  it('returns a trimmed branded value on valid input', () => {
    const title = TodoTitle.of('  hello  ')
    expect(TodoTitle.unwrap(title)).toBe('hello')
  })

  it('agrees with validate at the boundary', () => {
    expect(() => TodoTitle.of('x'.repeat(TodoTitle.MAX_LENGTH))).not.toThrow()
    expect(() => TodoTitle.of('x'.repeat(TodoTitle.MAX_LENGTH + 1))).toThrow()
  })
})
