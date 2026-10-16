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
- **Histórico de versões do perfil**: cada alteração efetiva cria versão nova com autor e data;
  salvar sem mudança não cria versão; "direito criminal" é obrigatório nos temas vedados.
- Regras de acesso: somente administrador cria/edita perfis e marca "pode aprovar"; usuário comum
  só lê. Executor (papel técnico do Maestro) nunca aprova. O sistema impede remover o último
  administrador ativo.
- Task `ae72d282` entregue (análise em `.adapta-cliente/analises/ae72d282.md`); aguardando teste
  humano da SPEC-1-001 e a confirmação do perfil do primeiro ciclo e de quem aprova (call de
  início, 19/10). Nenhuma outra task iniciada.