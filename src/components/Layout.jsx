export function Layout({children}) {
  return (
    <div className="p-8">
      <div className="bg-slate-100 p-4 border-2 w-full max-w-7xl mx-auto" style={{
        height: 'calc(100vh - 64px)'
      }}>
        {children}
      </div>
    </div>
  )
}