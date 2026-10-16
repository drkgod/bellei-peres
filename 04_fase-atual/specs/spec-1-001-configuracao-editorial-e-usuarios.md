# SPEC-1-001 — Configuração editorial e usuários

**Fase:** 1  
**Status:** planejada  
**Dono:** Bellei e Peres (execução com o Maestro) · aceite: Rodrigo Santos (consultor)  
**Origem no escopo:** RQ-001, RQ-006, RQ-007 (parcial), AC-001/P1, AC-006, CE-06; CL-001, CL-002, CL-003, CL-007, CL-PEND-004, CL-PEND-005, CL-PEND-006  
**Degrau da solução:** nativo da plataforma — aplicativo no Skip com backend Skip Cloud (autenticação, coleções e regras de acesso), sem ferramenta nova.

## Contexto e decisões fechadas

- **Estado atual:** não existe sistema. O escritório tem convites do Skip enviados para Bárbara, Ruth e Héctor (administradores) e o Frederico entra com o e-mail de administrador ainda grafado errado, cuja correção está com a equipe Adapta (Acompanhamento 29/09, [00:12:23]–[00:17:36]).
- **Estado desejado:** existe o projeto do sistema no Skip, com o(s) perfil(is) editorial(is) do primeiro ciclo configurado(s) e versionado(s) e os usuários cadastrados com papel e marcação “pode aprovar”.
- **Decisões já fechadas:**
  - O sistema é um aplicativo no Skip; o Skip Cloud guarda os dados e faz a autenticação (P5).
  - Público inicial: empresas; deve poder mudar para pessoa física ou ambos sem refazer o sistema (1ª Consultoria [00:00:23]).
  - Áreas: trabalhista, empresarial, cível e previdenciário, com foco em trabalhista e empresarial ([00:16:56]). Tema vedado obrigatório: direito criminal ([00:16:41]).
  - Papéis na fase 1: `administrador` e `usuário`; marcação independente `pode aprovar` (sim/não), definida só pelo administrador (AC-001, CE-06). Não há exigência técnica de ser advogado.
  - Nesta fase todos os usuários veem todos os itens; restrição por perfil fica para uma próxima etapa.
  - Um papel técnico `executor` existe só para o Maestro (ver SPEC-1-003); ele não aparece na lista de pessoas e não pode aprovar nem publicar.
- **Bloqueios:** nenhum para construir. Para concluir, o escritório confirma na call de início o perfil do primeiro ciclo (CL-PEND-004) e quem pode aprovar (CL-PEND-005).

## Resultado observável

O administrador abre a tela **Configuração**, vê o perfil do Instagram do primeiro ciclo com público,
áreas, tom e temas vedados, troca o público e vê a nova versão registrada com autor e data; na tela
**Usuários**, vê Frederico, Ruth, Héctor e Bárbara com papel e quem pode aprovar.

## Limites e dependências

- **Inclui:** criação do projeto no Skip; coleções `perfis_editoriais`, `perfis_editoriais_versoes` e campos extras na coleção de usuários; telas Configuração e Usuários; regras de acesso.
- **Fora de escopo:** permissões por perfil, matriz de papéis, cadência automática, TikTok, integrações de rede social.
- **Entradas e pré-condições:** CL-001 (cada pessoa entra no Skip com o próprio e-mail); CL-002 (conta GitHub); CL-003 (projeto criado no Skip); CL-007 (escopo lido até a call de início); CL-PEND-004 e CL-PEND-005 confirmados na call de início; CL-PEND-006, se o escritório tiver outros temas vedados.
- **Saídas/artefatos:** projeto do sistema no Skip; perfil configurado (versão 1); usuários cadastrados.
- **Dependências e responsáveis:** Bellei e Peres cria o projeto e cadastra; o consultor conduz a call de início; a equipe Adapta corrige o e-mail de administrador do Frederico.
- **Atores e permissões mínimas:** administrador cria e altera perfis, versões, usuários e marcações; usuário só lê a configuração; executor só lê a configuração por meio das execuções (SPEC-1-003).
- **Superfícies/arquivos/configurações afetadas:** projeto Skip (telas Configuração e Usuários), coleções do Skip Cloud, regras de acesso das coleções.
- **Risco e plano B:** e-mail do Frederico ainda errado — ele segue entrando com o e-mail atual e o sistema já nasce com um segundo administrador, escolhido na call de início, para não depender de um único login.
- **Rollback ou reversão:** versões anteriores do perfil ficam guardadas; “voltar” é criar nova versão com os valores anteriores. Usuário desativado (`ativo = não`) em vez de apagado.

## Dados e integrações

