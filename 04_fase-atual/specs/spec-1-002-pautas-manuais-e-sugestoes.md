# SPEC-1-002 — Pautas manuais e sugestões do Maestro

**Fase:** 1  
**Status:** planejada  
**Dono:** Bellei e Peres (execução com o Maestro) · aceite: Rodrigo Santos (consultor)  
**Origem no escopo:** RQ-002, RQ-001, AC-004/P4, P6; CL-PEND-007  
**Degrau da solução:** nativo da plataforma — coleção e telas no mesmo aplicativo Skip; as sugestões usam a fila do Maestro já definida na SPEC-1-003 (sem API paga).

## Contexto e decisões fechadas

- **Estado atual:** ideias surgem de forma avulsa, consultando IA (1ª Consultoria [00:10:08]); não há registro de pautas.
- **Estado desejado:** a tela **Pautas** recebe pedidos manuais (por exemplo, uma decisão judicial recente — [00:13:35]) e sugestões pedidas ao Maestro; cada pauta tem origem, fonte ou “a validar”, prioridade e estado, e pode ser priorizada, descartada e reaberta com histórico.
- **Decisões já fechadas:**
  - Duas entradas convivem: manual e sugestão (P4). Nesta fase as sugestões são **sob demanda** (botão “Pedir sugestões”); a quantidade automática fica para uma próxima etapa.
  - Formatos aceitos nesta fase: `carrossel` e `imagem_unica`.
  - Estados desta SPEC: `ideia` (pauta incompleta), `em priorização` (completa, aguardando escolha), `roteiro/briefing` (priorizada, pronta para gerar), `arquivado` (com motivo). Os demais estados pertencem às SPECs 1-004 a 1-006.
  - Sugestão sem fonte (link) fica marcada “a validar”; nunca é apresentada como fato jurídico.
  - Reabrir um arquivado é permitido só a quem pode aprovar.
- **Bloqueios:** nenhum. Sem CL-PEND-007 (fontes permitidas), toda sugestão sem link sai “a validar”.

## Resultado observável

Na tela Pautas, o escritório registra uma pauta manual, pede três sugestões ao Maestro e as vê
chegar com fonte ou “a validar”; prioriza uma, descarta outra com motivo e reabre a descartada.

## Limites e dependências

- **Inclui:** coleção `itens_conteudo` (campos de pauta e estado), coleção `historico_item`, tela Pautas com filtros por estado e perfil, botão “Pedir sugestões” (quantidade 1 a 5, padrão 3).
- **Fora de escopo:** quantidade automática por cadência, roteiro de Reels, pesquisa em fontes privadas, gerar texto ou imagem (SPEC-1-004).
- **Entradas e pré-condições:** SPEC-1-001 aceita (perfil e usuários); para “Pedir sugestões”, a fila do Maestro da SPEC-1-003 funcionando.
- **Saídas/artefatos:** pautas registradas, histórico de mudanças de estado.
- **Dependências e responsáveis:** Bellei e Peres; Maestro executa o pedido de sugestões.
- **Atores e permissões mínimas:** usuário cria, edita (enquanto em `ideia`/`em priorização`), prioriza e arquiva com motivo; quem pode aprovar também reabre; executor só cria sugestões pela fila.
- **Superfícies/arquivos/configurações afetadas:** tela Pautas; coleções `itens_conteudo` e `historico_item`; tipo de execução `sugerir_pautas` na fila.
- **Risco e plano B:** Maestro indisponível — o pedido de sugestões fica `falhou` e o botão mostra o motivo; a pauta manual continua funcionando.
- **Rollback ou reversão:** nada é apagado; arquivar é a única forma de tirar uma pauta da lista; reabrir devolve a `em priorização`.

## Dados e integrações

| Origem/destino | Fonte de verdade | Campos/contrato | Autenticação/permissão | Timeout/retry/idempotência | Tratamento de erro |
|---|---|---|---|---|---|
| `itens_conteudo` | este registro | `titulo` (até 120 caracteres), `descricao`, `origem` (`manual` \| `sugestao`), `fonte_url` (opcional), `a_validar` (sim/não; sim quando não há `fonte_url`), `perfil` (relação), `versao_config_perfil` (número), `publico`, `area`, `formato` (`carrossel` \| `imagem_unica`), `prioridade` (`alta` \| `media` \| `baixa`), `estado`, `motivo_estado`, `responsavel`, `proxima_acao`, `execucao_origem` (para sugestões), `teste` (sim/não) | usuário autenticado; mudança de estado só pelas ações da tela (regra no backend) | sugestão criada com chave `execucao + posição` — reenviar o mesmo resultado não duplica | campo obrigatório para `em priorização` ausente → fica `ideia` com o campo indicado |
| `historico_item` | trilha imutável | `item`, `de_estado`, `para_estado`, `motivo`, `autor`, `data` | criação só pelo backend | uma linha por mudança | — |
| Fila do Maestro (`execucoes`, tipo `sugerir_pautas`) | SPEC-1-003 | entrada: perfil, versão da configuração, quantidade, áreas, público, tom, temas vedados, fontes permitidas (se houver); saída: lista de sugestões `{titulo, descricao, area, publico, fonte_url ou vazio, tema_vedado (sim/não)}` | executor | ver SPEC-1-003 | sugestão que toque tema vedado é descartada pelo backend e registrada no resultado |

