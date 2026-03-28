'use client'

import { useRef, useState } from 'react'
import { BookWithRelations } from '@/types'

interface BookIconProps {
  book: BookWithRelations
  onClick: () => void
  onPositionChange: (id: string, x: number, y: number) => void
}

export function BookIcon({ book, onClick, onPositionChange }: BookIconProps) {
  const [dragging, setDragging] = useState(false)
  const dragStart = useRef<{ mouseX: number; mouseY: number; posX: number; posY: number } | null>(null)
  const posRef = useRef({ x: book.pos_x ?? 0, y: book.pos_y ?? 0 })
  const elRef = useRef<HTMLDivElement>(null)

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
      className={`absolute flex flex-col items-center gap-1 cursor-pointer select-none group ${dragging ? 'z-50' : 'z-10'}`}
      style={{ left: posRef.current.x, top: posRef.current.y, width: 80 }}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
    >
      <div className={`rounded-lg overflow-hidden shadow-sm transition-shadow group-hover:shadow-md ${dragging ? 'shadow-lg' : ''}`}>
        {book.cover_image_url ? (
          <img
            src={book.cover_image_url}
            alt={book.title}
            className="w-16 h-24 object-cover"
            draggable={false}
          />
        ) : (
          <div className="w-16 h-24 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
            <span className="text-blue-400 text-2xl">📖</span>
          </div>
        )}
      </div>
      <p className="text-xs text-center text-gray-700 leading-tight w-full truncate px-1">
        {book.title}
      </p>
    </div>
  )
}
