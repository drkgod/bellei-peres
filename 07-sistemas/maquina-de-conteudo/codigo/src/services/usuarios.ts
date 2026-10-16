import type { RecordModel } from 'pocketbase'
import pb from '@/lib/pocketbase/client'

export type Papel = 'administrador' | 'usuario' | 'executor'

export interface Usuario extends RecordModel {
  nome: string
  email: string
  papel: Papel
  pode_aprovar: boolean
  ativo: boolean
  created: string
  updated: string
}

export interface NovoUsuario {
  nome: string
  email: string
  senha: string
  papel: Papel
  pode_aprovar: boolean
  ativo: boolean
}

export const ROTULO_PAPEL: Record<Papel, string> = {
  administrador: 'Administrador',
  usuario: 'Usuário',
  executor: 'Executor',
}

export async function listarUsuarios(): Promise<Usuario[]> {
  return pb.collection<Usuario>('users').getFullList({ sort: 'nome' })
}

export function criarUsuario(dados: NovoUsuario) {
  return pb.collection<Usuario>('users').create({
    nome: dados.nome,
    email: dados.email,
    password: dados.senha,
    passwordConfirm: dados.senha,
    papel: dados.papel,
    pode_aprovar: dados.pode_aprovar,
    ativo: dados.ativo,
  })
}

export function atualizarUsuario(
  id: string,
  dados: Partial<Pick<Usuario, 'nome' | 'papel' | 'pode_aprovar' | 'ativo'>>,
) {
  return pb.collection<Usuario>('users').update(id, dados)
}