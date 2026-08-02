import type { ReactNode } from 'react'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import './MainLayout.css'
import { Breadcrumb } from '../components/Breadcrumb'

interface MainLayoutProps {
  children: ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="layout">
      <Header />
      <main className="layout__main"><Breadcrumb current="ExoCalcHub" />{children}</main>
      <Footer />
    </div>
  )
}
