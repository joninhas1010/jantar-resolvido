import { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { receitasPrincipais } from '../content/receitas-principais'
import PratoPlaceholder from '../components/PratoPlaceholder'
import { IconClock, IconUsers } from '../components/Icons'
import { formatQuantidade, scaleQuantidade } from '../utils/formatQuantidade'
import { Categoria, Ingrediente } from '../types'

const ORDEM_CATEGORIAS: Categoria[] = [
  'Proteínas',
  'Legumes e verduras',
  'Grãos e acompanhamentos',
  'Temperos',
  'Outros',
]

export default function Receita() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const receita = useMemo(() => {
    return receitasPrincipais.find(r => r.id === id)
  }, [id])

  const [porcoes, setPorcoes] = useState(receita?.porcoes ?? 4)
  const [checados, setChecados] = useState<Set<string>>(new Set())

  if (!receita) {
    return (
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="glass rounded-card p-8 text-center">
          <p className="text-white/60 text-lg mb-4">Receita não encontrada.</p>
          <button onClick={() => navigate('/hoje')} className="btn-amarelo">
            Voltar para Hoje
          </button>
        </div>
      </div>
    )
  }

  const ingredientesAgrupados = useMemo(() => {
    const grupos: Record<string, Ingrediente[]> = {}
    for (const cat of ORDEM_CATEGORIAS) {
      const itens = receita.ingredientes.filter(i => i.categoria === cat)
      if (itens.length > 0) grupos[cat] = itens
    }
    return grupos
  }, [receita])

  const toggleCheck = (nome: string) => {
    setChecados(prev => {
      const next = new Set(prev)
      if (next.has(nome)) next.delete(nome)
      else next.add(nome)
      return next
    })
  }

  const diaLabel = receita.diaPadrao ? `Dia ${receita.diaPadrao}` : receita.tipo === 'economico' ? 'Econômico' : 'SOS'

  return (
    <div className="relative z-10 min-h-screen pb-28">
      {/* Header */}
      <header className="flex items-center gap-3 px-4 pt-4 pb-2">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full glass-subtle flex items-center justify-center active:scale-95 transition-transform"
          aria-label="Voltar"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <span className="bg-amarelo text-preto label-caps px-3 py-1.5 rounded-full">{diaLabel}</span>
      </header>

      {/* Foto grande */}
      <div className="mx-4 mt-2 h-[220px] rounded-card overflow-hidden">
        {receita.foto ? (
          <img
            src={`/pratos/${receita.foto}`}
            alt={receita.nome}
            width={400}
            height={220}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        ) : (
          <PratoPlaceholder nome={receita.nome} className="w-full h-full" />
        )}
      </div>

      {/* Nome e info */}
      <div className="px-4 mt-4">
        <h1 className="heading-tight text-[28px] leading-[1.1] text-white">{receita.nome}</h1>

        <div className="flex gap-3 mt-4">
          <div className="glass-subtle rounded-full flex items-center gap-2 px-4 py-2.5">
            <IconClock size={18} color="rgba(255,255,255,0.6)" />
            <div className="flex flex-col">
              <span className="text-white/60 text-[11px] leading-tight">Tempo total</span>
              <span className="text-amarelo font-bold text-sm leading-tight">{receita.tempoTotalMin} min</span>
            </div>
          </div>
          <div className="glass-subtle rounded-full flex items-center gap-2 px-4 py-2.5">
            <IconUsers size={18} color="rgba(255,255,255,0.6)" />
            <div className="flex flex-col">
              <span className="text-white/60 text-[11px] leading-tight">Porções</span>
              <span className="text-amarelo font-bold text-sm leading-tight">{porcoes}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Ajuste de porções */}
      <div className="mx-4 mt-5 glass-subtle rounded-2xl p-4 flex items-center justify-between">
        <span className="text-white font-medium text-sm">Ajustar porções</span>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setPorcoes(p => Math.max(1, p - 1))}
            disabled={porcoes <= 1}
            className="w-10 h-10 rounded-full bg-cinza flex items-center justify-center text-white text-xl font-bold active:scale-95 transition-transform disabled:opacity-30"
            aria-label="Diminuir porções"
          >
            −
          </button>
          <span className="text-amarelo font-bold text-xl w-8 text-center">{porcoes}</span>
          <button
            onClick={() => setPorcoes(p => Math.min(12, p + 1))}
            disabled={porcoes >= 12}
            className="w-10 h-10 rounded-full bg-cinza flex items-center justify-center text-white text-xl font-bold active:scale-95 transition-transform disabled:opacity-30"
            aria-label="Aumentar porções"
          >
            +
          </button>
        </div>
      </div>

      {/* Ingredientes agrupados */}
      <section className="mx-4 mt-5" aria-label="Ingredientes">
        <h2 className="text-white font-bold text-lg mb-3">Ingredientes</h2>

        {Object.entries(ingredientesAgrupados).map(([categoria, itens]) => (
          <div key={categoria} className="mb-4">
            <h3 className="label-caps text-white/40 mb-2">{categoria}</h3>
            <div className="glass-subtle rounded-2xl overflow-hidden">
              {itens.map((ing, i) => {
                const scaled = scaleQuantidade(ing.quantidade, receita.porcoes, porcoes)
                const checked = checados.has(ing.nome)
                return (
                  <button
                    key={ing.nome}
                    onClick={() => toggleCheck(ing.nome)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left min-h-[44px] transition-colors ${
                      i < itens.length - 1 ? 'border-b border-white/10' : ''
                    } ${checked ? 'opacity-40' : ''}`}
                  >
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                      checked ? 'bg-amarelo border-amarelo' : 'border-white/30'
                    }`}>
                      {checked && (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0A0A0A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </div>
                    <span className={`flex-1 text-[15px] ${checked ? 'line-through text-white/40' : 'text-white'}`}>
                      {ing.nome}
                    </span>
                    <span className={`text-[15px] ${checked ? 'line-through text-white/30' : 'text-white/60'}`}>
                      {formatQuantidade(scaled, ing.unidade, ing.observacao)}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </section>

      {/* Substituições */}
      {receita.substituicoes.length > 0 && (
        <section className="mx-4 mt-4" aria-label="Substituições">
          <h2 className="text-white font-bold text-lg mb-3">Substituições</h2>
          <div className="glass-subtle rounded-2xl p-4 space-y-3">
            {receita.substituicoes.map((sub, i) => (
              <div key={i} className={`flex gap-2 ${i < receita.substituicoes.length - 1 ? 'pb-3 border-b border-white/10' : ''}`}>
                <span className="text-amarelo text-sm flex-shrink-0">•</span>
                <p className="text-white/80 text-sm">
                  Se faltar <strong className="text-white">{sub.falta}</strong>, use{' '}
                  <strong className="text-white">{sub.use}</strong>
                  {sub.observacao && <span className="text-white/50"> ({sub.observacao})</span>}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Preparo prévia */}
      <section className="mx-4 mt-5" aria-label="Preparo">
        <h2 className="text-white font-bold text-lg mb-3">Preparo</h2>
        <div className="glass-subtle rounded-2xl p-4 space-y-3">
          {receita.passos.map((passo, i) => (
            <div key={i} className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-cinza flex items-center justify-center text-white/60 text-xs font-bold flex-shrink-0 mt-0.5">
                {i + 1}
              </span>
              <p className="text-white/70 text-sm leading-relaxed">{passo.texto}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Botão fixo Ver passo a passo */}
      <div className="sticky bottom-20 mx-4 mt-6 z-40">
        <button
          onClick={() => navigate(`/receita/${receita.id}/preparo`)}
          className="btn-amarelo w-full text-base shadow-lg shadow-amarelo/20"
        >
          Ver passo a passo
        </button>
      </div>

      {/* Rodapé aviso */}
      <p className="text-center text-white/30 text-[11px] px-8 mt-4 mb-4 leading-relaxed">
        Confira ingredientes e substituições conforme as necessidades da sua família.
      </p>
    </div>
  )
}