| Origem/destino | Fonte de verdade | Campos/contrato | Autenticação/permissão | Timeout/retry/idempotência | Tratamento de erro |
|---|---|---|---|---|---|
| `perfis_editoriais` (Skip Cloud) | este registro | `nome` (ex.: “Instagram do escritório”), `canal` (`instagram`), `arroba`, `publico` (`empresas` \| `pessoa_fisica` \| `ambos`), `areas` (lista: trabalhista, empresarial, cível, previdenciário), `tom` (texto até 500 caracteres), `temas_vedados` (lista de termos; nasce com “direito criminal”, “criminal” e “penal”, ajustável pelo administrador, e nunca fica sem “direito criminal”), `versao_atual` (número), `ativo` | escrita: administrador; leitura: usuários autenticados | salvar com a mesma informação não cria versão nova | campo obrigatório ausente → não salva e mostra qual falta |
| `perfis_editoriais_versoes` | histórico imutável | `perfil`, `versao`, cópia de todos os campos acima, `alterado_por`, `alterado_em` | criação só pelo backend ao salvar o perfil; ninguém edita ou apaga | uma versão por alteração efetiva | falha ao gravar a versão desfaz a alteração do perfil |
| `users` (autenticação do Skip Cloud) | este registro | `nome`, `email`, `papel` (`administrador` \| `usuario` \| `executor`), `pode_aprovar` (sim/não), `ativo` | escrita de `papel` e `pode_aprovar`: só administrador; `executor` nunca tem `pode_aprovar` | — | tentativa de não administrador alterar papel → recusada (erro 403) |

| Regra de negócio | Condição | Ação/resultado | Exceção | Fonte |
|---|---|---|---|---|
| RN-01 | Salvar perfil | Exige nome, canal, arroba, público, ao menos uma área e “direito criminal” nos vedados | — | 1ª Consultoria [00:16:41] |
| RN-02 | Alterar qualquer campo do perfil | Cria versão n+1 com autor e data; itens já criados guardam a versão que usaram | Salvar sem mudança não cria versão | RQ-001 |
| RN-03 | Marcar “pode aprovar” | Só administrador; usuário `executor` nunca pode | — | AC-001 |
| RN-04 | Tirar o último administrador ativo | Recusado | — | segurança operacional |

## Fluxo e regras

1. Bellei e Peres cria o projeto “Máquina de Conteúdo” no Skip e liga o backend Skip Cloud.
2. Cria as coleções e regras de acesso da tabela acima.
3. Monta a tela Configuração (lista de perfis, edição, histórico de versões) e a tela Usuários (lista, papel, “pode aprovar”, ativo).
4. Cadastra o perfil do primeiro ciclo confirmado em CL-PEND-004 e os usuários de CL-PEND-005.
5. Troca o público de teste, confere a versão 2 no histórico e volta ao público escolhido (versão 3).

| Cenário | Dado/condição | Resultado esperado | Caminho de erro/recuperação |
|---|---|---|---|
| Principal | Administrador salva o perfil completo | Perfil na versão 1, visível a todos os usuários | — |
| Limite | Administrador salva sem mudar nada | Nenhuma versão nova | — |
| Falha | Usuário comum tenta marcar “pode aprovar” ou mudar público | Recusado na tela e no backend (403) | Pedir a um administrador |
| Falha | Perfil sem área ou sem “direito criminal” nos vedados | Não salva; mostra o campo | Completar e salvar |

## Instruções de execução para o Ethos (Maestro)

1. **Ler antes de alterar:** esta SPEC e o projeto do sistema no Skip (e sua cópia em `07-sistemas/`, quando sincronizada).
2. **Alterar somente:** coleções `perfis_editoriais`, `perfis_editoriais_versoes`, campos extras de `users`, telas Configuração e Usuários.
3. **Não alterar:** nada de pautas, geração, revisão ou publicação; não criar integração com rede social.
4. **Executar nesta ordem:** projeto → coleções e regras → tela Configuração → tela Usuários → cadastro real → testes do TDD.
5. **Parar e pedir validação quando:** o perfil do primeiro ciclo ou a lista de quem aprova não estiverem confirmados; o Skip pedir plano pago ou permissão que ninguém do escritório tenha.
6. **Estado válido ao parar:** o sistema abre, o login funciona e o que já foi cadastrado continua salvo.

## Checklist de execução

- [ ] CL-001, CL-002 e CL-003 conferidos (todos entram no Skip; conta GitHub e projeto existem).
- [ ] Coleções e regras de acesso criadas conforme a tabela.
- [ ] Perfil do primeiro ciclo salvo com “direito criminal” vedado.
- [ ] Usuários cadastrados com papel e “pode aprovar”.
- [ ] Cenários principal, limite e falha exercitados.
- [ ] Capturas anexadas em `05_entregas/fase-1/SPEC-1-001/`.

