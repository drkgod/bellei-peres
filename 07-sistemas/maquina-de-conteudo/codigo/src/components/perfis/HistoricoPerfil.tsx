import { useCallback, useEffect, useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { formatarDataHora } from '@/lib/formatos'
import { mensagemDeErro } from '@/lib/mensagens-erro'
import {
  listarVersoes,
  ROTULO_AREAS,
  ROTULO_PUBLICO,
  type Perfil,
  type PerfilVersao,
} from '@/services/perfis'

interface Props {
  alvo: Perfil | null
  aberto: boolean
  onFechar: () => void
}

export default function HistoricoPerfil({ alvo, aberto, onFechar }: Props) {
  const [versoes, setVersoes] = useState<PerfilVersao[]>([])
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  const carregar = useCallback(async () => {
    if (!alvo) return
    setCarregando(true)
    setErro(null)
    try {
      setVersoes(await listarVersoes(alvo.id))
    } catch (e) {
      setErro(mensagemDeErro(e, 'carregar o histórico'))
    } finally {
      setCarregando(false)
    }
  }, [alvo])

  useEffect(() => {
    if (aberto && alvo) void carregar()
  }, [aberto, alvo, carregar])

  return (
    <Dialog open={aberto} onOpenChange={(abrir) => !abrir && onFechar()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Histórico de versões</DialogTitle>
          <DialogDescription>{alvo?.nome ?? ''}</DialogDescription>
        </DialogHeader>
        {carregando ? (
          <div className="space-y-3">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : erro ? (
          <div className="space-y-3">
            <p className="text-sm text-destructive">{erro}</p>
            <Button size="sm" variant="outline" onClick={() => void carregar()}>
              <RefreshCw className="mr-1 h-4 w-4" /> Tentar de novo
            </Button>
          </div>
        ) : versoes.length === 0 ? (
          <p className="py-4 text-sm text-muted-foreground">Nenhuma versão registrada.</p>
        ) : (
          <div className="space-y-3">
            {versoes.map((v) => (
              <div key={v.id} className="rounded-lg border p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">Versão {v.versao}</span>
                  <span className="text-xs text-muted-foreground">{formatarDataHora(v.alterado_em)}</span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  Alterado por {v.expand?.alterado_por?.nome || '—'} · Público{' '}
                  {ROTULO_PUBLICO[v.publico]} · Áreas:{' '}
                  {(v.areas ?? []).map((a) => ROTULO_AREAS[a]).join(', ')}
                </p>
                {v.tom ? <p className="mt-1 text-sm">Tom: {v.tom}</p> : null}
                <p className="mt-1 text-xs text-muted-foreground">
                  Temas vedados: {(v.temas_vedados ?? []).join(', ')}
                </p>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
