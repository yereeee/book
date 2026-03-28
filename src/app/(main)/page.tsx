'use client'

import { useState, useEffect, useCallback } from 'react'
import { BookWithRelations, Status, Category } from '@/types'
import { FinderLayout } from '@/components/layout/FinderLayout'
import { Sidebar } from '@/components/layout/Sidebar'
import { Toolbar } from '@/components/layout/Toolbar'
import { BookFreeformView } from '@/components/books/BookFreeformView'
import { BookListView } from '@/components/books/BookListView'
import { BookDetailPanel } from '@/components/books/BookDetailPanel'
import { BookForm } from '@/components/books/BookForm'
import { CategoryForm } from '@/components/categories/CategoryForm'
import { Dialog } from '@/components/ui/Dialog'

export default function HomePage() {
  const [books, setBooks] = useState<BookWithRelations[]>([])
  const [statuses, setStatuses] = useState<Status[]>([])
  const [categories, setCategories] = useState<Category[]>([])

  const [search, setSearch] = useState('')
  const [activeStatusId, setActiveStatusId] = useState<string | null>(null)
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null)
  const [view, setView] = useState<'freeform' | 'list'>('freeform')

  const [selectedBook, setSelectedBook] = useState<BookWithRelations | null>(null)
  const [addBookOpen, setAddBookOpen] = useState(false)
  const [addCategoryOpen, setAddCategoryOpen] = useState(false)

  const fetchAll = useCallback(async () => {
    const params = new URLSearchParams()
    if (search) params.set('q', search)
    if (activeStatusId) params.set('status_id', activeStatusId)
    if (activeCategoryId) params.append('category_ids', activeCategoryId)

    const [booksRes, statusesRes, categoriesRes] = await Promise.all([
      fetch(`/api/books?${params}`).then((r) => r.json()),
      fetch('/api/statuses').then((r) => r.json()),
      fetch('/api/categories').then((r) => r.json()),
    ])
    setBooks(booksRes)
    setStatuses(statusesRes)
    setCategories(categoriesRes)
  }, [search, activeStatusId, activeCategoryId])

  useEffect(() => { fetchAll() }, [fetchAll])

  // 필터 적용 시 목록 뷰로 자동 전환
  useEffect(() => {
    if (activeStatusId || activeCategoryId || search) {
      setView('list')
    } else {
      setView('freeform')
    }
  }, [activeStatusId, activeCategoryId, search])

  async function handleAddCategory(name: string, color: string) {
    await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, color }),
    })
    setAddCategoryOpen(false)
    fetchAll()
  }

  return (
    <>
      <FinderLayout
        sidebar={
          <Sidebar
            statuses={statuses}
            categories={categories}
            activeStatusId={activeStatusId}
            activeCategoryId={activeCategoryId}
            onSelectStatus={setActiveStatusId}
            onSelectCategory={setActiveCategoryId}
            onAddCategory={() => setAddCategoryOpen(true)}
          />
        }
        toolbar={
          <Toolbar
            search={search}
            onSearchChange={setSearch}
            view={view}
            onViewChange={setView}
            onAddBook={() => setAddBookOpen(true)}
          />
        }
        panel={
          selectedBook ? (
            <BookDetailPanel
              book={selectedBook}
              statuses={statuses}
              categories={categories}
              onClose={() => setSelectedBook(null)}
              onRefresh={() => { fetchAll(); setSelectedBook(null) }}
            />
          ) : undefined
        }
      >
        {view === 'freeform' ? (
          <BookFreeformView
            books={books}
            onBookClick={setSelectedBook}
            onRefresh={fetchAll}
          />
        ) : (
          <BookListView
            books={books}
            onBookClick={setSelectedBook}
          />
        )}
      </FinderLayout>

      <BookForm
        open={addBookOpen}
        onClose={() => setAddBookOpen(false)}
        onSave={fetchAll}
        statuses={statuses}
        categories={categories}
      />

      <Dialog open={addCategoryOpen} onClose={() => setAddCategoryOpen(false)} title="태그 추가">
        <CategoryForm
          onSubmit={handleAddCategory}
          onCancel={() => setAddCategoryOpen(false)}
        />
      </Dialog>
    </>
  )
}
