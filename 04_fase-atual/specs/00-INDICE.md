# Índice de SPECs — Fase 1

**Fase:** 1 — Da pauta ao carrossel aprovado no Instagram · **Período:** 19/10/2026 a 30/10/2026  
**Gerado em:** 2026-10-05 · revisão de SPECs e de tasks em fallback serial

| SPEC | Entrega | Critérios | Degrau | Depende de |
|---|---|---|---|---|
| [SPEC-1-001](spec-1-001-configuracao-editorial-e-usuarios.md) | Configuração editorial e usuários | CA-1-01 a CA-1-03 | nativo da plataforma | — |
| [SPEC-1-002](spec-1-002-pautas-manuais-e-sugestoes.md) | Pautas manuais e sugestões do Maestro | CA-1-04 a CA-1-07 | nativo da plataforma | 1-001; 1-003 (sugestões) |
| [SPEC-1-003](spec-1-003-conexao-maestro-e-fila-de-execucao.md) | Conexão do Maestro com o sistema e fila de execução | CA-1-08 a CA-1-11 | nativo da plataforma | 1-001 |
| [SPEC-1-004](spec-1-004-geracao-de-carrossel-e-legenda.md) | Geração do carrossel e da legenda | CA-1-12 a CA-1-15 | nativo da plataforma | 1-002, 1-003 |
| [SPEC-1-005](spec-1-005-revisao-e-aprovacao.md) | Revisão e aprovação | CA-1-16 a CA-1-19 | nativo da plataforma | 1-001, 1-004 |
| [SPEC-1-006](spec-1-006-registro-de-publicacao-e-calendario.md) | Registro de publicação e calendário | CA-1-20 a CA-1-22 | nativo da plataforma | 1-005 |
| [SPEC-1-007](spec-1-007-primeiro-carrossel-real-e-aceite.md) | Primeiro carrossel real publicado e aceite da fase | CA-1-23 a CA-1-25 (teste humano CL-009) | reuso | 1-001 a 1-006 |

**Ordem de execução:** 1-001 → 1-003 (prova de conexão até 21/10) → 1-002 → 1-004 → 1-005 → 1-006 → 1-007.

**Tasks:** `00.tasks_per_fase/fase_1.md` (fonte canônica dos cards; IDs do portal já preenchidos — não apagar os marcadores `<!-- id:… -->`). Prazos replanejados em 16/10/2026 para 19/10 a 30/10.
