# SPEC-1-005 — Revisão e aprovação

**Fase:** 1  
**Status:** planejada  
**Dono:** Bellei e Peres (execução com o Maestro) · aceite: Rodrigo Santos (consultor)  
**Origem no escopo:** RQ-006, AC-001/P1, CE-07, CE-09  
**Degrau da solução:** nativo da plataforma — telas, regras de acesso e validação no backend do mesmo aplicativo Skip; aviso dentro do próprio sistema, sem e-mail nem WhatsApp.

## Contexto e decisões fechadas

- **Estado atual:** não existe revisão registrada; o escritório disse que consegue avaliar rápido se uma peça pode subir (1ª Consultoria [00:12:17]) e a revisão humana é obrigatória no começo ([00:37:34]).
- **Estado desejado:** toda peça gerada entra na lista **Aguardando revisão**, visível a quem pode aprovar; a pessoa aprova, devolve com comentário (gera nova versão) ou arquiva; nada chega a “pronto para publicar” sem aprovação registrada.
- **Decisões já fechadas:**
  - Qualquer usuário marcado “pode aprovar” decide; não há aprovador único nem prazo nominal (AC-001/P1).
  - O aviso é dentro do sistema: lista “Aguardando revisão” e contador no topo, para todos que podem aprovar (CE-07). E-mail e WhatsApp não fazem parte desta fase.
  - A **primeira decisão registrada encerra a versão**; tentativas posteriores na mesma versão são recusadas com “versão já decidida por <nome> em <data>” (CE-09).
  - Devolver exige comentário (mínimo 10 caracteres); arquivar exige motivo.
  - Uma nova geração após devolução cria a versão seguinte com o comentário como contexto (SPEC-1-004); a versão devolvida e o comentário ficam guardados.
  - A passagem a `pronto para publicar` só existe pela ação “Aprovar”; o backend recusa qualquer outra forma.
- **Bloqueios:** nenhum.

## Resultado observável

Quem pode aprovar vê o contador “Aguardando revisão (N)”, abre a peça, compara com a versão anterior
quando houver, e aprova, devolve com comentário ou arquiva; quem não pode aprovar não vê os botões e
a tentativa de marcar “pronto” sem aprovação é recusada.

## Limites e dependências

- **Inclui:** coleção `decisoes_revisao`; tela Aguardando revisão; contador; botões Aprovar, Devolver e Arquivar na tela do item; comparação com a versão anterior; regra de backend que protege o estado `pronto para publicar`.
- **Fora de escopo:** e-mail ou WhatsApp de aviso, prazo de revisão e painel de itens parados, permissões por perfil, feedback estruturado por texto/design.
- **Entradas e pré-condições:** SPEC-1-001 (quem pode aprovar) e SPEC-1-004 (item `em revisão`).
- **Saídas/artefatos:** decisões registradas; itens em `pronto para publicar`, `ajustes solicitados` ou `arquivado`.
- **Dependências e responsáveis:** Bellei e Peres; revisores marcados pelo administrador.
- **Atores e permissões mínimas:** quem pode aprovar decide; usuário comum vê a peça sem botões de decisão; executor nunca decide.
- **Superfícies/arquivos/configurações afetadas:** telas Aguardando revisão e Item; coleção `decisoes_revisao`; validação de atualização de `itens_conteudo`.
- **Risco e plano B:** ninguém abre o sistema e a fila trava — contador visível na entrada e rotina diária de revisão combinada na call de início.
- **Rollback ou reversão:** decisão registrada não é apagada; um item aprovado por engano é arquivado com motivo por quem pode aprovar antes de ser publicado (SPEC-1-006, RN-29) e, se ainda valer, reaberto como pauta (SPEC-1-002), mantendo o histórico.

## Dados e integrações

