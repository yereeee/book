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
      </div>
    </FinderLayout>
  )
}
