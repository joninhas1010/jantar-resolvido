import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { guiaGeladeira } from '../content/guia-geladeira'

export default function ExtrasGeladeira() {
  const navigate = useNavigate()
  const [abertos, setAbertos] = useState<Record<string, boolean>>({ [guiaGeladeira[0].id]: true })
  const [checks, setChecks] = useState<Record<string, boolean>>(() => {
    try {
      const raw = localStorage.getItem('jr-geladeira-checks')
      return raw ? JSON.parse(raw) : {}
    } catch { return {} }
  })

  useEffect(() => {
    try { localStorage.setItem('jr-geladeira-checks', JSON.stringify(checks)) } catch {}
  }, [checks])

  const toggle = (id: string) => {
    setAbertos(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const toggleCheck = (id: string) => {
    setChecks(prev => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div className="relative z-10 min-h-screen pb-28">
      <div className="px-4 pt-6 pb-2">
        <button onClick={() => navigate('/extras')} className="text-white/50 text-sm mb-3 flex items-center gap-1">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
          Extras
        </button>
        <span className="inline-block bg-amarelo text-preto label-caps px-3 py-1.5 rounded-full mb-3">COMPLEMENTO 03</span>
        <h1 className="heading-tight text-[26px] text-white leading-tight">Guia Geladeira Pronta</h1>
        <p className="text-white/50 text-sm mt-1">Orientações de organização e armazenamento para facilitar os preparos da semana.</p>
      </div>

      <div className="px-4 mt-4 space-y-3">
        {guiaGeladeira.map(secao => {
          const aberto = abertos[secao.id] || false
          const checkaveisTotal = secao.itens.filter(i => i.checkavel).length
          const checkaveisMarcados = secao.itens.filter(i => i.checkavel && checks[i.id]).length

          return (
            <div key={secao.id} className="glass rounded-card overflow-hidden">
              <button
                onClick={() => toggle(secao.id)}
                className="w-full p-4 text-left flex items-center justify-between"
              >
                <div>
                  <h2 className="text-white font-bold text-base leading-tight">{secao.titulo}</h2>
                  <p className="text-white/50 text-sm mt-0.5">{secao.descricao}</p>
                  {checkaveisTotal > 0 && (
                    <span className="text-amarelo text-xs mt-1 inline-block">
                      {checkaveisMarcados}/{checkaveisTotal} feitos
                    </span>
                  )}
                </div>
                <svg
                  width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  className={`flex-shrink-0 ml-3 transition-transform duration-200 ${aberto ? 'rotate-180' : ''}`}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {aberto && (
                <div className="px-4 pb-4 space-y-0">
                  {secao.itens.map((item, i) => (
                    <div
                      key={item.id}
                      className={`flex items-start gap-3 py-3 ${i < secao.itens.length - 1 ? 'border-b border-white/10' : ''}`}
                    >
                      {item.checkavel ? (
                        <button
                          onClick={() => toggleCheck(item.id)}
                          className="mt-0.5 flex-shrink-0"
                        >
                          <span className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                            checks[item.id] ? 'bg-amarelo border-amarelo' : 'border-white/30'
                          }`}>
                            {checks[item.id] && (
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0A0A0A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            )}
                          </span>
                        </button>
                      ) : (
                        <span className="w-5 h-5 flex items-center justify-center text-amarelo text-xs flex-shrink-0 mt-0.5">
                          •
                        </span>
                      )}
                      <p className={`text-sm leading-relaxed transition-all ${
                        item.checkavel && checks[item.id] ? 'text-white/30 line-through' : 'text-white/80'
                      }`}>
                        {item.texto}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <p className="text-center text-white/30 text-[11px] px-8 mt-6 leading-relaxed">
        Estas são orientações gerais de organização. Sempre confira a validade dos alimentos e as condições de armazenamento.
      </p>
    </div>
  )
}
