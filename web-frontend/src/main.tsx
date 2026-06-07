import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { DIProvider } from './di/DIContext.tsx'
import { createContainer } from './di/container.ts'
import { App } from './App.tsx'

const container = createContainer()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DIProvider container={container}>
      <App />
    </DIProvider>
  </StrictMode>,
)
