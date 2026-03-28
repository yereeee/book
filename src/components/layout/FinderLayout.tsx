interface FinderLayoutProps {
  sidebar: React.ReactNode
  toolbar: React.ReactNode
  children: React.ReactNode
  panel?: React.ReactNode
}

export function FinderLayout({ sidebar, toolbar, children, panel }: FinderLayoutProps) {
  return (
    <div className="flex flex-col h-screen bg-[#c8c8c8] p-2">
      <div className="flex flex-col flex-1 rounded-xl shadow-2xl overflow-hidden border border-[#b0b0b0]">
        {/* 타이틀바 */}
        <div className="flex items-center px-3 h-9 bg-[#e4e4e4] border-b border-[#c0c0c0] flex-shrink-0 relative">
          {/* 트래픽 라이트 */}
          <div className="flex items-center gap-1.5 z-10">
            <span className="w-3 h-3 rounded-full bg-[#ff5f57] border border-[#e0443e] block" />
            <span className="w-3 h-3 rounded-full bg-[#febc2e] border border-[#d6a01d] block" />
            <span className="w-3 h-3 rounded-full bg-[#28c840] border border-[#14a833] block" />
          </div>
          {/* 창 제목 */}
          <span className="absolute left-1/2 -translate-x-1/2 text-[13px] font-semibold text-[#3a3a3a] select-none">
            나의 서재
          </span>
        </div>

        {/* 본문 */}
        <div className="flex flex-1 min-h-0 bg-white">
          {sidebar}
          <div className="flex flex-col flex-1 min-w-0">
            {toolbar}
            <div className="flex flex-1 min-h-0">
              <main className="flex-1 overflow-auto relative">
                {children}
              </main>
              {panel}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
