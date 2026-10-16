import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { X } from 'lucide-react'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { errosDeCampo, mensagemDeErro } from '@/lib/mensagens-erro'
import {
  atualizarPerfil,
  criarPerfil,
  AREAS,
  ROTULO_AREAS,
  ROTULO_CANAL,
  ROTULO_PUBLICO,
  TEMA_OBRIGATORIO,
  TEMAS_VEDADOS_INICIAIS,
  type Perfil,
  type PerfilEntrada,
} from '@/services/perfis'

const esquema = z.object({
  nome: z.string().min(1, 'Informe o nome do perfil.'),
  canal: z.enum(['instagram'], { message: 'Selecione o canal.' }),
  arroba: z.string().min(1, 'Informe o @ do perfil.'),
  publico: z.enum(['empresas', 'pessoa_fisica', 'ambos'], { message: 'Selecione o público.' }),
  areas: z
    .array(z.enum(['trabalhista', 'empresarial', 'civil', 'previdenciario']))
    .min(1, 'Selecione ao menos uma área.'),
  tom: z.string().max(500, 'O tom deve ter no máximo 500 caracteres.'),
  temas_vedados: z
    .array(z.string())
    .refine((t) => t.includes(TEMA_OBRIGATORIO), {
      message: `O perfil deve manter "${TEMA_OBRIGATORIO}" nos temas vedados.`,
    }),
  ativo: z.boolean(),
})

type Valores = z.infer<typeof esquema>

const valoresIniciais: Valores = {
  nome: '',
  canal: 'instagram',
  arroba: '',
  publico: 'empresas',
  areas: [],
  tom: '',
  temas_vedados: TEMAS_VEDADOS_INICIAIS,
  ativo: true,
}

interface Props {
  alvo: 'novo' | Perfil | null
  aberto: boolean
  onFechar: (salvou: boolean) => void
}

export default function FormularioPerfil({ alvo, aberto, onFechar }: Props) {
  const [novoTema, setNovoTema] = useState('')
  const [confirmarDescarte, setConfirmarDescarte] = useState(false)
  const form = useForm<Valores>({
    resolver: zodResolver(esquema),
    defaultValues: valoresIniciais,
  })

  useEffect(() => {
    if (!aberto) return
    setNovoTema('')
    setConfirmarDescarte(false)
    if (alvo === 'novo' || !alvo) {
      form.reset(valoresIniciais)
    } else {
      form.reset({
        nome: alvo.nome,
        canal: alvo.canal,
        arroba: alvo.arroba,
        publico: alvo.publico,
        areas: alvo.areas ?? [],
        tom: alvo.tom ?? '',
        temas_vedados: alvo.temas_vedados ?? [],
        ativo: alvo.ativo ?? true,
      })
    }
  }, [alvo, aberto, form])

  const temas = form.watch('temas_vedados')

  const adicionarTema = () => {
    const termo = novoTema.trim()
    if (!termo) return
    if (temas.some((t) => t.toLowerCase() === termo.toLowerCase())) {
      setNovoTema('')
      return
    }
    form.setValue('temas_vedados', [...temas, termo], { shouldDirty: true })
    setNovoTema('')
  }

  const removerTema = (termo: string) => {
    if (termo === TEMA_OBRIGATORIO) return
    form.setValue(
      'temas_vedados',
      temas.filter((t) => t !== termo),
      { shouldDirty: true },
    )
  }

  const enviar = async (valores: Valores) => {
    try {
      if (alvo === 'novo' || !alvo) {
        await criarPerfil(valores as PerfilEntrada)
        toast.success('Perfil cadastrado.')
      } else {
        await atualizarPerfil(alvo.id, valores)
        toast.success('Perfil atualizado. Uma nova versão foi registrada.')
      }
      onFechar(true)
    } catch (e) {
      const porCampo = errosDeCampo(e)
      for (const [campo, msg] of Object.entries(porCampo)) {
        form.setError(campo as keyof Valores, { message: msg })
      }
      if (Object.keys(porCampo).length === 0) {
        toast.error(mensagemDeErro(e, 'salvar o perfil'))
      }
    }
  }

  const tentarFechar = (abrir: boolean) => {
    if (abrir) return
    if (form.formState.isDirty) {
      setConfirmarDescarte(true)
      return
    }
    onFechar(false)
  }

  return (
    <>
      <Dialog open={aberto} onOpenChange={tentarFechar}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {alvo === 'novo' || !alvo ? 'Novo perfil editorial' : `Editar ${alvo.nome}`}
            </DialogTitle>
            <DialogDescription>
              Cada alteração efetiva cria uma nova versão no histórico do perfil.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(enviar)} className="space-y-4">
              <FormField
                control={form.control}
                name="nome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do perfil *</FormLabel>
                    <FormControl>
                      <Input placeholder="Instagram do escritório" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="canal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Canal *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione…" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="instagram">Instagram</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="publico"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Público *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione…" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(ROTULO_PUBLICO).map(([valor, rotulo]) => (
                            <SelectItem key={valor} value={valor}>
                              {rotulo}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="arroba"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>@ do perfil *</FormLabel>
                    <FormControl>
                      <Input placeholder="escritorio" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="areas"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Áreas *</FormLabel>
                    <div className="grid grid-cols-2 gap-2">
                      {AREAS.map((area) => (
                        <label
                          key={area}
                          className="flex items-center gap-2 rounded-md border p-2 text-sm"
                        >
                          <Checkbox
                            checked={field.value.includes(area)}
                            onCheckedChange={(marcado) =>
                              field.onChange(
                                marcado
                                  ? [...field.value, area]
                                  : field.value.filter((a) => a !== area),
                              )
                            }
                          />
                          {ROTULO_AREAS[area]}
                        </label>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tom (como o escritório fala)</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={3}
                        placeholder="Ex.: direto, acessível, sem juridiquês…"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormItem>
                <FormLabel>Temas vedados *</FormLabel>
                <div className="flex flex-wrap gap-2">
                  {temas.map((termo) => (
                    <Badge key={termo} variant="secondary">
                      {termo}
                      {termo === TEMA_OBRIGATORIO ? null : (
                        <button
                          type="button"
                          aria-label={`Remover ${termo}`}
                          className="ml-1 rounded-full hover:text-destructive"
                          onClick={() => removerTema(termo)}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={novoTema}
                    onChange={(e) => setNovoTema(e.target.value)}
                    placeholder="Novo tema vedado"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        adicionarTema()
                      }
                    }}
                  />
                  <Button type="button" variant="outline" onClick={adicionarTema}>
                    Adicionar
                  </Button>
                </div>
                <FormMessage>{form.formState.errors.temas_vedados?.message}</FormMessage>
              </FormItem>
              <FormField
                control={form.control}
                name="ativo"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-md border p-3">
                    <div>
                      <FormLabel>Perfil ativo</FormLabel>
                      <p className="text-xs text-muted-foreground">
                        Perfis inativos não entram nas próximas gerações.
                      </p>
                    </div>
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={(v) => field.onChange(v === true)} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => tentarFechar(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? 'Salvando…' : 'Salvar perfil'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      <AlertDialog open={confirmarDescarte} onOpenChange={setConfirmarDescarte}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Descartar as alterações?</AlertDialogTitle>
            <AlertDialogDescription>
              As informações digitadas neste formulário serão perdidas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continuar editando</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                form.reset()
                onFechar(false)
              }}
            >
              Descartar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
