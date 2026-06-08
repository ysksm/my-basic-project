// Reusable, UI-agnostic validation result shared across value objects.
// Carries stable error codes + typed params only — never display strings.
// The presentation layer owns turning codes into human messages / i18n.

export type ValidationIssue<Code extends string = string> = {
  readonly code: Code
  readonly params?: Readonly<Record<string, string | number>>
}

// Discriminated union over `valid` so callers can narrow exhaustively.
export type ValidationResult<Code extends string = string> =
  | { readonly valid: true; readonly issues: readonly [] }
  | { readonly valid: false; readonly issues: readonly ValidationIssue<Code>[] }

// Companion helpers — matches the repo's const-object value-object style.
export const ValidationResult = {
  ok<Code extends string>(): ValidationResult<Code> {
    return { valid: true, issues: [] }
  },
  fail<Code extends string>(
    issues: readonly ValidationIssue<Code>[],
  ): ValidationResult<Code> {
    return { valid: false, issues }
  },
}
