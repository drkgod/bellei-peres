import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'

const classeBase = 'rounded-md px-3 py-2 text-sm font-medium transition-colors'
const classeAtivo = 'bg-primary text-primary-foreground'
const classeInativo = 'text-muted-foreground hover:bg-muted hover:text-foreground'

export default function Layout() {
  const { usuario, sair } = useAuth()
  const navegar = useNavigate()

  const aoSair = () => {
    sair()
    navegar('/login')
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container mx-auto flex flex-wrap items-center gap-2 px-4 py-3">
          <span className="mr-4 text-sm font-semibold">Máquina de Conteúdo</span>
          <nav className="flex items-center gap-1" aria-label="Menu principal">
            <NavLink
              to="/configuracao"
              className={({ isActive }) =>
                `${classeBase} ${isActive ? classeAtivo : classeInativo}`
              }
            >
              Configuração
            </NavLink>
            <NavLink
              to="/usuarios"
              className={({ isActive }) =>
                `${classeBase} ${isActive ? classeAtivo : classeInativo}`
              }
            >
              Usuários
            </NavLink>
          </nav>
          <div className="ml-auto flex items-center gap-2">
            {usuario?.nome ? (
              <span className="text-sm text-muted-foreground">{usuario.nome}</span>
            ) : null}
            <Button variant="ghost" size="sm" onClick={aoSair} aria-label="Sair do sistema">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
