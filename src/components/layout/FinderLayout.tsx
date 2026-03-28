interface FinderLayoutProps {
  sidebar: React.ReactNode
  toolbar: React.ReactNode
  children: React.ReactNode
  panel?: React.ReactNode
}

export function FinderLayout({ sidebar, toolbar, children, panel }: FinderLayoutProps) {
  return (
    <div className="flex h-screen bg-white overflow-hidden">
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
  )
}
