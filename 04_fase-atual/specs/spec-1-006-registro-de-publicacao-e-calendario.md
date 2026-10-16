# SPEC-1-006 — Registro de publicação e calendário

**Fase:** 1  
**Status:** planejada  
**Dono:** Bellei e Peres (execução com o Maestro) · aceite: Rodrigo Santos (consultor)  
**Origem no escopo:** RQ-008, RQ-007 (calendário básico), AC-005/P4  
**Degrau da solução:** nativo da plataforma — coleção e telas no aplicativo Skip; publicação continua manual no Instagram, sem integração de postagem.

## Contexto e decisões fechadas

- **Estado atual:** o escritório publica sem constância e sem registro (kickoff: zero publicações por dia).
- **Estado desejado:** quem publica no Instagram registra no sistema a data, o perfil e o link; o item vira `publicado` e aparece no **Calendário**; se a publicação der errado, o erro é registrado e o item volta a `pronto para publicar` com motivo e responsável.
- **Decisões já fechadas:**
  - A publicação é sempre manual; o sistema não publica nem agenda.
  - O link aceito é do Instagram: `https://www.instagram.com/p/<código>/` ou `https://www.instagram.com/reel/<código>/` (com ou sem `www`, com ou sem parâmetros).
  - Só itens em `pronto para publicar` podem ser registrados como publicados.
  - Quem pode aprovar também pode arquivar com motivo um item `pronto para publicar` que não deve mais sair.
  - Calendário básico: visão mensal e semanal por perfil com itens `publicado` (na data da publicação, com link) e itens `pronto para publicar` com `data_prevista` (opcional).
- **Bloqueios:** nenhum.

## Resultado observável

O escritório publica o carrossel aprovado no Instagram, cola o link no sistema e vê a peça no
calendário no dia certo; um erro de publicação registrado devolve o item para “pronto para publicar”
com o motivo.

## Limites e dependências

- **Inclui:** coleção `publicacoes`; ações “Registrar publicação”, “Registrar erro de publicação” e “Arquivar com motivo”; campo `data_prevista` no item; tela Calendário com filtro por perfil; download das imagens e cópia da legenda para publicar.
- **Fora de escopo:** publicação ou agendamento automáticos, métricas do Instagram, TikTok, calendário editorial completo por formato.
- **Entradas e pré-condições:** SPEC-1-005 (item `pronto para publicar`).
- **Saídas/artefatos:** publicações registradas; calendário.
- **Dependências e responsáveis:** Bellei e Peres (quem publica no perfil).
- **Atores e permissões mínimas:** usuário registra publicação e erro; quem pode aprovar também arquiva itens prontos; executor não registra publicação.
- **Superfícies/arquivos/configurações afetadas:** telas Item e Calendário; coleção `publicacoes`; validação de estado.
- **Risco e plano B:** link colado errado — recusado com a mensagem do formato esperado; publicação feita em outro perfil — registrar erro e corrigir.
- **Rollback ou reversão:** “Registrar erro de publicação” desfaz o `publicado` mantendo o histórico; nada é apagado.

## Dados e integrações

| Origem/destino | Fonte de verdade | Campos/contrato | Autenticação/permissão | Timeout/retry/idempotência | Tratamento de erro |
|---|---|---|---|---|---|
| `publicacoes` | este registro | `item`, `versao`, `perfil`, `data_publicacao`, `link`, `registrado_por`, `situacao` (`valida` \| `com_erro`), `motivo_erro`, `responsavel_recuperacao` | usuário autenticado (não executor) | o mesmo `link` não pode estar em duas publicações válidas | link fora do padrão → 422; item fora de `pronto para publicar` → 400 |
| Campos do item | `itens_conteudo` | `data_prevista` (opcional) | usuário | — | — |

| Regra de negócio | Condição | Ação/resultado | Exceção | Fonte |
|---|---|---|---|---|
| RN-27 | Registrar publicação em item `pronto para publicar` com data, perfil e link válido | Publicação `valida`; item → `publicado` | Data futura → recusada | RQ-008 |
| RN-28 | Registrar erro de publicação em item `publicado` | Publicação `com_erro` com motivo e responsável; item → `pronto para publicar` | — | RQ-008 |
| RN-29 | Arquivar item `pronto para publicar` | Só quem pode aprovar, com motivo → `arquivado` | — | RQ-006 |
| RN-30 | Link já usado em outra publicação válida | Recusado | — | idempotência |

## Fluxo e regras

1. No item `pronto para publicar`, o usuário baixa as imagens e copia a legenda.
2. Publica manualmente no Instagram do perfil.
3. Clica “Registrar publicação”, informa data, perfil e link → item `publicado`; aparece no Calendário.
4. Se a publicação saiu errada ou incompleta, clica “Registrar erro de publicação”, informa motivo e responsável → item volta a `pronto para publicar`.

