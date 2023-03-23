export function Title({ children, className }) {
  return (
    <p className={`text-lg mb-4 font-bold ${className || ''}`}>
      {children}
    </p>
  )
}