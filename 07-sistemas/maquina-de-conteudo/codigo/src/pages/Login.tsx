import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/hooks/use-auth'

export default function Login() {
  const { entrar, cadastrar } = useAuth()
  const navegar = useNavigate()
  const [modo, setModo] = useState<'entrar' | 'criar'>('entrar')
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)

  const enviar = async (evento: FormEvent) => {
    evento.preventDefault()
    setErro(null)
    if (modo === 'entrar' && (!email.trim() || !senha)) {
      setErro('Informe o e-mail e a senha.')
      return
    }
    if (modo === 'criar') {
      if (!nome.trim()) {
        setErro('Informe o seu nome.')
        return
      }
      if (!email.trim() || !senha) {
        setErro('Informe o e-mail e a senha.')
        return
      }
      if (senha.length < 8) {
        setErro('A senha deve ter pelo menos 8 caracteres.')
        return
      }
    }
    setEnviando(true)
    const falha =
      modo === 'entrar' ? await entrar(email.trim(), senha) : await cadastrar(nome.trim(), email.trim(), senha)
    setEnviando(false)
    if (falha) {
      setErro(falha)
      return
    }
    navegar('/configuracao')
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Máquina de Conteúdo</CardTitle>
          <CardDescription>
            {modo === 'entrar'
              ? 'Entre com a sua conta para continuar.'
              : 'Crie a sua conta. A primeira conta criada vira administrador.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={enviar} className="space-y-4">
            {modo === 'criar' ? (
              <div className="space-y-2">
                <Label htmlFor="nome">Nome</Label>
                <Input
                  id="nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Seu nome completo"
                  autoComplete="name"
                />
              </div>
            ) : null}
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="voce@empresa.com"
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="senha">Senha</Label>
              <Input
                id="senha"
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="••••••••"
                autoComplete={modo === 'entrar' ? 'current-password' : 'new-password'}
              />
            </div>
            {erro ? (
              <p role="alert" className="text-sm text-destructive">
                {erro}
              </p>
            ) : null}
            <Button type="submit" className="w-full" disabled={enviando}>
              {enviando ? 'Enviando…' : modo === 'entrar' ? 'Entrar' : 'Criar conta'}
            </Button>
            <Button
              type="button"
              variant="link"
              className="w-full"
              disabled={enviando}
              onClick={() => {
                setErro(null)
                setModo(modo === 'entrar' ? 'criar' : 'entrar')
              }}
            >
              {modo === 'entrar' ? 'Não tem conta? Criar conta' : 'Já tem conta? Entrar'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
