import type { ReactNode } from 'react'
import './ResultCard.css'

interface ResultCardProps { title: string; children: ReactNode; onCopy?: () => void; onShare?: () => void; onPrint?: () => void }
export function ResultCard({ title, children, onCopy, onShare, onPrint }: ResultCardProps) {
  return <section className="result-card" aria-live="polite"><div className="result-card__header"><h2>{title}</h2><div className="result-card__actions">{onCopy && <button type="button" onClick={onCopy}>Copy</button>}{onShare && <button type="button" onClick={onShare}>Share</button>}{onPrint && <button type="button" onClick={onPrint}>Print</button>}</div></div>{children}</section>
}
