import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { receitasSOS } from '../content/receitas-sos'
import { IconClock, IconUsers } from '../components/Icons'
import PratoPlaceholder from '../components/PratoPlaceholder'

export default function ExtrasSOS() {
  const navigate = useNavigate()
  const [busca, setBusca] = useState('')

  const filtradas = busca.trim()
    ? receitasSOS.filter(r => r.nome.toLowerCase().includes(busca.toLowerCase()))
    : receitasSOS

  return (
    <div className="relative z-10 min-h-screen pb-28">
      <div className="px-4 pt-6 pb-2">
        <button onClick={() => navigate('/extras')} className="text-white/50 text-sm mb-3 flex items-center gap-1">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
          Extras
        </button>
        <span className="inline-block bg-amarelo text-preto label-caps px-3 py-1.5 rounded-full mb-3">COMPLEMENTO 02</span>
        <h1 className="heading-tight text-[26px] text-white leading-tight">10 Jantares SOS</h1>
        <p className="text-white/50 text-sm mt-1">Receitas de até 10 minutos para aquelas noites em que o tempo fica ainda mais curto.</p>
      </div>

      {/* Busca */}
      <div className="px-4 mt-3">
        <input
          type="text"
          value={busca}
          onChange={e => setBusca(e.target.value)}
          placeholder="Buscar receita..."
          className="w-full glass-subtle rounded-full px-4 py-3 text-white text-sm placeholder:text-white/30 outline-none focus:ring-1 focus:ring-amarelo transition-all"
        />
      </div>

      {/* Lista */}
      <div className="px-4 mt-4 space-y-3">
        {filtradas.length === 0 && (
          <div className="glass rounded-card p-6 text-center">
            <p className="text-white/50 text-sm">Nenhuma receita encontrada.</p>
          </div>
        )}
        {filtradas.map(receita => (
          <button
            key={receita.id}
            onClick={() => navigate(`/receita/${receita.id}`)}
            className="w-full glass rounded-card p-4 text-left flex gap-4 active:scale-[0.98] transition-transform"
          >
            <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0">
              {receita.foto ? (
                <img src={`/pratos/${receita.foto}`} alt={receita.nome} className="w-full h-full object-cover" />
              ) : (
                <PratoPlaceholder nome={receita.nome} className="w-full h-full text-[8px]" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-bold text-base leading-tight truncate">{receita.nome}</h3>
              <div className="flex gap-3 mt-1.5">
                <span className="text-amarelo text-xs font-bold flex items-center gap-1">SOS</span>
                <span className="text-white/50 text-sm flex items-center gap-1">
                  <IconClock size={14} /> {receita.tempoTotalMin} min
                </span>
                <span className="text-white/50 text-sm flex items-center gap-1">
                  <IconUsers size={14} /> {receita.porcoes}
                </span>
              </div>
            </div>
          </button>
        ))}

        {receitasSOS.length < 10 && (
          <p className="text-center text-white/30 text-[11px] mt-4">
            As receitas completas serão adicionadas na Etapa 5.
          </p>
        )}
      </div>
    </div>
  )
}