## Critérios de aceite

- [ ] **CA-1-01:** o administrador salva o perfil do primeiro ciclo com canal, arroba, público, áreas, tom e temas vedados (com “direito criminal”); perfil incompleto não é salvo.
- [ ] **CA-1-02:** cada alteração efetiva do perfil cria uma versão nova com autor e data, consultável no histórico; salvar sem mudança não cria versão.
- [ ] **CA-1-03:** os usuários aparecem com papel e “pode aprovar”; só o administrador altera essas marcações (o backend recusa os demais com 403) e o usuário `executor` nunca pode aprovar.

## TDD da SPEC

| Etapa | Prova | Comando/ação | Resultado esperado | Evidência |
|---|---|---|---|---|
| RED | Antes de criar as regras, um usuário comum consegue alterar `pode_aprovar` ou o perfil | Logar como Usuário B e tentar alterar pela tela ou pelo SDK (`pb.collection('users').update(<id>, { pode_aprovar: true })`) | A alteração passa — mostra que falta a regra (CA-1-03) | captura em `05_entregas/fase-1/SPEC-1-001/red.png` |
| GREEN | Regras e versões funcionando | (1) Administrador salva o perfil completo; (2) troca o público de `empresas` para `ambos`; (3) Usuário B repete a tentativa do RED | (1) versão 1; (2) versão 2 com autor e data; (3) recusado com 403 | capturas `green-1..3.png` e lista do histórico |
| REFACTOR/REGRESSÃO | Bordas e reversão | Salvar sem mudança; salvar sem área; tirar “direito criminal”; tentar desativar o último administrador; voltar o público para `empresas` | Nenhuma versão nova; três recusas com o campo indicado; versão 3 com o público original | captura `regressao.png` |

**Dados/fixtures:** perfil “Instagram do escritório (teste)” marcado como teste; Usuário A (administrador, pode aprovar), Usuário B (usuário, não aprova), Usuário C (usuário, pode aprovar). Depois dos testes, o perfil de teste é desativado e os usuários de teste desativados.  
**Caminhos de erro obrigatórios:** campo obrigatório ausente, permissão negada, último administrador.  
**Evidência exigida:** capturas acima e o histórico de versões do perfil real.

## Handoff e operação

- **Como demonstrar:** na call de início/fechamento, abrir Configuração, trocar o público e mostrar o histórico; abrir Usuários e mostrar quem aprova.
- **Como operar depois:** o administrador mantém perfis e usuários; mudança de público vale só para as próximas gerações.
- **Como monitorar:** histórico de versões do perfil.
- **Pendência conhecida:** correção do e-mail de administrador do Frederico (equipe Adapta).

## Tasks vinculadas

| ID | Task (fase 1 · título exato) | SPEC | Critério | Recorte da prova | Evidência esperada | Pré-condições |
|---|---|---|---|---|---|---|
| id pendente | Preparar o sistema e cadastrar o perfil e os usuários | SPEC-1-001 | CA-1-01 a CA-1-03 | TDD completo | capturas RED/GREEN/REGRESSÃO | subtarefas abaixo |
| id pendente | Fazer a call de início da Fase 1 | SPEC-1-001 | pré-condições (CL-007, CL-PEND-004, CL-PEND-005) | — | registro da call com perfil e aprovadores confirmados | escopo lido (CL-007) |
| id pendente | Entrar no Skip com o próprio e-mail | SPEC-1-001 | pré-condição CL-001 | — | cada pessoa logada no Skip | convites de 29/09 |
| id pendente | Criar a conta no GitHub e o projeto do sistema no Skip | SPEC-1-001 | pré-condições CL-002 e CL-003 | — | nome da conta e link do projeto no grupo | CL-001 |
| id pendente | Confirmar o perfil do Instagram e quem pode aprovar | SPEC-1-001 | pré-condições CL-PEND-004 e CL-PEND-005 | — | lista confirmada no grupo ou na call | call de início |
| id pendente | Cadastrar o perfil editorial com público, áreas e temas vedados | SPEC-1-001 | CA-1-01, CA-1-02 | GREEN 1–2 e REGRESSÃO (bordas do perfil) | perfil real na versão 1 e histórico | projeto criado |
| id pendente | Cadastrar os usuários e marcar quem pode aprovar | SPEC-1-001 | CA-1-03 | RED e GREEN 3 | tela Usuários e recusa 403 | lista confirmada |

## Emendas

| Data | Origem do sinal | Micro-spec/task | Motivo |
|---|---|---|---|
| | | | |
