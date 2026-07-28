import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { MainLayout } from './layouts/MainLayout'
import { HomePage } from './pages/HomePage'
import { BMICalculatorPage } from './pages/BMICalculatorPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <MainLayout>
              <HomePage />
            </MainLayout>
          }
        />
        <Route
          path="/calculators/bmi"
          element={
            <MainLayout>
              <BMICalculatorPage />
            </MainLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
