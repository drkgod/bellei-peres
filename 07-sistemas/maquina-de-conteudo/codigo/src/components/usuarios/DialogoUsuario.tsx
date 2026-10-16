import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
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
import { useAuth } from '@/hooks/use-auth'
import { errosDeCampo, mensagemDeErro } from '@/lib/mensagens-erro'
import {
  atualizarUsuario,
  criarUsuario,
  ROTULO_PAPEL,
  type Papel,
  type Usuario,
} from '@/services/usuarios'

const esquema = z.object({
  nome: z.string().min(1, 'Informe o nome.'),
  email: z.string().email('Informe um e-mail válido.'),
  papel: z.enum(['administrador', 'usuario', 'executor'], { message: 'Selecione o papel.' }),
  pode_aprovar: z.boolean(),
  ativo: z.boolean(),
})

type Valores = z.infer<typeof esquema>

const PAPEIS: Papel[] = ['administrador', 'usuario', 'executor']

interface Props {
  alvo: 'novo' | Usuario | null
  aberto: boolean
  onFechar: (salvou: boolean) => void
}

export default function DialogoUsuario({ alvo, aberto, onFechar }: Props) {
  const { usuario: logado } = useAuth()
  const novo = alvo === 'novo' || !alvo
  const [senha, setSenha] = useState('')
  const [erroSenha, setErroSenha] = useState<string | null>(null)
  const form = useForm<Valores>({
    resolver: zodResolver(esquema),
    defaultValues: {
      nome: '',
      email: '',
      papel: 'usuario',
      pode_aprovar: false,
      ativo: true,
    },
  })

  useEffect(() => {
    if (!aberto) return
    setSenha('')
    setErroSenha(null)
    if (novo) {
      form.reset({ nome: '', email: '', papel: 'usuario', pode_aprovar: false, ativo: true })
    } else {
      form.reset({
        nome: alvo.nome ?? '',
        email: alvo.email ?? '',
        papel: alvo.papel,
        pode_aprovar: alvo.pode_aprovar ?? false,
        ativo: alvo.ativo ?? true,
      })
    }
  }, [alvo, aberto, novo, form])

  const papel = form.watch('papel')
  const executor = papel === 'executor'

  const enviar = async (valores: Valores) => {
    if (novo && senha.length < 8) {
      setErroSenha('A senha deve ter pelo menos 8 caracteres.')
      return
    }
    try {
      if (novo) {
        await criarUsuario({ ...valores, senha })
        toast.success('Usuário cadastrado.')
      } else if (alvo) {
        await atualizarUsuario(alvo.id, {
          nome: valores.nome,
          papel: valores.papel,
          pode_aprovar: valores.pode_aprovar,
          ativo: valores.ativo,
        })
        toast.success('Usuário atualizado.')
      }
      onFechar(true)
    } catch (e) {
      const porCampo = errosDeCampo(e)
      for (const [campo, msg] of Object.entries(porCampo)) {
        form.setError(campo as keyof Valores, { message: msg })
      }
      if (Object.keys(porCampo).length === 0) {
        toast.error(mensagemDeErro(e, 'salvar o usuário'))
      }
    }
  }

  return (
    <Dialog open={aberto} onOpenChange={(abrir) => !abrir && onFechar(false)}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{novo ? 'Novo usuário' : `Editar ${alvo?.nome || 'usuário'}`}</DialogTitle>
          <DialogDescription>
            Papel e marcação “pode aprovar” só podem ser definidos por um administrador.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(enviar)} className="space-y-4">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome *</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome completo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail *</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="voce@empresa.com"
                      disabled={!novo}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {novo ? (
              <div className="space-y-2">
                <FormLabel htmlFor="senha-usuario">Senha *</FormLabel>
                <Input
                  id="senha-usuario"
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="Mínimo de 8 caracteres"
                  autoComplete="new-password"
                />
                {erroSenha ? <p className="text-sm text-destructive">{erroSenha}</p> : null}
              </div>
            ) : null}
            <FormField
              control={form.control}
              name="papel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Papel *</FormLabel>
                  <Select
                    onValueChange={(valor) => {
                      field.onChange(valor)
                      if (valor === 'executor') {
                        form.setValue('pode_aprovar', false, { shouldDirty: true })
                      }
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione…" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {PAPEIS.map((p) => (
                        <SelectItem key={p} value={p}>
                          {ROTULO_PAPEL[p]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Executor é um papel técnico usado pelo Maestro; ele não pode aprovar conteúdo.
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="pode_aprovar"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-md border p-3">
                  <div>
                    <FormLabel>Pode aprovar conteúdo</FormLabel>
                    <p className="text-xs text-muted-foreground">
                      {executor
                        ? 'Indisponível para o papel executor.'
                        : 'Quem pode aprovar decide o que vai para o ar.'}
                    </p>
                  </div>
                  <FormControl>
                    <input
                      type="checkbox"
                      role="switch"
                      aria-label="Pode aprovar conteúdo"
                      className="h-5 w-5"
                      disabled={executor}
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ativo"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-md border p-3">
                  <div>
                    <FormLabel>Usuário ativo</FormLabel>
                    <p className="text-xs text-muted-foreground">
                      Usuário inativo não entra no sistema. Não é possível apagar.
                    </p>
                  </div>
                  <FormControl>
                    <input
                      type="checkbox"
                      role="switch"
                      aria-label="Usuário ativo"
                      className="h-5 w-5"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            {!novo && alvo && alvo.id === logado?.id ? (
              <p className="text-xs text-muted-foreground">
                Você está editando a sua própria conta. O sistema impede remover o último
                administrador ativo.
              </p>
            ) : null}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onFechar(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Salvando…' : 'Salvar usuário'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
