import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { config } from '../config'
import { useApp } from '../context/AppContext'
import { loadState, saveState, AppState } from '../store'
import Logo from '../components/Logo'

export default function Sobre() {
  const navigate = useNavigate()
  const { state } = useApp()
  const fileRef = useRef<HTMLInputElement>(null)
  const [feedback, setFeedback] = useState('')
  const [confirmApagar, setConfirmApagar] = useState(false)

  const showFeedback = (msg: string) => {
    setFeedback(msg)
    setTimeout(() => setFeedback(''), 3000)
  }

  const exportar = () => {
    try {
      const dados = {
        versao: config.versao,
        exportadoEm: new Date().toISOString(),
        estado: loadState(),
        comprasMarcados: (() => { try { return JSON.parse(localStorage.getItem('jr-compras-marcados') || '{}') } catch { return {} } })(),
        comprasExtras: (() => { try { return JSON.parse(localStorage.getItem('jr-compras-extras') || '[]') } catch { return [] } })(),
        geladeiraChecks: (() => { try { return JSON.parse(localStorage.getItem('jr-geladeira-checks') || '{}') } catch { return {} } })(),
      }
      const blob = new Blob([JSON.stringify(dados, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `jantar-resolvido-backup-${new Date().toISOString().split('T')[0]}.json`
      a.click()
      URL.revokeObjectURL(url)
      showFeedback('Backup exportado com sucesso.')
    } catch {
      showFeedback('Erro ao exportar. Tente novamente.')
    }
  }

  const importar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const dados = JSON.parse(reader.result as string)
        if (!dados.estado) throw new Error('Arquivo inválido')
        saveState(dados.estado as AppState)
        if (dados.comprasMarcados) {
          try { localStorage.setItem('jr-compras-marcados', JSON.stringify(dados.comprasMarcados)) } catch {}
        }
        if (dados.comprasExtras) {
          try { localStorage.setItem('jr-compras-extras', JSON.stringify(dados.comprasExtras)) } catch {}
        }
        if (dados.geladeiraChecks) {
          try { localStorage.setItem('jr-geladeira-checks', JSON.stringify(dados.geladeiraChecks)) } catch {}
        }
        showFeedback('Progresso importado. Recarregue o app para ver as mudanças.')
      } catch {
        showFeedback('Arquivo inválido. Use um backup exportado pelo app.')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const apagarDados = () => {
    try {
      localStorage.removeItem('jr-state')
      localStorage.removeItem('jr-compras-marcados')
      localStorage.removeItem('jr-compras-extras')
      localStorage.removeItem('jr-geladeira-checks')
    } catch {}
    setConfirmApagar(false)
    showFeedback('Dados apagados. Recarregue o app para começar do zero.')
  }

  return (
    <div className="relative z-10 min-h-screen pb-28">
      <div className="px-4 pt-6 pb-2">
        <button onClick={() => navigate('/extras')} className="text-white/50 text-sm mb-3 flex items-center gap-1">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
          Extras
        </button>
        <div className="flex items-center gap-3 mb-4">
          <Logo />
        </div>
      </div>

      {/* Avisos */}
      <div className="px-4 space-y-3">
        <div className="glass rounded-card p-4">
          <h2 className="text-white font-bold text-base mb-2">Sobre o tempo das receitas</h2>
          <p className="text-white/60 text-sm leading-relaxed">
            O tempo de até 20 minutos pressupõe os ingredientes disponíveis e nas condições da receita.
            Compras e descongelamento não entram nesse prazo.
          </p>
        </div>

        <div className="glass rounded-card p-4">
          <h2 className="text-white font-bold text-base mb-2">Aviso nutricional</h2>
          <p className="text-white/60 text-sm leading-relaxed">
            Este não é um planejamento nutricional individualizado.
            Confira os ingredientes e substituições considerando as necessidades da sua família.
          </p>
        </div>

        <div className="glass rounded-card p-4">
          <h2 className="text-white font-bold text-base mb-2">Como funciona</h2>
          <p className="text-white/60 text-sm leading-relaxed">
            Conteúdo digital, sem produto físico. Todo o conteúdo fica salvo no seu aparelho.
            Funciona pelo celular, tablet ou computador.
          </p>
          <p className="text-white/40 text-xs mt-2">Fotos ilustrativas. Planejamento digital.</p>
        </div>
      </div>

      {/* Progresso */}
      <div className="px-4 mt-6">
        <h2 className="label-caps text-white/40 mb-3">Seu progresso</h2>
        <div className="glass rounded-card p-4 space-y-3">
          <div className="flex justify-between">
            <span className="text-white/60 text-sm">Jantares feitos</span>
            <span className="text-amarelo font-bold text-sm">{state.jantaresFeitos.length} de 30</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/60 text-sm">Trocas ativas</span>
            <span className="text-white font-bold text-sm">{Object.keys(state.trocas).length}</span>
          </div>
          {state.dataInicio && (
            <div className="flex justify-between">
              <span className="text-white/60 text-sm">Data de início</span>
              <span className="text-white font-bold text-sm">{new Date(state.dataInicio).toLocaleDateString('pt-BR')}</span>
            </div>
          )}
        </div>
      </div>

      {/* Backup */}
      <div className="px-4 mt-6">
        <h2 className="label-caps text-white/40 mb-3">Backup e dados</h2>
        <div className="space-y-3">
          <button
            onClick={exportar}
            className="w-full py-3 rounded-full border border-white/20 text-white text-sm font-medium active:scale-95 transition-transform"
          >
            Exportar progresso
          </button>

          <button
            onClick={() => fileRef.current?.click()}
            className="w-full py-3 rounded-full border border-white/20 text-white text-sm font-medium active:scale-95 transition-transform"
          >
            Importar progresso
          </button>
          <input
            ref={fileRef}
            type="file"
            accept=".json"
            onChange={importar}
            className="hidden"
          />

          {!confirmApagar ? (
            <button
              onClick={() => setConfirmApagar(true)}
              className="w-full py-3 rounded-full border border-white/10 text-white/40 text-sm font-medium active:scale-95 transition-transform"
            >
              Apagar meus dados
            </button>
          ) : (
            <div className="glass rounded-card p-4 text-center">
              <p className="text-white text-sm mb-3">Tem certeza? Isso vai apagar todo o seu progresso.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmApagar(false)}
                  className="flex-1 py-2.5 rounded-full border border-white/20 text-white text-sm font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={apagarDados}
                  className="flex-1 py-2.5 rounded-full bg-amarelo text-preto text-sm font-bold"
                >
                  Apagar tudo
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Feedback toast */}
      {feedback && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[70] glass rounded-full px-5 py-3 max-w-[90%]">
          <p className="text-white text-sm text-center">{feedback}</p>
        </div>
      )}

      {/* Contato */}
      {config.contato && (
        <div className="px-4 mt-6">
          <a
            href={config.contato.includes('@') ? `mailto:${config.contato}` : config.contato}
            className="w-full block py-3 rounded-full border border-amarelo/30 text-amarelo text-sm font-medium text-center active:scale-95 transition-transform"
          >
            Falar com o suporte
          </a>
        </div>
      )}

      {/* Rodapé */}
      <div className="px-4 mt-8 text-center space-y-1">
        <p className="text-white/30 text-[11px]">{config.nomeApp} · v{config.versao}</p>
        <p className="text-white/20 text-[11px]">Jantar Resolvido. Todos os direitos reservados.</p>
      </div>
    </div>
  )
}
