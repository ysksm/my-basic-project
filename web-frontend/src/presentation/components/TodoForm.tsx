import { useState } from 'react'

interface TodoFormProps {
  onSubmit: (title: string) => Promise<void>
}

export function TodoForm({ onSubmit }: TodoFormProps) {
  const [title, setTitle] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim() === '') return
    setSubmitting(true)
    try {
      await onSubmit(title)
      setTitle('')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="New todo..."
        disabled={submitting}
      />
      <button type="submit" disabled={submitting || title.trim() === ''}>
        Add
      </button>
    </form>
  )
}