| Cenário | Dado/condição | Resultado esperado | Caminho de erro/recuperação |
|---|---|---|---|
| Principal | Item pronto, link válido | `publicado`; no calendário na data | — |
| Limite | Item pronto com `data_prevista` | Aparece no calendário como previsto | — |
| Falha | Link do Facebook ou texto qualquer | 422 com o formato esperado | Corrigir o link |
| Falha | Publicação incompleta | Erro registrado; item volta a `pronto para publicar` | Republicar e registrar de novo |
| Falha | Registrar publicação em item `em revisão` | 400 | Aprovar antes |

## Instruções de execução para o Ethos (Maestro)

1. **Ler antes de alterar:** esta SPEC e a SPEC-1-005.
2. **Alterar somente:** coleção `publicacoes`, campo `data_prevista`, ações do item e tela Calendário.
3. **Não alterar:** revisão, geração e fila; não criar integração de postagem nem pedir credencial do Instagram.
4. **Executar nesta ordem:** coleção e validações → ações do item → calendário → testes do TDD.
5. **Parar e pedir validação quando:** alguém pedir publicação ou agendamento automático.
6. **Estado válido ao parar:** nenhum item fica `publicado` sem link válido.

## Checklist de execução

- [ ] Registro de publicação com validação de link e estado.
- [ ] Registro de erro devolvendo o item.
- [ ] Arquivar item pronto com motivo.
- [ ] Calendário com filtro por perfil.
- [ ] Capturas em `05_entregas/fase-1/SPEC-1-006/`.

## Critérios de aceite

- [ ] **CA-1-20:** registrar publicação num item `pronto para publicar`, com data, perfil e link do Instagram válido, leva o item a `publicado` e o mostra no calendário na data; link inválido, link repetido, data futura ou item em outro estado são recusados.
- [ ] **CA-1-21:** registrar erro de publicação exige motivo e responsável e devolve o item a `pronto para publicar`, mantendo o histórico da publicação com erro.
- [ ] **CA-1-22:** o calendário mostra, por perfil, os itens publicados com link e os prontos com data prevista; o sistema não tem nenhuma ação que publique ou agende no Instagram.

## TDD da SPEC

| Etapa | Prova | Comando/ação | Resultado esperado | Evidência |
|---|---|---|---|---|
| RED | Sem validações, qualquer texto vira “publicado” | Registrar publicação num item de teste `em revisão` com o link `https://facebook.com/teste` | Passa — falta a validação (CA-1-20) | `05_entregas/fase-1/SPEC-1-006/red.png` |
| GREEN | Publicação e erro | (1) item de teste `pronto para publicar` com link `https://www.instagram.com/p/TESTE123/`; (2) ver no calendário; (3) registrar erro “publicado sem o último card” | (1) `publicado`; (2) no dia certo, com link; (3) volta a `pronto para publicar` com motivo e responsável | `green-1..3.png` |
| REFACTOR/REGRESSÃO | Bordas | Repetir o RED (400 e 422); registrar de novo com o mesmo link de outra publicação válida; data futura; arquivar o item pronto como Usuário B (403) e como Usuário A (ok) | Recusas com mensagem; arquivado com motivo por A | `regressao.png` |

**Dados/fixtures:** itens de teste das SPECs anteriores; links `https://www.instagram.com/p/TESTE123/` (válido) e `https://facebook.com/teste` (inválido).  
**Caminhos de erro obrigatórios:** link inválido, link repetido, data futura, estado errado, permissão negada.  
**Evidência exigida:** capturas e calendário com o item de teste.

## Handoff e operação

- **Como demonstrar:** registrar a publicação do primeiro carrossel real e mostrar o calendário.
- **Como operar depois:** registrar o link logo depois de publicar.
- **Como monitorar:** itens `pronto para publicar` sem publicação; calendário da semana.
- **Pendência conhecida:** métricas do Instagram ficam para outra etapa.

## Tasks vinculadas

| ID | Task (fase 1 · título exato) | SPEC | Critério | Recorte da prova | Evidência esperada | Pré-condições |
|---|---|---|---|---|---|---|
| id pendente | Registrar a publicação e ver o calendário | SPEC-1-006 | CA-1-20 a CA-1-22 | TDD completo | capturas RED/GREEN/REGRESSÃO | SPEC-1-005 |
| id pendente | Registrar a publicação com data, perfil e link | SPEC-1-006 | CA-1-20 | RED, GREEN 1, REGRESSÃO (link repetido, data futura) | item `publicado` com link | item aprovado |
| id pendente | Registrar um erro de publicação e voltar o item para “pronto” | SPEC-1-006 | CA-1-21 | GREEN 3, REGRESSÃO (arquivar pronto) | histórico com a publicação com erro | item publicado de teste |
| id pendente | Ver as publicações no calendário | SPEC-1-006 | CA-1-22 | GREEN 2 | calendário filtrado por perfil | publicação registrada |

## Emendas

| Data | Origem do sinal | Micro-spec/task | Motivo |
|---|---|---|---|
| | | | |
