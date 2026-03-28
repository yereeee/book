'use client'

import { useState, useEffect, useCallback } from 'react'
import { Status, Category } from '@/types'
import { FinderLayout } from '@/components/layout/FinderLayout'
import { Sidebar } from '@/components/layout/Sidebar'
import { Toolbar } from '@/components/layout/Toolbar'
import { StatusManager } from '@/components/statuses/StatusManager'
import { CategoryManager } from '@/components/categories/CategoryManager'
import { useRouter } from 'next/navigation'

export default function SettingsPage() {
  const [statuses, setStatuses] = useState<Status[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const router = useRouter()

  const fetchAll = useCallback(async () => {
    const [s, c] = await Promise.all([
      fetch('/api/statuses').then((r) => r.json()),
      fetch('/api/categories').then((r) => r.json()),
    ])
    setStatuses(s)
    setCategories(c)
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  return (
    <FinderLayout
      sidebar={
        <Sidebar
          statuses={statuses}
          categories={categories}
          activeStatusId={null}
          activeCategoryId={null}
          onSelectStatus={() => router.push('/')}
          onSelectCategory={() => router.push('/')}
          onAddCategory={() => {}}
        />
      }
      toolbar={
        <Toolbar
          search=""
          onSearchChange={() => {}}
          view="list"
          onViewChange={() => {}}
          onAddBook={() => router.push('/')}
        />
      }
    >
      <div className="p-6 max-w-xl space-y-8">
        <div>
          <h2 className="text-sm font-semibold text-gray-700 mb-3">독서 상태 관리</h2>
          <StatusManager statuses={statuses} onChange={fetchAll} />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-gray-700 mb-3">카테고리 관리</h2>
          <CategoryManager categories={categories} onChange={fetchAll} />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-gray-700 mb-3">데이터 관리</h2>
          <div className="flex gap-3">
            <a
              href="/api/export"
              download
              className="px-4 py-2 text-sm font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
            >
              내보내기 (JSON)
            </a>
            <label className="px-4 py-2 text-sm font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors cursor-pointer">
              가져오기 (JSON)
              <input
                type="file"
                accept=".json"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0]
                  if (!file) return
                  const text = await file.text()
                  const json = JSON.parse(text)
                  await fetch('/api/import', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(json),
                  })
                  alert('가져오기 완료!')
                  fetchAll()
                  e.target.value = ''
                }}
              />
            </label>
          </div>
        </div>
      </div>
    </FinderLayout>
  )
}