| Origem/destino | Fonte de verdade | Campos/contrato | Autenticação/permissão | Timeout/retry/idempotência | Tratamento de erro |
|---|---|---|---|---|---|
| `decisoes_revisao` | este registro | `item`, `versao` (número), `decisao` (`aprovada` \| `devolvida` \| `arquivada`), `comentario` (obrigatório em devolvida e arquivada), `autor`, `data` | criação só por usuário com `pode_aprovar = sim`; ninguém edita ou apaga | índice único `item + versao`: a primeira decisão vence; a segunda recebe 409 | sem comentário → 422 |
| Validação de atualização de `itens_conteudo` | backend | passar a `pronto para publicar` exige uma decisão `aprovada` para a versão atual | regra no backend (hook de validação) | — | qualquer outra tentativa → 400 “aprovação obrigatória” |

| Regra de negócio | Condição | Ação/resultado | Exceção | Fonte |
|---|---|---|---|---|
| RN-21 | Item entra em `em revisão` | Aparece na lista e soma no contador de todos que podem aprovar | — | AC-001; CE-07 |
| RN-22 | Aprovar | Decisão `aprovada` (autor, data, versão) → item `pronto para publicar` | — | RQ-006 |
| RN-23 | Devolver | Decisão `devolvida` com comentário → item `ajustes solicitados`; “Gerar texto” cria a versão seguinte com o comentário | — | RQ-006 |
| RN-24 | Arquivar na revisão | Decisão `arquivada` com motivo → item `arquivado` (reabertura pela SPEC-1-002) | — | RQ-006 |
| RN-25 | Segunda decisão na mesma versão | Recusada: “versão já decidida por <nome> em <data>” | — | CE-09 |
| RN-26 | Mudar para `pronto para publicar` sem decisão `aprovada` da versão atual | Recusado no backend | — | RQ-006 |

## Fluxo e regras

1. O item chega a `em revisão` (SPEC-1-004) e entra na lista.
2. Quem pode aprovar abre a peça (cards, legenda, imagens, selos e, se houver, a versão anterior com o comentário).
3. Decide: Aprovar → `pronto para publicar`; Devolver com comentário → `ajustes solicitados`; Arquivar com motivo → `arquivado`.
4. Depois de uma devolução, o usuário clica “Gerar texto” e o ciclo recomeça na versão seguinte.

| Cenário | Dado/condição | Resultado esperado | Caminho de erro/recuperação |
|---|---|---|---|
| Principal | Revisor aprova a versão 2 depois de devolver a 1 | Duas decisões registradas; item `pronto para publicar` | — |
| Limite | Dois revisores decidem a mesma versão quase juntos | A primeira vale; a segunda recebe a mensagem | — |
| Falha | Usuário sem “pode aprovar” tenta aprovar pela tela ou pelo SDK | Botões ausentes; backend recusa (403) | — |
| Falha | Mudar o estado para `pronto para publicar` direto pelo SDK | 400 “aprovação obrigatória” | — |

## Instruções de execução para o Ethos (Maestro)

1. **Ler antes de alterar:** esta SPEC e as SPECs 1-001 e 1-004.
2. **Alterar somente:** coleção `decisoes_revisao`, telas Aguardando revisão e Item (botões), validação de atualização de `itens_conteudo`.
3. **Não alterar:** geração, fila e publicação; não criar aviso por e-mail ou WhatsApp.
4. **Executar nesta ordem:** coleção e índice único → validação do backend → lista e contador → botões e comparação de versões → testes do TDD.
5. **Parar e pedir validação quando:** alguém pedir aviso por e-mail/WhatsApp ou aprovação automática.
6. **Estado válido ao parar:** nenhum item chega a `pronto para publicar` sem decisão registrada.

## Checklist de execução

- [ ] Lista, contador e botões visíveis só para quem pode aprovar.
- [ ] Devolver com comentário gerando a versão seguinte.
- [ ] Primeira decisão encerrando a versão.
- [ ] Backend recusando `pronto para publicar` sem aprovação.
- [ ] Capturas em `05_entregas/fase-1/SPEC-1-005/`.

## Critérios de aceite

