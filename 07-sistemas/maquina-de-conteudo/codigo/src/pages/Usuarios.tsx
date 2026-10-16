import { useCallback, useEffect, useState } from 'react'
import { Pencil, Plus, RefreshCw } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useAuth } from '@/hooks/use-auth'
import { mensagemDeErro } from '@/lib/mensagens-erro'
import { listarUsuarios, ROTULO_PAPEL, type Usuario } from '@/services/usuarios'
import DialogoUsuario from '@/components/usuarios/DialogoUsuario'

export default function Usuarios() {
  const { usuario } = useAuth()
  const admin = usuario?.papel === 'administrador'
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [dialogo, setDialogo] = useState<'novo' | Usuario | null>(null)

  const carregar = useCallback(async () => {
    setCarregando(true)
    setErro(null)
    try {
      setUsuarios(await listarUsuarios())
    } catch (e) {
      setErro(mensagemDeErro(e, 'carregar os usuários'))
    } finally {
      setCarregando(false)
    }
  }, [])

  useEffect(() => {
    void carregar()
  }, [carregar])

  return (
    <div className="container mx-auto space-y-6 py-8 px-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Usuários</h1>
          <p className="text-sm text-muted-foreground">
            {usuarios.length} pessoa(s) com acesso ao sistema. Somente administradores podem alterar.
          </p>
        </div>
        {admin ? (
          <Button onClick={() => setDialogo('novo')}>
            <Plus className="mr-2 h-4 w-4" /> Novo usuário
          </Button>
        ) : null}
      </div>

      {carregando ? (
        <div className="space-y-3">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      ) : erro ? (
        <Alert variant="destructive">
          <RefreshCw className="h-4 w-4" />
          <AlertTitle>Não foi possível carregar</AlertTitle>
          <AlertDescription className="flex items-center gap-3">
            {erro}
            <Button size="sm" variant="outline" onClick={() => void carregar()}>
              Tentar de novo
            </Button>
          </AlertDescription>
        </Alert>
      ) : usuarios.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-sm text-muted-foreground">Nenhum usuário cadastrado.</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>E-mail</TableHead>
                  <TableHead>Papel</TableHead>
                  <TableHead>Pode aprovar</TableHead>
                  <TableHead>Status</TableHead>
                  {admin ? <TableHead className="text-right">Ações</TableHead> : null}
                </TableRow>
              </TableHeader>
              <TableBody>
                {usuarios.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">{u.nome || '—'}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>
                      <Badge variant={u.papel === 'administrador' ? 'default' : 'secondary'}>
                        {ROTULO_PAPEL[u.papel] ?? u.papel}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={u.pode_aprovar ? 'default' : 'secondary'}>
                        {u.pode_aprovar ? 'Sim' : 'Não'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={u.ativo ? 'default' : 'secondary'}>
                        {u.ativo ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </TableCell>
                    {admin ? (
                      <TableCell className="text-right">
                        <Button size="sm" variant="ghost" onClick={() => setDialogo(u)}>
                          <Pencil className="mr-1 h-4 w-4" /> Editar
                        </Button>
                      </TableCell>
                    ) : null}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="space-y-3 md:hidden">
            {usuarios.map((u) => (
              <Card key={u.id}>
                <CardContent className="space-y-2 py-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{u.nome || u.email}</span>
                    <Badge variant={u.ativo ? 'default' : 'secondary'}>
                      {u.ativo ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{u.email}</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant={u.papel === 'administrador' ? 'default' : 'secondary'}>
                      {ROTULO_PAPEL[u.papel] ?? u.papel}
                    </Badge>
                    <Badge variant={u.pode_aprovar ? 'default' : 'secondary'}>
                      {u.pode_aprovar ? 'Aprova' : 'Não aprova'}
                    </Badge>
                  </div>
                  {admin ? (
                    <Button size="sm" variant="ghost" onClick={() => setDialogo(u)}>
                      <Pencil className="mr-1 h-4 w-4" /> Editar
                    </Button>
                  ) : null}
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      <DialogoUsuario
        alvo={dialogo}
        aberto={dialogo !== null}
        onFechar={(salvou) => {
          setDialogo(null)
          if (salvou) void carregar()
        }}
      />
    </div>
  )
}
