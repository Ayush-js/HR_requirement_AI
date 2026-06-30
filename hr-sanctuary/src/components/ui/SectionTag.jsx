export default function SectionTag({ children, className = '' }) {
  return (
    <span className={`section-tag ${className}`}>
      <span className="section-tag-bracket">[</span>
      {children}
      <span className="section-tag-bracket">]</span>
    </span>
  )
}
