import type { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { Header } from '../components/Header'
import { calculators } from '../data/calculators'
import { Footer } from '../components/Footer'
import './MainLayout.css'
import { Breadcrumb } from '../components/Breadcrumb'

interface MainLayoutProps {
  children: ReactNode
}

const infoPageNames: Record<string, string> = {
  '/about': 'About',
  '/privacy': 'Privacy Policy',
  '/terms': 'Terms of Use',
  '/contact': 'Contact',
  '/disclaimer': 'Disclaimer',
}

export function MainLayout({ children }: MainLayoutProps) {
  const { pathname } = useLocation()
  const calculator = calculators.find((item) => item.path === pathname)
  const current = pathname === '/' ? 'Home' : calculator?.name ?? infoPageNames[pathname] ?? 'Page not found'
  return (
    <div className="layout">
      <Header />
      <main className="layout__main"><Breadcrumb current={current} />{children}</main>
      <Footer />
    </div>
  )
}
