import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { gerarListaCompras, agruparPorCategoria, getLabelSemana, getDescSemana, formatarListaTexto, getSemana, ItemCompra } from '../utils/listaCompras'
import { formatQuantidade } from '../utils/formatQuantidade'
import { IconMeat, IconLeaf, IconWheat, IconJar } from '../components/Icons'

const CATEGORIAS_ICONS: Record<string, React.FC<{ size?: number; color?: string; className?: string }>> = {
  'Proteínas': IconMeat,
  'Legumes e verduras': IconLeaf,
  'Grãos e acompanhamentos': IconWheat,
  'Temperos': IconJar,
  'Outros': IconJar,
}

const SEMANAS = [1, 2, 3, 4, 5]

export default function Compras() {
  const { diaDoPlan, getReceitaDoDia, itensMarcadosCompras, toggleItemCompra, limparMarcasCompras, itensExtras, addItemExtra, removeItemExtra } = useApp()
  const semanaAtual = getSemana(diaDoPlan)
  const [semana, setSemana] = useState(semanaAtual)
  const [novoItem, setNovoItem] = useState('')
  const [copiado, setCopiado] = useState(false)

  const itens = gerarListaCompras(semana, getReceitaDoDia)
  const grupos = agruparPorCategoria(itens)

  const totalItens = itens.length + itensExtras.length
  const marcadosCount = itens.filter(i => itensMarcadosCompras[i.key]).length +
    itensExtras.filter(e => itensMarcadosCompras[`extra-${e}`]).length

  const handleShare = async () => {
    const texto = formatarListaTexto(itens, semana, itensMarcadosCompras)
    if (navigator.share) {
      try {
        await navigator.share({ title: `Lista de compras - ${getLabelSemana(semana)}`, text: texto })
      } catch {}
    } else {
      try {
        await navigator.clipboard.writeText(texto)
        setCopiado(true)
        setTimeout(() => setCopiado(false), 2000)
      } catch {}
    }
  }

  const handleAddExtra = () => {
    const item = novoItem.trim()
    if (item) {
      addItemExtra(item)
      setNovoItem('')
    }
  }

  return (
    <div className="relative z-10 min-h-screen pb-28">
      <div className="px-4 pt-6 pb-2">
        <h1 className="heading-tight text-[28px] text-white leading-tight">Lista de compras</h1>
        <p className="text-white/50 text-sm mt-1">Tudo que você precisa, semana a semana.</p>
      </div>

      {/* Seletor de semana */}
      <div className="flex gap-2 px-4 py-3 overflow-x-auto">
        {SEMANAS.map(s => (
          <button
            key={s}
            onClick={() => setSemana(s)}
            className={`flex-shrink-0 px-4 py-2.5 rounded-full text-sm font-bold transition-all duration-200 ${
              s === semana
                ? 'bg-amarelo text-preto'
                : 'bg-cinza text-white/60'
            }`}
          >
            {s === 5 ? 'Finais' : `Sem ${s}`}
          </button>
        ))}
      </div>

      {/* Info da semana */}
      <div className="px-4 mb-3 flex items-center justify-between">
        <div>
          <span className="text-white/40 text-sm">{getDescSemana(semana)}</span>
          <span className="text-white/30 text-sm ml-2">·</span>
          <span className="text-white/40 text-sm ml-2">{marcadosCount}/{totalItens} itens</span>
        </div>
        {marcadosCount > 0 && (
          <button
            onClick={() => limparMarcasCompras(semana)}
            className="text-white/40 text-xs underline"
          >
            Limpar marcações
          </button>
        )}
      </div>

      {/* Grupos de ingredientes */}
      <div className="px-4 space-y-4">
        {grupos.map(({ categoria, itens: catItens }) => {
          const Icon = CATEGORIAS_ICONS[categoria] || IconJar
          return (
            <div key={categoria} className="glass rounded-card p-4">
              <div className="flex items-center gap-2 mb-3">
                <Icon size={18} color="#FDE047" />
                <h2 className="text-white font-bold text-base">{categoria}</h2>
                <span className="text-white/30 text-sm">({catItens.length})</span>
              </div>
              <ul className="space-y-0">
                {catItens.map((item, i) => (
                  <ItemRow
                    key={item.key}
                    item={item}
                    checked={!!itensMarcadosCompras[item.key]}
                    onToggle={() => toggleItemCompra(item.key)}
                    last={i === catItens.length - 1}
                  />
                ))}
              </ul>
            </div>
          )
        })}

        {/* Sem itens */}
        {grupos.length === 0 && itensExtras.length === 0 && (
          <div className="glass rounded-card p-6 text-center">
            <p className="text-white/50 text-base">Nenhum ingrediente para esta semana.</p>
            <p className="text-white/30 text-sm mt-1">As receitas completas serão adicionadas na próxima etapa.</p>
          </div>
        )}

        {/* Itens extras do usuário */}
        {itensExtras.length > 0 && (
          <div className="glass rounded-card p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-amarelo text-lg">+</span>
              <h2 className="text-white font-bold text-base">Itens extras</h2>
              <span className="text-white/30 text-sm">({itensExtras.length})</span>
            </div>
            <ul className="space-y-0">
              {itensExtras.map((item, i) => {
                const key = `extra-${item}`
                return (
                  <li
                    key={item}
                    className={`flex items-center justify-between py-3 ${
                      i < itensExtras.length - 1 ? 'border-b border-white/10' : ''
                    }`}
                  >
                    <button
                      onClick={() => toggleItemCompra(key)}
                      className="flex items-center gap-3 flex-1 text-left"
                    >
                      <span className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                        itensMarcadosCompras[key] ? 'bg-amarelo border-amarelo' : 'border-white/30'
                      }`}>
                        {itensMarcadosCompras[key] && (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0A0A0A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </span>
                      <span className={`text-[15px] transition-all ${
                        itensMarcadosCompras[key] ? 'text-white/30 line-through' : 'text-white'
                      }`}>
                        {item}
                      </span>
                    </button>
                    <button
                      onClick={() => removeItemExtra(item)}
                      className="text-white/30 text-sm px-2 py-1"
                      aria-label={`Remover ${item}`}
                    >
                      ✕
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        )}

        {/* Adicionar item extra */}
        <div className="glass-subtle rounded-card p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={novoItem}
              onChange={e => setNovoItem(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddExtra()}
              placeholder="Adicionar item extra..."
              className="flex-1 bg-transparent text-white placeholder:text-white/30 text-sm outline-none border-b border-white/10 pb-2 focus:border-amarelo transition-colors"
            />
            <button
              onClick={handleAddExtra}
              disabled={!novoItem.trim()}
              className="text-amarelo font-bold text-sm px-3 py-1 disabled:opacity-30 transition-opacity"
            >
              Adicionar
            </button>
          </div>
        </div>
      </div>

      {/* Botão compartilhar */}
      <div className="px-4 mt-6">
        <button
          onClick={handleShare}
          className="btn-amarelo w-full text-base"
        >
          {copiado ? 'Lista copiada!' : 'Compartilhar lista'}
        </button>
      </div>
    </div>
  )
}

function ItemRow({ item, checked, onToggle, last }: {
  item: ItemCompra
  checked: boolean
  onToggle: () => void
  last: boolean
}) {
  const qtdText = item.quantidade !== null
    ? formatQuantidade(item.quantidade, item.unidade)
    : 'a gosto'

  return (
    <li className={`flex items-center py-3 ${!last ? 'border-b border-white/10' : ''}`}>
      <button
        onClick={onToggle}
        className="flex items-center gap-3 flex-1 text-left"
        aria-label={`${checked ? 'Desmarcar' : 'Marcar'} ${item.nome}`}
      >
        <span className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
          checked ? 'bg-amarelo border-amarelo' : 'border-white/30'
        }`}>
          {checked && (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0A0A0A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </span>
        <span className={`text-[15px] transition-all ${checked ? 'text-white/30 line-through' : 'text-white'}`}>
          {item.nome}
        </span>
      </button>
      <span className={`text-sm transition-all ${checked ? 'text-white/20' : 'text-white/50'}`}>
        {qtdText}
      </span>
    </li>
  )
}
