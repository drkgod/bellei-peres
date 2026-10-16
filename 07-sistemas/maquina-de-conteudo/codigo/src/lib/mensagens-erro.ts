import { ClientResponseError } from 'pocketbase'

const POR_CODIGO: Record<string, string> = {
  validation_required: 'Preencha este campo.',
  validation_not_unique: 'Este valor já está em uso.',
  validation_is_email: 'Informe um e-mail válido.',
  validation_min_text_constraint: 'Texto curto demais.',
  validation_max_text_constraint: 'Texto longo demais.',
  validation_file_size_limit: 'Arquivo maior que o permitido.',
  validation_missing_rel_records: 'O registro relacionado não existe mais.',
}

/** Erros por campo, já em português, prontos para form.setError. */
export function errosDeCampo(erro: unknown): Record<string, string> {
  if (!(erro instanceof ClientResponseError)) return {}
  const dados = erro.response?.data
  if (!dados || typeof dados !== 'object') return {}
  const saida: Record<string, string> = {}
  for (const [campo, detalhe] of Object.entries(dados)) {
    if (!detalhe || typeof detalhe !== 'object') continue
    const { code, message } = detalhe as { code?: string; message?: string }
    saida[campo] = (code && POR_CODIGO[code]) || message || 'Valor inválido.'
  }
  return saida
}

/** Mensagem geral para toast ou Alert. `acao` completa a frase: "salvar o perfil". */
export function mensagemDeErro(erro: unknown, acao = 'concluir a ação'): string {
  if (erro instanceof ClientResponseError) {
    if (erro.status === 0) {
      return 'Sem resposta do servidor. Confira a conexão e se a ação foi concluída antes de tentar de novo.'
    }
    if (erro.status === 401) return 'Sua sessão expirou. Entre de novo para continuar.'
    if (erro.status === 403) return `Você não tem permissão para ${acao}.`
    if (erro.status === 404) return 'Registro não encontrado. Ele pode ter sido excluído.'
    if (erro.status === 429 || erro.status === 503) {
      return 'O sistema está ocupado. Tente de novo em instantes.'
    }
    if (Object.keys(errosDeCampo(erro)).length > 0) return 'Revise os campos destacados.'
  }
  return `Não foi possível ${acao}. Tente de novo.`
}