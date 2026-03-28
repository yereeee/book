'use client'

import { useRef, useState } from 'react'
import { BookWithRelations } from '@/types'

interface BookIconProps {
  book: BookWithRelations
  onClick: () => void
  onPositionChange: (id: string, x: number, y: number) => void
}

// 책 표지 없을 때 표시할 그라데이션 팔레트
const COVER_GRADIENTS = [
  ['#667eea', '#764ba2'],
  ['#f093fb', '#f5576c'],
  ['#4facfe', '#00f2fe'],
  ['#43e97b', '#38f9d7'],
  ['#fa709a', '#fee140'],
  ['#a18cd1', '#fbc2eb'],
  ['#fccb90', '#d57eeb'],
  ['#a1c4fd', '#c2e9fb'],
]

function getCoverGradient(title: string) {
  const idx = title.charCodeAt(0) % COVER_GRADIENTS.length
  return COVER_GRADIENTS[idx]
}

export function BookIcon({ book, onClick, onPositionChange }: BookIconProps) {
  const [dragging, setDragging] = useState(false)
  const dragStart = useRef<{ mouseX: number; mouseY: number; posX: number; posY: number } | null>(null)
  const posRef = useRef({ x: book.pos_x ?? 0, y: book.pos_y ?? 0 })
  const elRef = useRef<HTMLDivElement>(null)
  const [colors] = useState(() => getCoverGradient(book.title))

  function handleMouseDown(e: React.MouseEvent) {
    e.preventDefault()
    dragStart.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      posX: posRef.current.x,
      posY: posRef.current.y,
    }
    setDragging(true)

    function handleMouseMove(e: MouseEvent) {
      if (!dragStart.current || !elRef.current) return
      const dx = e.clientX - dragStart.current.mouseX
      const dy = e.clientY - dragStart.current.mouseY
      posRef.current = { x: dragStart.current.posX + dx, y: dragStart.current.posY + dy }
      elRef.current.style.left = `${posRef.current.x}px`
      elRef.current.style.top = `${posRef.current.y}px`
    }

    function handleMouseUp() {
      if (!dragStart.current) return
      const moved = Math.abs(posRef.current.x - dragStart.current.posX) > 4 ||
                    Math.abs(posRef.current.y - dragStart.current.posY) > 4
      if (moved) {
        onPositionChange(book.id, posRef.current.x, posRef.current.y)
      }
      dragStart.current = null
      setDragging(false)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
  }

  function handleClick() {
    if (!dragging) onClick()
  }

  return (
    <div
      ref={elRef}
      className={`absolute flex flex-col items-center gap-1.5 cursor-pointer select-none group ${dragging ? 'z-50' : 'z-10'}`}
      style={{ left: posRef.current.x, top: posRef.current.y, width: 88 }}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
    >
      {/* 책 표지 + 책등 */}
      <div
        className={`flex rounded-r-lg overflow-hidden transition-all duration-200 ${
          dragging
            ? 'shadow-2xl scale-105 -translate-y-1'
            : 'shadow-md group-hover:shadow-xl group-hover:scale-105 group-hover:-translate-y-1'
        }`}
      >
        {/* 책등 (spine) */}
        <div
          className="w-[3px] flex-shrink-0 rounded-l-sm"
          style={{
            background: book.cover_image_url
              ? 'rgba(0,0,0,0.25)'
              : `linear-gradient(180deg, ${colors[1]}, ${colors[0]})`,
          }}
        />
        {/* 표지 */}
        {book.cover_image_url ? (
          <img
            src={book.cover_image_url}
            alt={book.title}
            className="w-[72px] h-[100px] object-cover"
            draggable={false}
          />
        ) : (
          <div
            className="w-[72px] h-[100px] flex flex-col justify-end p-2"
            style={{ background: `linear-gradient(160deg, ${colors[0]}, ${colors[1]})` }}
          >
            <p className="text-white text-[8px] font-semibold leading-tight line-clamp-3 opacity-90">
              {book.title}
            </p>
            {book.author && (
              <p className="text-white/60 text-[7px] mt-0.5 truncate">{book.author}</p>
            )}
          </div>
        )}
      </div>

      {/* 제목 + 태그 닷 */}
      <div className="flex items-center gap-1 w-full px-1">
        {book.categories.length > 0 && (
          <div className="flex items-center gap-0.5 flex-shrink-0">
            {book.categories.slice(0, 3).map((c) => (
              <span
                key={c.id}
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: c.color ?? undefined }}
              />
            ))}
          </div>
        )}
        <p className="text-[11px] text-center text-gray-700 leading-tight flex-1 truncate">
          {book.title}
        </p>
      </div>
    </div>
  )
}
