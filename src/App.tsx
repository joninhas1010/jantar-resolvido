import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import BottomNav from './components/BottomNav'
import OrgBlobs from './components/OrgBlobs'
import Hoje from './pages/Hoje'
import Calendario from './pages/Calendario'
import Compras from './pages/Compras'
import Extras from './pages/Extras'
import ExtrasEconomicos from './pages/ExtrasEconomicos'
import ExtrasSOS from './pages/ExtrasSOS'
import ExtrasGeladeira from './pages/ExtrasGeladeira'
import ExtrasSubstituicoes from './pages/ExtrasSubstituicoes'
import Sobre from './pages/Sobre'
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
        <Route path="/extras/economicos" element={<ExtrasEconomicos />} />
        <Route path="/extras/sos" element={<ExtrasSOS />} />
        <Route path="/extras/geladeira" element={<ExtrasGeladeira />} />
        <Route path="/extras/substituicoes" element={<ExtrasSubstituicoes />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/receita/:id" element={<Receita />} />
        <Route path="/receita/:id/preparo" element={<PassoAPasso />} />
      </Routes>
      {!isPassoAPasso && <BottomNav />}
    </div>
  )
}