| Regra de negócio | Condição | Ação/resultado | Exceção | Fonte |
|---|---|---|---|---|
| RN-05 | Pauta com título, perfil, público, área e formato | Vai para `em priorização` | Faltou campo → `ideia` | RQ-001, RQ-002 |
| RN-06 | Sugestão sem `fonte_url` | `a_validar = sim`, selo “a validar” | — | RQ-002 |
| RN-07 | Priorizar | `em priorização` → `roteiro/briefing`; grava `versao_config_perfil` atual | Pauta em `ideia` não pode ser priorizada | RQ-002 |
| RN-08 | Descartar/arquivar | Exige motivo (mín. 10 caracteres) → `arquivado` | — | RQ-002 |
| RN-09 | Reabrir | Só quem pode aprovar; `arquivado` → `em priorização`; histórico mantém o motivo anterior | — | RQ-002 |
| RN-10 | Título ou descrição contém um termo da lista `temas_vedados` do perfil (comparação sem acento e sem maiúsculas) ou o Maestro marcou `tema_vedado = sim` na sugestão | Não entra em `em priorização`; fica `arquivado` com motivo “tema vedado” | A área da pauta manual só pode ser escolhida entre as áreas do perfil | 1ª Consultoria [00:16:41] |

## Fluxo e regras

1. Usuário clica “Nova pauta”, preenche os campos e salva → `em priorização` (ou `ideia` se faltar campo).
2. Usuário clica “Pedir sugestões”, escolhe perfil e quantidade → cria execução `sugerir_pautas` (SPEC-1-003).
3. Quando o Maestro devolve o resultado, cada sugestão vira item com `origem = sugestao`, selo de fonte ou “a validar”.
4. Usuário prioriza, descarta com motivo ou deixa para depois; quem pode aprovar reabre arquivados.

| Cenário | Dado/condição | Resultado esperado | Caminho de erro/recuperação |
|---|---|---|---|
| Principal | Pauta manual completa | `em priorização`, depois `roteiro/briefing` ao priorizar | — |
| Limite | Pauta sem formato | Fica `ideia`; botão Priorizar desabilitado com o campo que falta | Completar a pauta |
| Limite | Sugestão sem link | Selo “a validar” | Revisor confere a fonte |
| Falha | Pauta sobre direito criminal | `arquivado`, motivo “tema vedado” | — |
| Falha | Maestro não responde ao pedido | Execução `falhou` com motivo; nenhuma pauta duplicada | Reprocessar (SPEC-1-003) |

## Instruções de execução para o Ethos (Maestro)

1. **Ler antes de alterar:** esta SPEC, a SPEC-1-001 (perfil) e a SPEC-1-003 (fila).
2. **Alterar somente:** coleções `itens_conteudo` e `historico_item`, tela Pautas, tipo `sugerir_pautas`.
3. **Não alterar:** configuração editorial, regras da fila, telas de revisão e publicação.
4. **Executar nesta ordem:** coleções e regras de estado → tela Pautas com pauta manual → arquivar/reabrir → botão “Pedir sugestões” ligado à fila → testes do TDD.
5. **Parar e pedir validação quando:** a fila da SPEC-1-003 ainda não funcionar (faça primeiro a pauta manual); surgir pedido de pesquisa em fonte privada.
6. **Estado válido ao parar:** pautas manuais funcionam mesmo sem as sugestões.

Instrução do pedido `sugerir_pautas` para o Maestro: pesquisar atualidades jurídicas dos últimos 30
dias nas áreas do perfil, para o público configurado, respeitando o tom e os temas vedados; usar só
fontes públicas (e as fontes permitidas, quando informadas); cada sugestão traz título, resumo de
duas a três linhas, área, público e o link da fonte — sem link, deixar vazio para sair “a validar”.

## Checklist de execução

