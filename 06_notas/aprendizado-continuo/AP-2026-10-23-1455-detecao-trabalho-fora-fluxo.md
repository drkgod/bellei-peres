# AP-2026-10-23-1455 — Detecção de trabalho fora do fluxo na retomada

- Status: candidato
- Escopo: projeto do cliente (Bellei e Peres)
- Task/SPEC: retomada de 23/10; task ae72d282 (SPEC-1-001)
- Sinal: trabalho aplicado no Skip em 22/10 (migrations 1792173001–3006, hooks
  `gerar_rascunho_post` e `posts_rascunhos_aprovacao`, telas CriacaoConteudo/Aprovacoes/Calendario)
  sem registro no fluxo, detectado na retomada pela comparação entre a versão registrada na
  plataforma.md (a0d29d7) e a versão publicada em produção (b4d7bb3), confirmada pelas rotas novas
  no skip_project_get e pelas migrations aplicadas em 22/10.
- Evidência: skip_project_status 23/10 (lastPublishedRef b4d7bb3 vs registrado a0d29d7);
  skip_cloud_list_migrations (aplicação em 2026-10-22); changelog sem registro do período;
  origem confirmada pelo cliente (própria equipe).
- Regra reutilizável: em toda retomada, parada ou antes de publicar versão nova, comparar
  `lastPublishedRef` (skip_project_status) com a versão registrada em
  `07-sistemas/<sistema>/plataforma.md` e conferir rotas do projeto; divergência → registrar DÚVIDA
  no changelog, não legitimar espelho/migrations sem decisão e não tratar a versão como entrega do
  fluxo.
- Quando aplicar: retomadas após intervalo, cron de recuperação, antes de qualquer
  apply/publish no projeto.
- Quando não aplicar: divergência limitada a `.skip.config.json` (gravado pela própria plataforma)
  ou HEAD à frente do último build sem mudança na versão publicada.
- Confiança: alta — divergência observada diretamente nas ferramentas do Skip em 23/10.
- Privacidade: sem segredo, dado pessoal ou conteúdo bruto.
