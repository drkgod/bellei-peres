import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import pb from '@/lib/pocketbase/client'
import { mensagemDeErro } from '@/lib/mensagens-erro'
import type { Usuario } from '@/services/usuarios'

interface AuthContexto {
  usuario: Usuario | null
  autenticado: boolean
  carregando: boolean
  entrar: (email: string, senha: string) => Promise<string | null>
  cadastrar: (nome: string, email: string, senha: string) => Promise<string | null>
  sair: () => void
}

const AuthContexto = createContext<AuthContexto | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(
    pb.authStore.isValid ? (pb.authStore.record as Usuario) : null,
  )
  const [autenticado, setAutenticado] = useState(pb.authStore.isValid)
  const [carregando, setCarregando] = useState(pb.authStore.isValid)

  useEffect(() => {
    const remover = pb.authStore.onChange((_token, registro) => {
      setUsuario(pb.authStore.isValid ? (registro as Usuario) : null)
      setAutenticado(pb.authStore.isValid)
    })
    if (pb.authStore.isValid) {
      pb.collection('users')
        .authRefresh()
        .then((res) => setUsuario(res.record as Usuario))
        .catch(() => pb.authStore.clear())
        .finally(() => setCarregando(false))
    } else {
      setCarregando(false)
    }
    return remover
  }, [])

  const entrar = async (email: string, senha: string): Promise<string | null> => {
    try {
      await pb.collection('users').authWithPassword(email, senha)
      return null
    } catch (erro) {
      return mensagemDeErro(erro, 'entrar no sistema')
    }
  }

  const cadastrar = async (nome: string, email: string, senha: string): Promise<string | null> => {
    try {
      await pb.collection('users').create({
        nome,
        email,
        password: senha,
        passwordConfirm: senha,
        papel: 'usuario',
        pode_aprovar: false,
        ativo: true,
      })
      await pb.collection('users').authWithPassword(email, senha)
      return null
    } catch (erro) {
      return mensagemDeErro(erro, 'criar a conta')
    }
  }

  const sair = () => {
    pb.authStore.clear()
  }

  return (
    <AuthContexto.Provider value={{ usuario, autenticado, carregando, entrar, cadastrar, sair }}>
      {children}
    </AuthContexto.Provider>
  )
}

export function useAuth(): AuthContexto {
  const contexto = useContext(AuthContexto)
  if (!contexto) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider')
  }
  return contexto
}

export function RotaProtegida({ children }: { children: ReactNode }) {
  const { autenticado, carregando } = useAuth()
  if (carregando) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-muted-foreground">Carregando…</p>
      </div>
    )
  }
  if (!autenticado) {
    return <Navigate to="/login" replace />
  }
  return <>{children}</>
}