import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import Logo from '../components/Logo'
import PratoPlaceholder from '../components/PratoPlaceholder'
import { IconClock, IconUsers, IconBulb, IconMeat, IconLeaf, IconWheat, IconJar } from '../components/Icons'
import { receitasPrincipais } from '../content/receitas-principais'
import { Receita } from '../types'

const DIAS_SEMANA = ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB', 'DOM']

export default function Hoje() {
  const navigate = useNavigate()

  const diaDoPlan = 12
  const semanaInicio = 10

  const [diaSelecionado, setDiaSelecionado] = useState(diaDoPlan)

  const receita: Receita | undefined = useMemo(() => {
    return receitasPrincipais.find(r => r.diaPadrao === diaSelecionado)
  }, [diaSelecionado])

  const diasDaSemana = Array.from({ length: 7 }, (_, i) => semanaInicio + i)

  return (
    <div className="relative z-10 min-h-screen pb-28">
      {/* Header */}
      <header className="flex items-center justify-between px-4 pt-4 pb-2">
        <Logo />
        <button
          onClick={() => navigate('/calendario')}
          className="bg-amarelo text-preto font-bold text-sm px-4 py-2 rounded-full active:scale-95 transition-transform"
          aria-label={`Dia ${diaDoPlan} de 30. Abrir calendário.`}
        >
          Dia {diaDoPlan} de 30
        </button>
      </header>

      {/* Faixa de dias */}
      <div className="flex gap-1.5 px-4 py-3">
        {diasDaSemana.map((dia, i) => {
          const ativo = dia === diaSelecionado
          return (
            <button
              key={dia}
              onClick={() => setDiaSelecionado(dia)}
              className={`flex-1 flex flex-col items-center justify-center py-2.5 rounded-2xl transition-all duration-200 min-h-[60px] ${
                ativo
                  ? 'bg-amarelo text-preto'
                  : 'bg-cinza text-white/60'
              }`}
              aria-label={`${DIAS_SEMANA[i]}, dia ${dia} do planejamento`}
              aria-pressed={ativo}
            >
              <span className="label-caps text-[9px]">{DIAS_SEMANA[i]}</span>
              <span className="text-xl font-bold leading-tight mt-0.5">{dia}</span>
            </button>
          )
        })}
      </div>

      {/* Cartão Jantar do dia */}
      {receita ? (
        <section className="mx-4 mt-2 glass rounded-card p-5 relative overflow-hidden" aria-label="Jantar do dia">
          {/* Glow behind card */}
          <div
            className="absolute -top-20 -right-20 w-[200px] h-[200px] rounded-full opacity-20 pointer-events-none"
            style={{ background: 'radial-gradient(circle, #FDE047, transparent 70%)', filter: 'blur(40px)' }}
            aria-hidden="true"
          />

          <div className="flex items-start justify-between gap-3 relative">
            <div className="flex-1">
              {/* Label */}
              <span className="inline-block bg-amarelo text-preto label-caps px-3 py-1.5 rounded-full mb-3">
                JANTAR DO DIA
              </span>
              {/* Título */}
              <button
                onClick={() => navigate(`/receita/${receita.id}`)}
                className="text-left"
                aria-label={`Ver receita: ${receita.nome}`}
              >
                <h1 className="heading-tight text-[26px] leading-[1.1] text-white mb-4">
                  {receita.nome}
                </h1>
              </button>
            </div>

            {/* Foto / Placeholder */}
            <div className="w-[140px] h-[140px] flex-shrink-0 rounded-3xl overflow-hidden">
              {receita.foto ? (
                <img
                  src={`/pratos/${receita.foto}`}
                  alt={receita.nome}
                  width={140}
                  height={140}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              ) : (
                <PratoPlaceholder nome={receita.nome} className="w-full h-full rounded-3xl" />
              )}
            </div>
          </div>

          {/* Pills tempo / porções */}
          <div className="flex gap-3 mb-5">
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
                <span className="text-amarelo font-bold text-sm leading-tight">{receita.porcoes}</span>
              </div>
            </div>
          </div>

          {/* Ingredientes */}
          <ul className="space-y-0 mb-5">
            {receita.ingredientes
              .filter(ing => ing.categoria !== 'Temperos')
              .map((ing, i, arr) => (
                <li
                  key={ing.nome}
                  className={`flex items-center justify-between py-3 ${
                    i < arr.length - 1 ? 'border-b border-white/10' : ''
                  }`}
                >
                  <span className="text-white text-[15px]">{ing.nome}</span>
                  <span className="text-white/60 text-[15px]">
                    {ing.quantidade !== null
                      ? `${ing.quantidade} ${ing.unidade}`
                      : ing.observacao || 'a gosto'}
                  </span>
                </li>
              ))}
          </ul>

          {/* Alternativa */}
          {receita.substituicoes.length > 0 && (
            <div className="glass-subtle rounded-2xl p-4 flex items-start gap-3 mb-5">
              <IconBulb size={20} color="#FDE047" className="flex-shrink-0 mt-0.5" />
              <p className="text-white/80 text-sm">
                <strong className="text-white">Alternativa:</strong>{' '}
                {receita.substituicoes[0].falta
                  ? `sem ${receita.substituicoes[0].falta.toLowerCase()}, use ${receita.substituicoes[0].use.toLowerCase()}`
                  : receita.substituicoes[0].use}
              </p>
            </div>
          )}

          {/* Botão Ver passo a passo */}
          <button
            onClick={() => navigate(`/receita/${receita.id}/preparo`)}
            className="btn-amarelo w-full text-base"
          >
            Ver passo a passo
          </button>
        </section>
      ) : (
        <section className="mx-4 mt-2 glass rounded-card p-6 text-center" aria-label="Sem receita">
          <p className="text-white/50 text-base">Nenhuma receita para o dia {diaSelecionado}.</p>
          <p className="text-white/30 text-sm mt-1">As receitas completas serão adicionadas na próxima etapa.</p>
        </section>
      )}

      {/* Cartão Lista de Compras */}
      <section className="mx-4 mt-4 glass rounded-card p-5" aria-label="Lista de compras para a semana">
        <h2 className="text-white font-bold text-lg">
          Lista de compras <span className="text-white/50 font-normal text-base">· Para a semana</span>
        </h2>

        <div className="grid grid-cols-2 gap-3 mt-4">
          {[
            { label: 'Proteínas', Icon: IconMeat },
            { label: 'Legumes e verduras', Icon: IconLeaf },
            { label: 'Grãos e acompanhamentos', Icon: IconWheat },
            { label: 'Temperos', Icon: IconJar },
          ].map(({ label, Icon }) => (
            <button
              key={label}
              onClick={() => navigate('/compras')}
              className="glass-subtle rounded-full flex items-center gap-2 px-4 py-3 active:scale-95 transition-transform min-h-[44px]"
              aria-label={`Ver ${label} na lista de compras`}
            >
              <Icon size={18} color="rgba(255,255,255,0.5)" />
              <span className="text-white/70 text-[13px] font-medium">{label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Rodapé aviso */}
      <p className="text-center text-white/30 text-[11px] px-8 mt-6 leading-relaxed">
        O tempo considera os ingredientes disponíveis. Compras e descongelamento não entram.
      </p>
    </div>
  )
}
