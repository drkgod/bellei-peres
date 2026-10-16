import { format, isValid, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

function data(iso: string) {
  const valor = iso ? parseISO(iso) : null
  return valor && isValid(valor) ? valor : null
}

export function formatarDataHora(iso: string) {
  const valor = data(iso)
  return valor ? format(valor, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR }) : '—'
}