import { useNavigate } from 'react-router-dom'

const complementos = [
  {
    num: '01',
    titulo: '15 Jantares Econômicos',
    descricao: 'Opções com ingredientes simples para ajustar o jantar ao orçamento da semana.',
    rota: '/extras/economicos',
  },
  {
    num: '02',
    titulo: '10 Jantares SOS',
    descricao: 'Receitas de até 10 minutos para aquelas noites em que o tempo fica ainda mais curto.',
    rota: '/extras/sos',
  },
  {
    num: '03',
    titulo: 'Guia Geladeira Pronta',
    descricao: 'Orientações de organização e armazenamento para facilitar os preparos da semana.',
    rota: '/extras/geladeira',
  },
]

export default function Extras() {
  const navigate = useNavigate()

  return (
    <div className="relative z-10 min-h-screen pb-28">
      <div className="px-4 pt-6 pb-2">
        <h1 className="heading-tight text-[28px] text-white leading-tight">Também no seu pacote</h1>
        <p className="text-white/50 text-sm mt-1">Uma ajuda extra para as noites fora do plano.</p>
      </div>

      <div className="px-4 mt-4 space-y-4">
        {complementos.map(({ num, titulo, descricao, rota }) => (
          <button
            key={num}
            onClick={() => navigate(rota)}
            className="w-full glass rounded-card p-5 text-left active:scale-[0.98] transition-transform"
          >
            <span className="inline-block bg-amarelo text-preto label-caps px-3 py-1.5 rounded-full mb-3">
              COMPLEMENTO {num}
            </span>
            <h2 className="text-white font-bold text-lg leading-tight">{titulo}</h2>
            <p className="text-white/50 text-sm mt-2 leading-relaxed">{descricao}</p>
          </button>
        ))}

        {/* Substituições */}
        <button
          onClick={() => navigate('/extras/substituicoes')}
          className="w-full glass-subtle rounded-card p-5 text-left active:scale-[0.98] transition-transform"
        >
          <h2 className="text-white font-bold text-base leading-tight">Substituições práticas</h2>
          <p className="text-white/50 text-sm mt-1">Busque o que falta e veja o que usar no lugar.</p>
        </button>
      </div>

      {/* Rodapé */}
      <div className="px-4 mt-8">
        <button
          onClick={() => navigate('/sobre')}
          className="w-full py-3 rounded-full border border-white/20 text-white/60 text-sm font-medium active:scale-95 transition-transform"
        >
          Sobre o planejamento
        </button>
      </div>
    </div>
  )
}
