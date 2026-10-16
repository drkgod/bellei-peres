# SPEC-1-007 — Primeiro carrossel real publicado e aceite da fase

**Fase:** 1  
**Status:** planejada  
**Dono:** Bellei e Peres (execução com o Maestro) · aceite: Rodrigo Santos (consultor)  
**Origem no escopo:** resultado de negócio e aceite da fase 1; RQ-001 a RQ-003, RQ-006, RQ-008 a RQ-010; CL-009  
**Degrau da solução:** reuso — usa somente o que as SPECs 1-001 a 1-006 entregaram; nada novo é construído.

## Contexto e decisões fechadas

- **Estado atual:** as partes do sistema foram construídas e testadas uma a uma, com itens de teste.
- **Estado desejado:** uma pauta real percorre o sistema inteiro e vira um carrossel publicado no Instagram, com registro; as bordas da fase são repetidas sem erro; o escritório conta o que gostou e o que não gostou; o consultor dá o aceite.
- **Decisões já fechadas:**
  - Um carrossel real publicado é o mínimo para o aceite; publicar mais de um na fase é bem-vindo, mas não obrigatório.
  - A pauta real é escolhida pelo escritório (por exemplo, uma decisão recente da área trabalhista ou empresarial).
  - O teste humano é feito pelo champion e por quem aprova (CL-009) e o aceite é registrado pelo consultor.
  - Achado que estiver dentro do aceite de uma SPEC volta para aquela SPEC (mesmo TDD); pedido além do aceite vira emenda decidida pelo consultor, não ajuste improvisado.
- **Bloqueios:** SPECs 1-001 a 1-006 com os critérios aprovados.

## Resultado observável

No fim da fase, o escritório mostra no Instagram o primeiro carrossel feito pelo sistema e, no
sistema, o caminho completo do item: pauta, versões, devolução, aprovação, publicação com link e o
dia no calendário.

## Limites e dependências

- **Inclui:** execução ponta a ponta com pauta real; regressão das bordas das SPECs 1-001 a 1-006; teste humano CL-009; revisão das evidências e call de fechamento.
- **Fora de escopo:** novas capacidades; correções além do aceite (viram emenda).
- **Entradas e pré-condições:** SPECs 1-001 a 1-006 aceitas; kit de marca real cadastrado; perfil real configurado.
- **Saídas/artefatos:** item real publicado; relatório de evidências em `05_entregas/fase-1/SPEC-1-007/relatorio.md`; registro do que gostaram/não gostaram; aceite do consultor.
- **Dependências e responsáveis:** Bellei e Peres executa e testa; Rodrigo Santos revisa evidências, dá o aceite e decide o fechamento.
- **Atores e permissões mínimas:** os mesmos das SPECs anteriores.
- **Superfícies/arquivos/configurações afetadas:** nenhuma nova.
- **Risco e plano B:** carrossel real reprovado duas vezes — o aceite pode usar a terceira versão; se não houver versão aprovada até 29/10, o consultor decide na call de fechamento se a fase estende ou fecha com pendência.
- **Rollback ou reversão:** itens de teste das SPECs anteriores são arquivados com motivo “teste”; nada é apagado.

## Dados e integrações

| Origem/destino | Fonte de verdade | Campos/contrato | Autenticação/permissão | Timeout/retry/idempotência | Tratamento de erro |
|---|---|---|---|---|---|
| Item real e seus registros | sistema (SPECs 1-001 a 1-006) | estado, versões, decisões, execuções e publicação | usuários reais | os das SPECs | os das SPECs |

| Regra de negócio | Condição | Ação/resultado | Exceção | Fonte |
|---|---|---|---|---|
| RN-31 | Regressão de borda falhar | A tarefa da SPEC de origem volta a ficar aberta e é corrigida pelo TDD daquela SPEC | — | disciplina de execução |
| RN-32 | Aceite | Só com o caminho completo comprovado, a regressão sem falha e o teste humano registrado | — | aceite da fase |

## Fluxo e regras

1. Escolher a pauta real e registrá-la (SPEC-1-002).
2. Priorizar, gerar texto e imagens (SPEC-1-004).
3. Um revisor devolve a versão 1 com comentário; gerar a versão 2; outro revisor (ou o mesmo) aprova (SPEC-1-005).
4. Publicar manualmente no Instagram e registrar o link (SPEC-1-006); conferir no calendário.
5. Repetir as bordas: “pronto” sem aprovação, troca de público, reabrir arquivado, erro de publicação, falha do Maestro com reprocessamento, busca de segredos.
6. Champion e quem aprova registram o que gostaram e o que não gostaram.
7. Consultor revisa o relatório e as evidências e faz a call de fechamento.

| Cenário | Dado/condição | Resultado esperado | Caminho de erro/recuperação |
|---|---|---|---|
| Principal | Pauta real | Carrossel publicado e registrado | — |
| Limite | Devolução dupla | Versão 3 aprovada e publicada | — |
| Falha | Borda falha na regressão | SPEC de origem reaberta | Corrigir pelo TDD da SPEC e repetir |

## Instruções de execução para o Ethos (Maestro)

