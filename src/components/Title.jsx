export function Title({ children, className }) {
  return <p className={`text-lg font-bold ${className || ""}`}>{children}</p>;
}
