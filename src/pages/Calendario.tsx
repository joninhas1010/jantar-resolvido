import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import PratoPlaceholder from '../components/PratoPlaceholder'
import { IconClock, IconUsers } from '../components/Icons'

const SEMANAS = [
  { label: 'Semana 1', dias: Array.from({ length: 7 }, (_, i) => i + 1) },
  { label: 'Semana 2', dias: Array.from({ length: 7 }, (_, i) => i + 8) },
  { label: 'Semana 3', dias: Array.from({ length: 7 }, (_, i) => i + 15) },
  { label: 'Semana 4', dias: Array.from({ length: 7 }, (_, i) => i + 22) },
  { label: 'Dias finais', dias: [29, 30] },
]

export default function Calendario() {
  const navigate = useNavigate()
  const { state, diaDoPlan, getReceitaDoDia, trocarDias, restaurarSequencia, ultimaTroca, desfazerTroca } = useApp()
  const [diaSelecionado, setDiaSelecionado] = useState<number | null>(null)
  const [trocando, setTrocando] = useState<number | null>(null)

  const feitosCount = state.jantaresFeitos.length
  const receita = diaSelecionado ? getReceitaDoDia(diaSelecionado) : undefined

  const handleDiaClick = (dia: number) => {
    if (trocando !== null) {
      if (trocando !== dia) {
        trocarDias(trocando, dia)
      }
      setTrocando(null)
      setDiaSelecionado(null)
      return
    }
    setDiaSelecionado(dia)
  }

  const iniciarTroca = () => {
    if (diaSelecionado) {
      setTrocando(diaSelecionado)
      setDiaSelecionado(null)
    }
  }

  return (
    <div className="relative z-10 min-h-screen pb-28">
      <div className="px-4 pt-6 pb-2">
        <h1 className="heading-tight text-[28px] text-white leading-tight">Seu mês, mais leve.</h1>
        <p className="text-white/50 text-sm mt-1">30 dias de jantar resolvido. Um dia de cada vez. Tudo organizado.</p>
        <div className="flex items-center gap-3 mt-3">
          <div className="glass-subtle rounded-full px-4 py-2">
            <span className="text-amarelo font-bold text-sm">{feitosCount}</span>
            <span className="text-white/50 text-sm"> de 30 jantares feitos</span>
          </div>
        </div>
      </div>

      {/* Aviso de troca */}
      {trocando !== null && (
        <div className="mx-4 mt-3 bg-amarelo/10 border border-amarelo/30 rounded-2xl p-4 text-center">
          <p className="text-amarelo text-sm font-medium">
            Selecione o dia para trocar com o dia {trocando}
          </p>
          <button
            onClick={() => setTrocando(null)}
            className="text-white/50 text-sm mt-2 underline"
          >
            Cancelar
          </button>
        </div>
      )}

      {/* Toast de troca feita */}
      {ultimaTroca && !trocando && (
        <div className="mx-4 mt-3 glass-subtle rounded-2xl p-3 flex items-center justify-between">
          <p className="text-white/70 text-sm">
            Dias {ultimaTroca.diaA} e {ultimaTroca.diaB} trocados
          </p>
          <button
            onClick={desfazerTroca}
            className="text-amarelo text-sm font-medium"
          >
            Desfazer
          </button>
        </div>
      )}

      {/* Grade de dias */}
      <div className="px-4 mt-4 space-y-5">
        {SEMANAS.map(({ label, dias }) => (
          <div key={label}>
            <h2 className="label-caps text-white/40 mb-2">{label}</h2>
            <div className="flex flex-wrap gap-2">
              {dias.map(dia => {
                const feito = state.jantaresFeitos.includes(dia)
                const isHoje = dia === diaDoPlan
                const isSelecionado = dia === diaSelecionado
                const isTrocando = dia === trocando
                const rec = getReceitaDoDia(dia)

                return (
                  <button
                    key={dia}
                    onClick={() => handleDiaClick(dia)}
                    className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-200 relative ${
                      isTrocando
                        ? 'bg-amarelo text-preto ring-2 ring-amarelo ring-offset-2 ring-offset-preto'
                        : isSelecionado
                        ? 'bg-amarelo text-preto'
                        : isHoje
                        ? 'bg-amarelo text-preto'
                        : feito
                        ? 'bg-cinza text-white/60'
                        : 'bg-cinza text-white/60'
                    }`}
                    aria-label={`Dia ${dia}${rec ? `: ${rec.nome}` : ''}${feito ? ', concluído' : ''}${isHoje ? ', hoje' : ''}`}
                  >
                    {feito && !isHoje && !isSelecionado ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FDE047" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : (
                      dia
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Botão restaurar */}
      {Object.keys(state.trocas).length > 0 && (
        <div className="px-4 mt-5">
          <button
            onClick={restaurarSequencia}
            className="w-full py-3 rounded-full border border-white/20 text-white/60 text-sm font-medium active:scale-95 transition-transform"
          >
            Restaurar sequência original
          </button>
        </div>
      )}

      {/* Painel inferior do dia selecionado */}
      {diaSelecionado !== null && !trocando && (
        <div className="fixed inset-0 z-[60] flex items-end" onClick={() => setDiaSelecionado(null)}>
          <div className="absolute inset-0 bg-black/60" />
          <div
            className="relative w-full max-w-[480px] mx-auto glass rounded-t-[32px] p-5 pb-24"
            onClick={e => e.stopPropagation()}
            style={{ animation: 'slideUp 200ms cubic-bezier(.22,1,.36,1)' }}
          >
            <div className="w-10 h-1 rounded-full bg-white/20 mx-auto mb-4" />

            <div className="flex gap-4">
              <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0">
                {receita ? (
                  receita.foto ? (
                    <img src={`/pratos/${receita.foto}`} alt={receita.nome} className="w-full h-full object-cover" />
                  ) : (
                    <PratoPlaceholder nome={receita.nome} className="w-full h-full" />
                  )
                ) : (
                  <div className="w-full h-full bg-cinza flex items-center justify-center">
                    <span className="text-white/20 text-xs">—</span>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <span className="label-caps text-amarelo">Dia {diaSelecionado}</span>
                <h3 className="text-white font-bold text-lg leading-tight mt-1">
                  {receita?.nome || 'Sem receita'}
                </h3>
                {receita && (
                  <div className="flex gap-3 mt-2">
                    <span className="text-white/50 text-sm flex items-center gap-1">
                      <IconClock size={14} /> {receita.tempoTotalMin} min
                    </span>
                    <span className="text-white/50 text-sm flex items-center gap-1">
                      <IconUsers size={14} /> {receita.porcoes}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 mt-5">
              {receita && (
                <button
                  onClick={() => { setDiaSelecionado(null); navigate(`/receita/${receita.id}`) }}
                  className="flex-1 btn-amarelo text-sm py-3"
                >
                  Ver receita
                </button>
              )}
              <button
                onClick={iniciarTroca}
                className="flex-1 py-3 rounded-full border border-white/20 text-white font-medium text-sm active:scale-95 transition-transform"
              >
                Trocar dia
              </button>
            </div>
          </div>

          <style>{`
            @keyframes slideUp {
              from { transform: translateY(100%); }
              to { transform: translateY(0); }
            }
          `}</style>
        </div>
      )}
    </div>
  )
}
