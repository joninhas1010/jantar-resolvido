import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import BottomNav from './components/BottomNav'
import OrgBlobs from './components/OrgBlobs'
import Hoje from './pages/Hoje'
import Calendario from './pages/Calendario'
import Compras from './pages/Compras'
import Extras from './pages/Extras'
import Receita from './pages/Receita'
import PassoAPasso from './pages/PassoAPasso'

export default function App() {
  const location = useLocation()
  const isPassoAPasso = location.pathname.endsWith('/preparo')

  return (
    <div className="max-w-[480px] mx-auto relative min-h-screen">
      <OrgBlobs />
      <Routes>
        <Route path="/" element={<Navigate to="/hoje" replace />} />
        <Route path="/hoje" element={<Hoje />} />
        <Route path="/calendario" element={<Calendario />} />
        <Route path="/compras" element={<Compras />} />
        <Route path="/extras" element={<Extras />} />
        <Route path="/receita/:id" element={<Receita />} />
        <Route path="/receita/:id/preparo" element={<PassoAPasso />} />
      </Routes>
      {!isPassoAPasso && <BottomNav />}
    </div>
  )
}
