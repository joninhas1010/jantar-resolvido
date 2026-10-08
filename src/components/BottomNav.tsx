import { useLocation, useNavigate } from 'react-router-dom'
import { IconHome, IconCalendar, IconCart, IconGrid } from './Icons'

const tabs = [
  { path: '/hoje', label: 'Hoje', Icon: IconHome },
  { path: '/calendario', label: 'Calendário', Icon: IconCalendar },
  { path: '/compras', label: 'Compras', Icon: IconCart },
  { path: '/extras', label: 'Extras', Icon: IconGrid },
]

export default function BottomNav() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <nav
      className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-32px)] max-w-[448px] glass rounded-full px-2 py-2 z-50 safe-bottom"
      role="tablist"
      aria-label="Navegação principal"
    >
      <div className="flex justify-around items-center">
        {tabs.map(({ path, label, Icon }) => {
          const active = location.pathname === path || (path === '/hoje' && location.pathname === '/')
          return (
            <button
              key={path}
              role="tab"
              aria-selected={active}
              aria-label={label}
              onClick={() => navigate(path)}
              className="flex flex-col items-center gap-1 py-1 px-4 min-w-[56px] min-h-[44px] transition-colors duration-200"
            >
              <Icon size={22} color={active ? '#FDE047' : 'rgba(255,255,255,0.5)'} />
              <span className={`text-[11px] font-medium ${active ? 'text-amarelo' : 'text-white/50'}`}>
                {label}
              </span>
              {active && (
                <span className="w-1 h-1 rounded-full bg-amarelo -mt-0.5" />
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
