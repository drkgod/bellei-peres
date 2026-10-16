import type { RecordModel } from 'pocketbase'
import pb from '@/lib/pocketbase/client'

export type Canal = 'instagram'
export type Publico = 'empresas' | 'pessoa_fisica' | 'ambos'
export type Area = 'trabalhista' | 'empresarial' | 'civil' | 'previdenciario'

export interface Perfil extends RecordModel {
  nome: string
  canal: Canal
  arroba: string
  publico: Publico
  areas: Area[]
  tom: string
  temas_vedados: string[]
  versao_atual: number
  ativo: boolean
  created: string
  updated: string
}

export interface PerfilEntrada {
  nome: string
  canal: Canal
  arroba: string
  publico: Publico
  areas: Area[]
  tom: string
  temas_vedados: string[]
  ativo: boolean
}

export interface AutorExpandido {
  nome?: string
  email?: string
}

export interface PerfilVersao extends Omit<RecordModel, 'expand'> {
  perfil: string
  versao: number
  nome: string
  canal: Canal
  arroba: string
  publico: Publico
  areas: Area[]
  tom: string
  temas_vedados: string[]
  ativo: boolean
  alterado_por: string
  alterado_em: string
  expand?: { alterado_por?: AutorExpandido }
  created: string
  updated: string
}

export const AREAS: Area[] = ['trabalhista', 'empresarial', 'civil', 'previdenciario']
export const TEMA_OBRIGATORIO = 'direito criminal'
export const TEMAS_VEDADOS_INICIAIS = ['direito criminal', 'criminal', 'penal']

export const ROTULO_CANAL: Record<Canal, string> = { instagram: 'Instagram' }
export const ROTULO_PUBLICO: Record<Publico, string> = {
  empresas: 'Empresas',
  pessoa_fisica: 'Pessoa física',
  ambos: 'Ambos',
}
export const ROTULO_AREAS: Record<Area, string> = {
  trabalhista: 'Trabalhista',
  empresarial: 'Empresarial',
  civil: 'Cível',
  previdenciario: 'Previdenciário',
}

export async function listarPerfis(): Promise<Perfil[]> {
  return pb.collection<Perfil>('perfis_editoriais').getFullList({ sort: 'nome' })
}

export async function listarVersoes(perfilId: string): Promise<PerfilVersao[]> {
  return pb
    .collection<PerfilVersao>('perfis_editoriais_versoes')
    .getFullList({
      filter: pb.filter('perfil = {:perfil}', { perfil: perfilId }),
      sort: '-versao',
      expand: 'alterado_por',
    })
}

export function criarPerfil(dados: PerfilEntrada) {
  return pb.collection<Perfil>('perfis_editoriais').create({ ...dados, versao_atual: 1 })
}

export function atualizarPerfil(id: string, dados: Partial<PerfilEntrada>) {
  return pb.collection<Perfil>('perfis_editoriais').update(id, dados)
}