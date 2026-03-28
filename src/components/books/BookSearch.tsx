'use client'

import { useState, useCallback, useRef } from 'react'
import { GoogleBook } from '@/types'
import { Input } from '@/components/ui/Input'

interface BookSearchProps {
  onSelect: (book: GoogleBook) => void
}

export function BookSearch({ onSelect }: BookSearchProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<GoogleBook[]>([])
  const [loading, setLoading] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const search = useCallback(async (q: string) => {
    if (!q.trim()) { setResults([]); return }
    setLoading(true)
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`)
      if (!res.ok) { setResults([]); return }
      const data = await res.json()
      setResults(Array.isArray(data) ? data : [])
    } finally {
      setLoading(false)
    }
  }, [])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value
    setQuery(v)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => search(v), 400)
  }

  return (
    <div className="space-y-2">
      <Input
        placeholder="제목이나 저자로 검색..."
        value={query}
        onChange={handleChange}
      />
      {loading && <p className="text-xs text-gray-400">검색 중...</p>}
      {results.length > 0 && (
        <ul className="border border-gray-200 rounded-lg divide-y divide-gray-100 max-h-48 overflow-y-auto">
          {results.map((book) => (
            <li
              key={book.id}
              className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 cursor-pointer"
              onClick={() => { onSelect(book); setQuery(''); setResults([]) }}
            >
              {book.thumbnail ? (
                <img src={book.thumbnail} alt="" className="w-8 h-11 object-cover rounded flex-shrink-0" />
              ) : (
                <div className="w-8 h-11 bg-gray-200 rounded flex-shrink-0" />
              )}
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{book.title}</p>
                <p className="text-xs text-gray-500 truncate">{book.authors.join(', ')}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
