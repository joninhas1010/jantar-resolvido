import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { receitasPrincipais } from '../content/receitas-principais'
import { receitasEconomicos } from '../content/receitas-economicos'
import { receitasSOS } from '../content/receitas-sos'
import { useTimer } from '../hooks/useTimer'
import { useWakeLock } from '../hooks/useWakeLock'

function formatTime(s: number): string {
  const min = Math.floor(s / 60)
  const sec = s % 60
  return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
}

export default function PassoAPasso() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const receita = useMemo(() => [...receitasPrincipais, ...receitasEconomicos, ...receitasSOS].find(r => r.id === id), [id])
  const [passoAtual, setPassoAtual] = useState(0)
  const [concluido, setConcluido] = useState(false)
  const wakeLock = useWakeLock()
  const containerRef = useRef<HTMLDivElement>(null)

  const totalPassos = receita?.passos.length ?? 0
  const passo = receita?.passos[passoAtual]
  const tempoSegundos = passo?.minutos ? passo.minutos * 60 : 0

  const onTimerFinish = useCallback(() => {
    try {
      if ('vibrate' in navigator) navigator.vibrate([200, 100, 200, 100, 200])
    } catch { /* silently fail */ }
    try {
      const ctx = new AudioContext()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.frequency.value = 880
      gain.gain.value = 0.3
      osc.start()
      setTimeout(() => { osc.stop(); ctx.close() }, 500)
    } catch { /* silently fail */ }
  }, [])

  const timer = useTimer(tempoSegundos, onTimerFinish)

  useEffect(() => {
    wakeLock.request()
    return () => { wakeLock.release() }
  }, [])

  // Swipe support
  const touchStartX = useRef(0)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 60) {
      if (diff > 0) goNext()
      else goPrev()
    }
  }

  const goNext = () => {
    if (passoAtual < totalPassos - 1) {
      setPassoAtual(p => p + 1)
    } else {
      setConcluido(true)
    }
  }

  const goPrev = () => {
    if (concluido) {
      setConcluido(false)
    } else if (passoAtual > 0) {
      setPassoAtual(p => p - 1)
    }
  }

  if (!receita) {
    return (
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="glass rounded-card p-8 text-center">
          <p className="text-white/60 text-lg mb-4">Receita não encontrada.</p>
          <button onClick={() => navigate('/hoje')} className="btn-amarelo">Voltar</button>
        </div>
      </div>
    )
  }

  // Tela de conclusão
  if (concluido) {
    return (
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(circle at 50% 40%, rgba(253,224,71,0.15), transparent 70%)' }}
          aria-hidden="true"
        />
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-amarelo flex items-center justify-center mx-auto mb-6">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#0A0A0A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h1 className="heading-tight text-3xl text-white mb-2">Prato pronto!</h1>
          <p className="text-white/50 text-base mb-8">{receita.nome}</p>

          <button
            onClick={() => navigate('/hoje')}
            className="btn-amarelo w-full text-base mb-3"
          >
            Voltar para Hoje
          </button>
          <button
            onClick={() => navigate(`/receita/${receita.id}`)}
            className="w-full py-4 px-6 rounded-full border border-white/20 text-white font-medium active:scale-95 transition-transform"
          >
            Ver receita completa
          </button>
        </div>
      </div>
    )
  }

  const progresso = ((passoAtual + 1) / totalPassos) * 100

  return (
    <div
      ref={containerRef}
      className="relative z-10 min-h-screen flex flex-col"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Header */}
      <header className="px-4 pt-4 pb-2 flex items-center justify-between">
        <button
          onClick={() => navigate(`/receita/${receita.id}`)}
          className="w-10 h-10 rounded-full glass-subtle flex items-center justify-center active:scale-95 transition-transform"
          aria-label="Sair do passo a passo"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        <span className="text-white/50 text-sm font-medium">
          Passo {passoAtual + 1} de {totalPassos}
        </span>
        <div className="w-10" />
      </header>

      {/* Barra de progresso */}
      <div className="mx-4 h-1 rounded-full bg-cinza overflow-hidden">
        <div
          className="h-full bg-amarelo rounded-full transition-all duration-300"
          style={{ width: `${progresso}%` }}
        />
      </div>

      {/* Conteúdo do passo */}
      <div className="flex-1 flex flex-col justify-center px-6 py-8">
        <p className="text-white text-[22px] leading-[1.4] font-medium text-center">
          {passo?.texto}
        </p>

        {/* Cronômetro */}
        {tempoSegundos > 0 && (
          <div className="mt-8 flex flex-col items-center gap-4">
            <div className="relative w-32 h-32">
              <svg className="w-32 h-32 -rotate-90" viewBox="0 0 128 128">
                <circle cx="64" cy="64" r="56" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
                <circle
                  cx="64" cy="64" r="56"
                  fill="none" stroke="#FDE047" strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 56}
                  strokeDashoffset={2 * Math.PI * 56 * (1 - timer.remaining / tempoSegundos)}
                  className="transition-all duration-1000 ease-linear"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white font-bold text-2xl tabular-nums">
                  {formatTime(timer.remaining)}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              {timer.running ? (
                <button
                  onClick={timer.pause}
                  className="px-6 py-3 rounded-full border border-white/20 text-white font-medium active:scale-95 transition-transform min-h-[44px]"
                >
                  Pausar
                </button>
              ) : (
                <button
                  onClick={timer.start}
                  className="btn-amarelo min-h-[44px]"
                >
                  {timer.remaining < tempoSegundos ? 'Continuar' : 'Iniciar'}
                </button>
              )}
              {timer.remaining < tempoSegundos && (
                <button
                  onClick={timer.reset}
                  className="px-6 py-3 rounded-full border border-white/20 text-white font-medium active:scale-95 transition-transform min-h-[44px]"
                >
                  Reiniciar
                </button>
              )}
            </div>

            {timer.remaining === 0 && (
              <p className="text-amarelo font-bold text-sm animate-pulse">Tempo finalizado!</p>
            )}
          </div>
        )}

        {/* Ingredientes deste passo */}
        {passo?.ingredientes && passo.ingredientes.length > 0 && (
          <details className="mt-6 glass-subtle rounded-2xl overflow-hidden">
            <summary className="px-4 py-3 text-white/60 text-sm font-medium cursor-pointer select-none">
              Ingredientes deste passo ({passo.ingredientes.length})
            </summary>
            <div className="px-4 pb-3 space-y-1">
              {passo.ingredientes.map(nome => {
                const ing = receita.ingredientes.find(i => i.nome === nome)
                return (
                  <div key={nome} className="flex justify-between text-sm">
                    <span className="text-white/80">{nome}</span>
                    <span className="text-white/40">
                      {ing ? (ing.quantidade !== null ? `${ing.quantidade} ${ing.unidade}` : ing.observacao || 'a gosto') : ''}
                    </span>
                  </div>
                )
              })}
            </div>
          </details>
        )}
      </div>

      {/* Botões de navegação */}
      <div className="px-4 pb-8 flex gap-3">
        <button
          onClick={goPrev}
          disabled={passoAtual === 0}
          className="flex-1 py-4 rounded-full border border-white/20 text-white font-bold active:scale-95 transition-transform disabled:opacity-30 min-h-[52px]"
        >
          Voltar
        </button>
        <button
          onClick={goNext}
          className="flex-1 btn-amarelo min-h-[52px]"
        >
          {passoAtual === totalPassos - 1 ? 'Finalizar' : 'Próximo'}
        </button>
      </div>
    </div>
  )
}
