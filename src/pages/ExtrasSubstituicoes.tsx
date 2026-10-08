import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { substituicoesGlobais, SUBSTITUICOES_COMUNS, SubstituicaoGlobal } from '../content/substituicoes'
import { Categoria } from '../types'

const CATEGORIAS_ORDEM: Categoria[] = ['Proteínas', 'Legumes e verduras', 'Grãos e acompanhamentos', 'Temperos', 'Outros']

function agrupar(subs: SubstituicaoGlobal[]) {
  return CATEGORIAS_ORDEM
    .map(cat => ({
      categoria: cat,
      itens: subs.filter(s => s.categoria === cat),
    }))
    .filter(g => g.itens.length > 0)
}

export default function ExtrasSubstituicoes() {
  const navigate = useNavigate()
  const [busca, setBusca] = useState('')

  const buscaLower = busca.toLowerCase().trim()

  const comunsFiltradas = buscaLower
    ? SUBSTITUICOES_COMUNS.filter(s =>
        s.falta.toLowerCase().includes(buscaLower) ||
        s.use.toLowerCase().includes(buscaLower)
      )
    : SUBSTITUICOES_COMUNS

  const receitasFiltradas = buscaLower
    ? substituicoesGlobais.filter(s =>
        s.falta.toLowerCase().includes(buscaLower) ||
        s.use.toLowerCase().includes(buscaLower)
      )
    : substituicoesGlobais

  const gruposComuns = agrupar(comunsFiltradas)
  const gruposReceitas = agrupar(receitasFiltradas)

  const temResultados = comunsFiltradas.length > 0 || receitasFiltradas.length > 0

  return (
    <div className="relative z-10 min-h-screen pb-28">
      <div className="px-4 pt-6 pb-2">
        <button onClick={() => navigate('/extras')} className="text-white/50 text-sm mb-3 flex items-center gap-1">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
          Extras
        </button>
        <h1 className="heading-tight text-[26px] text-white leading-tight">Substituições práticas</h1>
        <p className="text-white/50 text-sm mt-1">Busque o ingrediente que falta e veja o que usar no lugar.</p>
      </div>

      {/* Busca */}
      <div className="px-4 mt-3">
        <input
          type="text"
          value={busca}
          onChange={e => setBusca(e.target.value)}
          placeholder="Ex: creme de leite, brócolis..."
          className="w-full glass-subtle rounded-full px-4 py-3 text-white text-sm placeholder:text-white/30 outline-none focus:ring-1 focus:ring-amarelo transition-all"
        />
      </div>

      {!temResultados && (
        <div className="px-4 mt-6">
          <div className="glass rounded-card p-6 text-center">
            <p className="text-white/50 text-sm">Nenhuma substituição encontrada para "{busca}".</p>
          </div>
        </div>
      )}

      {/* Substituições mais comuns */}
      {comunsFiltradas.length > 0 && (
        <div className="px-4 mt-4">
          <h2 className="label-caps text-amarelo mb-3">Substituições mais comuns</h2>
          <div className="space-y-2">
            {gruposComuns.map(({ categoria, itens }) => (
              <div key={`comum-${categoria}`} className="glass rounded-card p-4">
                <h3 className="text-white/40 text-xs font-bold mb-2">{categoria}</h3>
                {itens.map((sub, i) => (
                  <SubItem key={`comum-${sub.falta}-${i}`} sub={sub} last={i === itens.length - 1} />
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Das receitas */}
      {receitasFiltradas.length > 0 && (
        <div className="px-4 mt-6">
          <h2 className="label-caps text-white/40 mb-3">Das receitas do plano</h2>
          <div className="space-y-2">
            {gruposReceitas.map(({ categoria, itens }) => (
              <div key={`receita-${categoria}`} className="glass rounded-card p-4">
                <h3 className="text-white/40 text-xs font-bold mb-2">{categoria}</h3>
                {itens.map((sub, i) => (
                  <SubItem key={`receita-${sub.falta}-${sub.use}-${i}`} sub={sub} last={i === itens.length - 1} />
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function SubItem({ sub, last }: { sub: SubstituicaoGlobal; last: boolean }) {
  return (
    <div className={`py-2.5 ${!last ? 'border-b border-white/10' : ''}`}>
      <p className="text-white text-sm">
        <span className="text-white/50">Sem</span> {sub.falta}
      </p>
      <p className="text-amarelo text-sm mt-0.5">
        Use {sub.use}
      </p>
      {sub.observacao && (
        <p className="text-white/30 text-xs mt-0.5">{sub.observacao}</p>
      )}
    </div>
  )
}
