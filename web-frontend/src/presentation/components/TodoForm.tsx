import { useState } from 'react'
import { useTodoTitleValidation } from '../hooks/useTodoTitleValidation.ts'

interface TodoFormProps {
  onSubmit: (title: string) => Promise<void>
}

export function TodoForm({ onSubmit }: TodoFormProps) {
  const [title, setTitle] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [touched, setTouched] = useState(false)
  const validation = useTodoTitleValidation(title)

  // Show inline errors only after the user has interacted (typed or submitted).
  const showError = touched && !validation.isValid

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setTouched(true)
    if (!validation.isValid) return
    setSubmitting(true)
    try {
      await onSubmit(title)
      setTitle('')
      setTouched(false)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="new-todo-input">New todo</label>
      <input
        id="new-todo-input"
        type="text"
        value={title}
        onChange={e => {
          setTitle(e.target.value)
          setTouched(true)
        }}
        maxLength={validation.maxLength}
        placeholder="Enter a todo title..."
        disabled={submitting}
        aria-invalid={showError}
        aria-describedby={showError ? 'new-todo-error' : undefined}
      />
      <span aria-hidden="true">
        {title.length}/{validation.maxLength}
      </span>
      <button type="submit" disabled={submitting || !validation.isValid}>
        Add
      </button>
      {showError && (
        <p id="new-todo-error" role="alert">
          {validation.errorMessage}
        </p>
      )}
    </form>
  )
}
