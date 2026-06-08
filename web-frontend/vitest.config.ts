import { defineConfig } from 'vitest/config'

// Pure domain/presentation unit tests — no DOM needed.
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
})
