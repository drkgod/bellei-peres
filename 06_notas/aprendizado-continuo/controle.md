# Controle de aprendizado contínuo

## 2026-10-16 — task ae72d282

- **Sinal reutilizável:** sim · versionamento de entidade com histórico no Skip.
  - Padrão validado em produção (versão a0d29d7): capturar o autor em `onRecord*Request` via
    `e.auth.id` antes de `e.next()`; gravar cada versão numa coleção imutável com
    `new Record(col)` + `$app.save()`; comparar `record` vs `record.original()` (campos e listas)
    para só versionar alteração efetiva; criar a versão antes do `e.next()` do update para que
    falha no histórico impeça a alteração (atomicidade).
  - Aplicabilidade: próximas telas com histórico (pautas, versões de carrossel) e qualquer
    entidade que exija auditoria de alterações.
- **Motivo do registro:** única entrega desta data com construção real; padrão de hooks do Skip
  descoberto/validado durante a execução e reutilizável nas próximas tasks.

## 2026-10-23T14:57:00-03:00 · task ae72d282 · capturado:06_notas/aprendizado-continuo/AP-2026-10-23-1455-detecao-trabalho-fora-fluxo.md · sinal: comparar lastPublishedRef com plataforma.md em toda retomada/parada/antes de publicar; divergência → DÚVIDA no changelog.
