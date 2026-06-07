import { createContext, useContext, type ReactNode } from 'react'
import type { DIContainer } from './container.ts'

const DIContext = createContext<DIContainer | null>(null)

interface DIProviderProps {
  container: DIContainer
  children: ReactNode
}

export function DIProvider({ container, children }: DIProviderProps) {
  return <DIContext.Provider value={container}>{children}</DIContext.Provider>
}

export function useDI(): DIContainer {
  const ctx = useContext(DIContext)
  if (ctx === null) throw new Error('useDI must be used inside DIProvider')
  return ctx
}