- [ ] **CA-1-16:** todo item em `em revisão` aparece na lista “Aguardando revisão” e no contador de todos os usuários que podem aprovar, e só eles veem os botões de decisão.
- [ ] **CA-1-17:** aprovar registra autor, data e versão e leva o item a `pronto para publicar`; devolver exige comentário, leva a `ajustes solicitados` e a nova geração cria a versão seguinte com o comentário, preservando a versão e o comentário anteriores.
- [ ] **CA-1-18:** não há caminho para `pronto para publicar` sem decisão `aprovada` da versão atual — a tela não oferece e o backend recusa (400); usuário sem permissão recebe 403.
- [ ] **CA-1-19:** a primeira decisão registrada encerra a versão; uma segunda tentativa na mesma versão é recusada com o nome e a data da decisão existente; arquivar exige motivo.

## TDD da SPEC

| Etapa | Prova | Comando/ação | Resultado esperado | Evidência |
|---|---|---|---|---|
| RED | Sem a validação, o estado pode ser forçado | Com Usuário B, `pb.collection('itens_conteudo').update(<id de teste>, { estado: 'pronto_para_publicar' })` | Passa — falta a regra (CA-1-18) | `05_entregas/fase-1/SPEC-1-005/red.png` |
| GREEN | Ciclo de revisão | (1) item de teste em `em revisão` aparece para A e C, não para B; (2) C devolve a versão 1 com comentário; (3) gerar a versão 2; (4) A aprova a versão 2 | (1) contador e lista corretos; (2) `ajustes solicitados`; (3) versão 2 com o comentário como contexto; (4) `pronto para publicar` com autor e data | `green-1..4.png` |
| REFACTOR/REGRESSÃO | Bordas | Repetir o RED (400); B tenta aprovar pelo SDK (403); C tenta decidir a versão 2 já aprovada (409 com a mensagem); devolver sem comentário (422); arquivar sem motivo (422) | Todas as recusas com a mensagem certa; histórico completo | `regressao.png` |

**Dados/fixtures:** Usuários A (pode aprovar), B (não pode) e C (pode aprovar) da SPEC-1-001; item de teste gerado na SPEC-1-004.  
**Caminhos de erro obrigatórios:** permissão negada, decisão dupla, comentário ausente, estado forçado.  
**Evidência exigida:** capturas e a lista de decisões do item de teste.

## Handoff e operação

- **Como demonstrar:** devolver uma peça com comentário, mostrar a nova versão, aprovar e tentar marcar “pronto” sem aprovação.
- **Como operar depois:** quem pode aprovar abre a lista uma vez por dia (rotina combinada na call de início).
- **Como monitorar:** contador “Aguardando revisão”.
- **Pendência conhecida:** aviso por e-mail ou WhatsApp, se o consultor quiser, entra por emenda.

## Tasks vinculadas

| ID | Task (fase 1 · título exato) | SPEC | Critério | Recorte da prova | Evidência esperada | Pré-condições |
|---|---|---|---|---|---|---|
| id pendente | Montar a revisão e a aprovação | SPEC-1-005 | CA-1-16 a CA-1-19 | TDD completo | capturas RED/GREEN/REGRESSÃO | SPECs 1-001 e 1-004 |
| id pendente | Mostrar a lista “Aguardando revisão” a quem pode aprovar | SPEC-1-005 | CA-1-16 | GREEN 1 | lista e contador para A e C, não para B | item em `em revisão` |
| id pendente | Devolver com comentário e gerar a nova versão | SPEC-1-005 | CA-1-17, CA-1-19 | GREEN 2–4, REGRESSÃO (decisão dupla, comentário ausente) | duas versões e duas decisões | lista funcionando |
| id pendente | Bloquear “pronto para publicar” sem aprovação | SPEC-1-005 | CA-1-18 | RED e REGRESSÃO (400 e 403) | recusas registradas | validação no backend |

## Emendas

| Data | Origem do sinal | Micro-spec/task | Motivo |
|---|---|---|---|
| | | | |
