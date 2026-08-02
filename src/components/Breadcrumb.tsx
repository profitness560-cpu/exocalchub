import { Link } from 'react-router-dom'
export function Breadcrumb({ current }: { current: string }) { return <nav aria-label="Breadcrumb" className="breadcrumb"><Link to="/">Home</Link><span aria-hidden="true">/</span><span>{current}</span></nav> }
