export function Layout({children}) {
  return (
    <div className="p-2 md:p-8">
      <div className="relative bg-slate-100 p-4 border-2 w-full max-w-7xl mx-auto" style={{
        minHeight: 'calc(100vh - 64px)',
        height: '100%'
      }}>
        {children}
      </div>
    </div>
  )
}