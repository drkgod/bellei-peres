import { useCallback, useEffect, useState } from 'react'
import { History, Pencil, Plus, RefreshCw } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useAuth } from '@/hooks/use-auth'
import { mensagemDeErro } from '@/lib/mensagens-erro'
import {
  listarPerfis,
  ROTULO_AREAS,
  ROTULO_CANAL,
  ROTULO_PUBLICO,
  type Perfil,
} from '@/services/perfis'
import FormularioPerfil from '@/components/perfis/FormularioPerfil'
import HistoricoPerfil from '@/components/perfis/HistoricoPerfil'

export default function Configuracao() {
  const { usuario } = useAuth()
  const admin = usuario?.papel === 'administrador'
  const [perfis, setPerfis] = useState<Perfil[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [formulario, setFormulario] = useState<'novo' | Perfil | null>(null)
  const [historico, setHistorico] = useState<Perfil | null>(null)

  const carregar = useCallback(async () => {
    setCarregando(true)
    setErro(null)
    try {
      setPerfis(await listarPerfis())
    } catch (e) {
      setErro(mensagemDeErro(e, 'carregar os perfis'))
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
          <h1 className="text-2xl font-bold">Configuração</h1>
          <p className="text-sm text-muted-foreground">
            Perfis editoriais usados na geração de conteúdo. {perfis.length} perfil(is).
          </p>
        </div>
        {admin ? (
          <Button onClick={() => setFormulario('novo')}>
            <Plus className="mr-2 h-4 w-4" /> Novo perfil
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
      ) : perfis.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
            <p className="text-sm text-muted-foreground">Nenhum perfil editorial cadastrado.</p>
            {admin ? (
              <Button variant="outline" onClick={() => setFormulario('novo')}>
                <Plus className="mr-2 h-4 w-4" /> Cadastrar o primeiro perfil
              </Button>
            ) : null}
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Perfil</TableHead>
                  <TableHead>Público</TableHead>
                  <TableHead>Áreas</TableHead>
                  <TableHead>Versão</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {perfis.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>
                      <div className="font-medium">{p.nome}</div>
                      <div className="text-sm text-muted-foreground">
                        {ROTULO_CANAL[p.canal]} · @{p.arroba}
                      </div>
                    </TableCell>
                    <TableCell>{ROTULO_PUBLICO[p.publico]}</TableCell>
                    <TableCell>{(p.areas ?? []).map((a) => ROTULO_AREAS[a]).join(', ')}</TableCell>
                    <TableCell>v{p.versao_atual}</TableCell>
                    <TableCell>
                      <Badge variant={p.ativo ? 'default' : 'secondary'}>
                        {p.ativo ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </TableCell>
                    <TableCell className="space-x-2 text-right">
                      <Button size="sm" variant="outline" onClick={() => setHistorico(p)}>
                        <History className="mr-1 h-4 w-4" /> Histórico
                      </Button>
                      {admin ? (
                        <Button size="sm" variant="ghost" onClick={() => setFormulario(p)}>
                          <Pencil className="mr-1 h-4 w-4" /> Editar
                        </Button>
                      ) : null}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="space-y-3 md:hidden">
            {perfis.map((p) => (
              <Card key={p.id}>
                <CardContent className="space-y-2 py-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{p.nome}</span>
                    <Badge variant={p.ativo ? 'default' : 'secondary'}>
                      {p.ativo ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {ROTULO_CANAL[p.canal]} · @{p.arroba} · v{p.versao_atual}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {ROTULO_PUBLICO[p.publico]} · {(p.areas ?? []).map((a) => ROTULO_AREAS[a]).join(', ')}
                  </p>
                  <div className="flex gap-2 pt-1">
                    <Button size="sm" variant="outline" onClick={() => setHistorico(p)}>
                      <History className="mr-1 h-4 w-4" /> Histórico
                    </Button>
                    {admin ? (
                      <Button size="sm" variant="ghost" onClick={() => setFormulario(p)}>
                        <Pencil className="mr-1 h-4 w-4" /> Editar
                      </Button>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      <FormularioPerfil
        alvo={formulario}
        aberto={formulario !== null}
        onFechar={(salvou) => {
          setFormulario(null)
          if (salvou) void carregar()
        }}
      />
      <HistoricoPerfil
        alvo={historico}
        aberto={historico !== null}
        onFechar={() => setHistorico(null)}
      />
    </div>
  )
}