- [ ] Coleções e regras de estado criadas.
- [ ] Pauta manual completa e incompleta testadas.
- [ ] Arquivar com motivo e reabrir por quem aprova testados.
- [ ] Pedido de sugestões devolvendo itens com fonte ou “a validar”.
- [ ] Tema vedado barrado.
- [ ] Capturas em `05_entregas/fase-1/SPEC-1-002/`.

## Critérios de aceite

- [ ] **CA-1-04:** uma pauta manual completa é registrada com origem, perfil, público, área, formato e prioridade e aparece em `em priorização`; pauta incompleta fica em `ideia` e não pode ser priorizada.
- [ ] **CA-1-05:** “Pedir sugestões” cria uma execução na fila e, concluída, gera a quantidade pedida de itens com `origem = sugestao`, cada um com link de fonte ou selo “a validar”; reenviar o mesmo resultado não duplica itens.
- [ ] **CA-1-06:** priorizar leva a `roteiro/briefing` gravando a versão da configuração; descartar exige motivo e leva a `arquivado`; só quem pode aprovar reabre, e o histórico guarda todas as mudanças.
- [ ] **CA-1-07:** pauta ou sugestão com tema vedado do perfil não chega a `em priorização` e fica `arquivado` com motivo “tema vedado”.

## TDD da SPEC

| Etapa | Prova | Comando/ação | Resultado esperado | Evidência |
|---|---|---|---|---|
| RED | Antes das regras de estado, o item pode ser priorizado incompleto ou arquivado sem motivo | Criar pauta sem formato e tentar priorizar; arquivar sem motivo (tela ou SDK `pb.collection('itens_conteudo').update(<id>, { estado: 'arquivado' })`) | As duas ações passam — falta a regra (CA-1-04, CA-1-06) | `05_entregas/fase-1/SPEC-1-002/red.png` |
| GREEN | Fluxo manual e sugestões | (1) pauta manual completa; (2) priorizar; (3) descartar outra com motivo; (4) Usuário C reabre; (5) “Pedir sugestões” com quantidade 3 | (1) `em priorização`; (2) `roteiro/briefing` com versão da configuração; (3) `arquivado`; (4) `em priorização` com histórico; (5) três itens com fonte ou “a validar” | capturas `green-1..5.png` e histórico do item |
| REFACTOR/REGRESSÃO | Bordas e duplicidade | Repetir o RED (agora recusado); Usuário B tenta reabrir (recusado); pauta “direito criminal”; reenviar o mesmo resultado de sugestões | Recusas com motivo; tema vedado arquivado; nenhuma sugestão duplicada | `regressao.png` |

**Dados/fixtures:** perfil de teste da SPEC-1-001; Usuários A, B e C; pauta “Pauta de teste — tema trabalhista empresarial” (marcada `teste`); pauta “Pauta de teste — direito criminal”.  
**Caminhos de erro obrigatórios:** campo ausente, motivo ausente, permissão negada, tema vedado, resultado repetido.  
**Evidência exigida:** capturas acima e histórico dos itens de teste.

## Handoff e operação

- **Como demonstrar:** registrar uma decisão recente como pauta manual, pedir sugestões, priorizar uma e descartar outra.
- **Como operar depois:** a tela Pautas é a entrada diária; descartadas ficam em Arquivadas.
- **Como monitorar:** filtro por estado; selo “a validar” visível.
- **Pendência conhecida:** fontes permitidas (CL-PEND-007).

## Tasks vinculadas

| ID | Task (fase 1 · título exato) | SPEC | Critério | Recorte da prova | Evidência esperada | Pré-condições |
|---|---|---|---|---|---|---|
| id pendente | Montar a tela de pautas | SPEC-1-002 | CA-1-04 a CA-1-07 | TDD completo | capturas RED/GREEN/REGRESSÃO | SPEC-1-001 aceita |
| id pendente | Registrar uma pauta manual | SPEC-1-002 | CA-1-04 | RED (parte 1), GREEN 1 | pauta manual em `em priorização` | perfil cadastrado |
| id pendente | Pedir sugestões de pauta ao Maestro | SPEC-1-002 | CA-1-05, CA-1-07 | GREEN 5 e REGRESSÃO (tema vedado, resultado repetido) | três sugestões com fonte ou “a validar” | fila da SPEC-1-003 funcionando |
| id pendente | Priorizar, descartar e reabrir pautas com motivo | SPEC-1-002 | CA-1-06 | RED (parte 2), GREEN 2–4, REGRESSÃO (reabrir sem permissão) | histórico do item | pauta registrada |

## Emendas

| Data | Origem do sinal | Micro-spec/task | Motivo |
|---|---|---|---|
| | | | |