1. **Ler antes de alterar:** esta SPEC e as SPECs 1-001 a 1-006.
2. **Alterar somente:** nada — esta SPEC só executa e registra.
3. **Não alterar:** código ou configuração durante a prova; uma correção volta para a SPEC de origem.
4. **Executar nesta ordem:** caminho completo → regressão → teste humano → relatório.
5. **Parar e pedir validação quando:** uma borda falhar ou o escritório pedir algo além do aceite.
6. **Estado válido ao parar:** o item real fica no último estado válido, com histórico.

## Checklist de execução

- [ ] Pauta real escolhida e registrada.
- [ ] Caminho completo executado até a publicação registrada.
- [ ] Regressão das bordas sem falha.
- [ ] Teste humano CL-009 registrado.
- [ ] Relatório em `05_entregas/fase-1/SPEC-1-007/relatorio.md`.
- [ ] Aceite do consultor registrado.

## Critérios de aceite

- [ ] **CA-1-23:** uma pauta real percorre registro → priorização → texto e imagens pelo Maestro → devolução com comentário → nova versão aprovada → publicação manual no Instagram registrada com link → calendário, e o histórico do item mostra cada passo.
- [ ] **CA-1-24:** a regressão passa sem falha: “pronto” sem aprovação recusado; troca de público só nas novas gerações; arquivado reaberto por quem aprova; erro de publicação devolve a “pronto”; falha do Maestro bloqueia e reprocessa sem duplicar; nenhuma credencial visível.
- [ ] **CA-1-25:** o champion e quem aprova registram o teste humano (CL-009) e o consultor registra o aceite da fase.

## TDD da SPEC

| Etapa | Prova | Comando/ação | Resultado esperado | Evidência |
|---|---|---|---|---|
| RED | Antes da prova, não existe nenhum item real publicado pelo sistema | Filtrar o calendário do perfil real por itens `publicado` | Nenhum item — a fase ainda não entregou valor (CA-1-23) | `05_entregas/fase-1/SPEC-1-007/red.png` |
| GREEN | Caminho completo real | Executar os passos 1 a 4 do fluxo com a pauta real | Item real `publicado`, com link, no calendário, com duas versões e duas decisões | `green.png`, link do post e histórico do item |
| REFACTOR/REGRESSÃO | Bordas das SPECs 1-001 a 1-006 | Repetir o REGRESSÃO de cada SPEC com itens de teste | Todas passam; qualquer falha reabre a SPEC de origem | tabela de regressão no `relatorio.md` |

**Dados/fixtures:** pauta real escolhida pelo escritório; perfil e kit reais; itens de teste para as bordas.  
**Caminhos de erro obrigatórios:** os das SPECs 1-001 a 1-006.  
**Evidência exigida:** link do post publicado, histórico do item, tabela de regressão e registro do teste humano.

## Teste humano do cliente

- **Origem:** CL-009
- **Quem testa:** Frederico Bellei (champion) e pelo menos uma pessoa marcada “pode aprovar”.
- **Passos:** (1) abrir a lista “Aguardando revisão” e revisar o carrossel real; (2) devolver uma vez com comentário e conferir a nova versão; (3) aprovar; (4) publicar no Instagram e registrar o link; (5) conferir o calendário; (6) escrever no grupo ou na tarefa o que gostaram e o que não gostaram (texto, visual, facilidade de uso).
- **Resultado esperado:** o escritório consegue sair da pauta e chegar ao post publicado sem montar imagem no Canva.
- **Evidência do aceite:** mensagem do champion no grupo ou comentário na tarefa, mais o link do post.

## Handoff e operação

- **Como demonstrar:** na call de fechamento, abrir o item real e o post no Instagram.
- **Como operar depois:** seguir o mesmo caminho para os próximos conteúdos.
- **Como monitorar:** calendário e contador “Aguardando revisão”.
- **Pendência conhecida:** o que o escritório não gostou vira sinal para emenda ou para as próximas etapas, por decisão do consultor.

## Tasks vinculadas

| ID | Task (fase 1 · título exato) | SPEC | Critério | Recorte da prova | Evidência esperada | Pré-condições |
|---|---|---|---|---|---|---|
| id pendente | Publicar o primeiro carrossel real pelo sistema | SPEC-1-007 | CA-1-23 a CA-1-25 | TDD completo e teste humano | relatório e link do post | SPECs 1-001 a 1-006 aceitas |
| id pendente | Fazer o caminho completo com uma pauta real | SPEC-1-007 | CA-1-23 | RED e GREEN | link do post e histórico do item | pauta real escolhida |
| id pendente | Repetir os testes de erro da fase | SPEC-1-007 | CA-1-24 | REGRESSÃO | tabela de regressão | itens de teste |
| id pendente | Contar o que gostaram e o que não gostaram do sistema | SPEC-1-007 | CA-1-25 (teste humano CL-009) | Teste humano | mensagem do champion | caminho completo feito |
| id pendente | Revisar as evidências e dar o aceite da fase | SPEC-1-007 | CA-1-25 (aceite) | conferência do relatório | aceite registrado | relatório pronto |
| id pendente | Fazer a call de fechamento da Fase 1 | SPEC-1-007 | CA-1-23 a CA-1-25 (decisão de fechamento) | demonstração na call | decisão de fechamento registrada | aceite revisado |

## Emendas

| Data | Origem do sinal | Micro-spec/task | Motivo |
|---|---|---|---|
| | | | |
