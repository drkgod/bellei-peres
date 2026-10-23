# Histórico da construção

## 16/10/2026 — Repositório no GitHub

Publicado como repositório público https://github.com/drkgod/bellei-peres, autorizado pelo consultor.

## 16/10/2026 — Pasta operacional e pacote da fase 1

Criada a pasta operacional com `04_fase-atual/` (36 tarefas e 7 SPECs da fase 1), `05_entregas/`,
`06_notas/` e `07-sistemas/`. Prazos replanejados para 19/10 a 30/10/2026, mantendo a mesma
sequência. IDs do portal preservados. Nenhuma tarefa iniciada e nenhum código criado.
## 16/10/2026 — Entrega: perfil editorial, histórico de versões e usuários (SPEC-1-001)

Construído e colocado no ar no projeto do sistema no Skip (Projeto Bellei, URL de produção
https://projeto-bellei-509fb.goskip.app, versão a0d29d7):

- Telas **Configuração** (perfil editorial do Instagram: público, áreas, tom e temas vedados) e
  **Usuários** (papel e "pode aprovar"), com login e cadastro.
- **Histórico de versões do perfil**: cada alteração efetiva cria versão nova com autor e data; salvar sem mudança não cria versão; "direito criminal" é obrigatório nos temas vedados.
- Regras de acesso: somente administrador cria/edita perfis e marca "pode aprovar"; usuário comum
  só lê. Executor (papel técnico do Maestro) nunca aprova. O sistema impede remover o último
  administrador ativo.
- Task `ae72d282` entregue (análise em `.adapta-cliente/analises/ae72d282.md`); aguardando teste
  humano da SPEC-1-001 e a confirmação do perfil do primeiro ciclo e de quem aprova (call de
  início, 19/10). Nenhuma outra task iniciada.
## 23/10/2026 — Divergência: trabalho no Skip sem registro no fluxo

Ao retomar o projeto, constatado no projeto do Skip (Projeto Bellei):

- Versão publicada em produção avançou de `a0d29d7` (16/10, task ae72d282) para `b4d7bb3`.
- Migrations `1792173001` a `1792173006` aplicadas em 22/10 (rascunhos de posts, fluxo de
  aprovação, histórico de rascunhos, data planejada, seed do calendário, campo nome em users).
- Hooks novos no servidor: `gerar_rascunho_post`, `posts_rascunhos_aprovacao`.
- Telas novas: `CriacaoConteudo`, `Aprovacoes`, `Calendario` (rotas `/calendario` e `/aprovacoes`
  já servidas pela produção).
- Nenhum registro disso no changelog, no estado, no STATUS, na plataforma.md ou no espelho do
  GitHub (último commit do repo: 87d18ca, 16/10).

DÚVIDA (consultor): o trabalho de 22/10 foi feito pelo próprio cliente/equipe (resposta de 23/10).
Ele cobre partes das SPEC-1-002/004/005/006, mas não passou pelo ciclo (análise, verificação, prova,
espelho). Como tratar: validar e registrar como entrega fora do fluxo, ou refazer pelo fluxo?

A task ae72d282 (SPEC-1-001) não foi tocada: telas Configuração e Usuários intactas; teste
humano continua pendente. Prova de baseline em 23/10: produção no ar, login carrega e recusa
conta inexistente com mensagem de erro adequada.
## 23/10/2026 — DECISÃO DO CLIENTE (respostas de 23/10)

- **@ do Instagram do primeiro ciclo**: `@fredericobellei` (perfil pessoal do Frederico entra
  primeiro; sugestão do escritório era o do escritório, mas a decisão é dele).
- **Quem pode aprovar conteúdo**: Frederico e Ruth. Hector e Barbara usam o sistema, mas NÃO
  aprovam. Quem trabalha no Maestro nunca aprova (regra já no ar).
- **Origem do trabalho de 22/10 no Skip**: feito pelo próprio Frederico/equipe (respondeu "fui eu
  ou minha equipe"). A DÚVIDA ao consultor segue, agora com esse contexto: como tratar — validar e
  registrar como entrega fora do fluxo, ou refazer pelo ciclo?
- **Teste humano da SPEC-1-001**: ainda não feito; continua pendente.
- Observações: "ainda não tenho como precisar" (sem detalhes adicionais).
## 23/10/2026 — Conclusões e retomada do ciclo

- 2026-10-23 · [Nana (ETHOS)] · Task ae72d282 concluída: teste humano aprovado pelo cliente
  ("Testei e funcionou", 23/10) — perfil editorial salvo completo, público trocado com versão 2 no
  histórico (autor e data), salvar sem mudança sem versão nova, tema vedado recusado; telas
  Configuração/Usuários intactas na versão publicada b4d7bb3; baseline provada (login no ar;
  conta inexistente recusada com mensagem adequada).
- 2026-10-23 · [Nana (ETHOS)] · Task cabc4cc3 concluída: perfil do primeiro ciclo
  (@fredericobellei) e aprovadores (Frederico e Ruth) confirmados pelo cliente nesta conversa (em
  vez de grupo/call); outros temas vedados: nenhum informado — segue só "direito criminal",
  ampliável depois pelo administrador.
- Retomada do ciclo: task cef32408 (cadastrar usuários e marcar quem pode aprovar) selecionada e
  analisada (`.adapta-cliente/analises/cef32408.md`); parada real: o cadastro das pessoas reais
  exige a conta de administrador do cliente (passos entregues na conversa de 23/10).
