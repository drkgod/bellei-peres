# SPEC-1-003 — Conexão do Maestro com o sistema e fila de execução

**Fase:** 1  
**Status:** planejada  
**Dono:** Bellei e Peres (execução com o Maestro) · aceite: Rodrigo Santos (consultor)  
**Origem no escopo:** RQ-009, RQ-010, AC-003/P3, P5, CE-01; CL-001, CL-006  
**Degrau da solução:** nativo da plataforma — rotas próprias, rotina agendada e cofre de segredos do Skip Cloud, mais a automação e o navegador do próprio Maestro; nenhuma API paga.

## Contexto e decisões fechadas

- **Estado atual:** o Maestro do escritório existe (login enviado na 1ª Consultoria, [00:06:30]) mas não conversa com nenhum sistema. Ninguém provou ainda como o Maestro lê e grava no sistema do Skip.
- **Estado desejado:** o sistema tem uma **fila de execuções**; o Maestro pega cada tarefa pendente, executa e devolve o resultado ou o erro ao mesmo item; toda tentativa fica registrada; falha deixa o item `bloqueado` com motivo e pode ser reprocessada sem duplicar nada.
- **Decisões já fechadas:**
  - O sistema no Skip é a fonte de verdade; o Maestro trabalha “embutido” por automações que vão ao sistema e devolvem o resultado (P5; 1ª Consultoria [00:32:31]).
  - Na fase 1 o único provedor é o Maestro. Não existe rota de API paga; o botão de contingência por API é de outra etapa (P3).
  - Caminho A (preferido): o Maestro chama as rotas do executor do sistema (`/backend/v1/executor/...`) por conexão personalizada por URL, com um token guardado no cofre de segredos do Skip Cloud.
  - Caminho B (se o A não funcionar): o Maestro usa o próprio navegador logado no sistema como o usuário técnico **Maestro (executor)** e opera a tela **Fila do Maestro**, que grava exatamente os mesmos registros.
  - Acionamento: automação agendada no Maestro a cada 30 minutos, das 8h às 20h (horário de Brasília), e acionamento manual pelo chat do Maestro com o pedido “processar a fila agora”.
  - Prazo de resposta: execução `em execução` por mais de 2 horas vira `falhou` com motivo “sem resposta do Maestro”.
- **Bloqueios:** se nem o caminho A nem o B funcionarem até 21/10, parar e pedir decisão do consultor; não usar API paga nem montar outro caminho por conta própria.

## Resultado observável

Na tela **Execuções**, o escritório vê cada tarefa enviada ao Maestro com tipo, item, tentativa,
início, fim e resultado; um item com falha aparece `bloqueado` com o motivo e um botão
“Reprocessar”, que gera nova tentativa sem duplicar o item nem a versão.

## Limites e dependências

- **Inclui:** coleção `execucoes`; rotas `GET /backend/v1/executor/fila`, `POST /backend/v1/executor/assumir`, `POST /backend/v1/executor/resultado` e `POST /backend/v1/executor/erro`; segredo `MAESTRO_EXECUTOR_TOKEN`; rotina agendada `expirar_execucoes`; telas Execuções e Fila do Maestro; usuário técnico executor; automação no Maestro; ação “Reprocessar”.
- **Fora de escopo:** o conteúdo de cada tarefa (sugestões — SPEC-1-002; texto e imagens — SPEC-1-004), API paga, botão de contingência, edição de vídeo.
- **Entradas e pré-condições:** CL-001 (login do Maestro funcionando e créditos disponíveis); CL-006 (contexto do escritório colocado no Maestro); SPEC-1-001 com o projeto criado.
- **Saídas/artefatos:** fila funcionando; caminho de conexão escolhido (A ou B) registrado em `05_entregas/fase-1/SPEC-1-003/caminho.md`; instrução da automação salva no Maestro.
- **Dependências e responsáveis:** Bellei e Peres configura o sistema e a automação no Maestro; o consultor decide se A e B falharem.
- **Atores e permissões mínimas:** executor lê execuções pendentes, assume, grava resultado ou erro e lê os arquivos do item da tarefa — nada mais (não aprova, não publica, não altera configuração); usuário vê a tela Execuções e reprocessa; administrador também.
- **Superfícies/arquivos/configurações afetadas:** hooks/rotas do Skip Cloud, segredo no cofre, telas Execuções e Fila do Maestro, automação no Maestro.
- **Risco e plano B:** conexão por URL recusada → caminho B; automação agendada indisponível no Maestro → só acionamento manual, registrado como limitação; créditos esgotados → execução `falhou` com motivo “créditos insuficientes”.
- **Rollback ou reversão:** desativar a automação no Maestro e trocar o token pára toda execução sem perder dados; execuções e itens continuam no sistema.

## Dados e integrações

| Origem/destino | Fonte de verdade | Campos/contrato | Autenticação/permissão | Timeout/retry/idempotência | Tratamento de erro |
|---|---|---|---|---|---|
| `execucoes` (Skip Cloud) | este registro | `item` (relação; vazio em `sugerir_pautas`), `perfil` (relação; usado em `sugerir_pautas`), `pedido` (identificador do clique, em `sugerir_pautas`), `versao` (número da versão do conteúdo, quando houver), `tipo` (`sugerir_pautas` \| `gerar_texto` \| `gerar_imagens`), `estado` (`pendente` \| `em execucao` \| `concluida` \| `falhou`), `tentativa` (1, 2, …), `chave` (`item:versao:tipo`; em `sugerir_pautas`, `perfil:pedido:sugerir_pautas`), `provedor` (sempre `maestro` nesta fase), `entrada` (JSON), `resultado` (JSON), `erro`, `assumida_em`, `concluida_em`, `criada_por` | criação: usuários pelas ações das telas; leitura e escrita de estado: só rotas do executor e rotina agendada | só uma execução aberta (`pendente` ou `em execucao`) por `chave`; resultado com execução já `concluida` é ignorado e registrado | erro grava `erro` e passa o item a `bloqueado` |
| `GET /backend/v1/executor/fila` | `execucoes` | devolve até 5 execuções `pendente`, mais antigas primeiro, com `entrada` e links temporários dos arquivos necessários (por exemplo, o logo) | cabeçalho `X-Executor-Token` igual ao segredo `MAESTRO_EXECUTOR_TOKEN` (caminho A) ou sessão do usuário com papel `executor` (caminho B, pela tela Fila do Maestro); sem nenhum dos dois → 401 | — | — |
| `POST /backend/v1/executor/assumir` | `execucoes` | `{ execucao_id }` → `em execucao` e `assumida_em` | mesmo token | assumir execução já assumida → 409 (outra rodada já pegou) | — |
| `POST /backend/v1/executor/resultado` | `execucoes` e item | `{ execucao_id, chave, resultado }` + arquivos (multipart) | mesmo token | `chave` diferente da execução → 422; execução já `concluida` → 200 sem alterar nada | arquivo inválido → 422 e execução `falhou` |
| `POST /backend/v1/executor/erro` | `execucoes` e item | `{ execucao_id, motivo }` | mesmo token | — | item → `bloqueado`, `motivo_estado` = motivo |
| Rotina `expirar_execucoes` (agendada a cada 15 minutos; o agendamento do Skip Cloud usa UTC) | `execucoes` | `em execucao` há mais de 2 horas → `falhou` com “sem resposta do Maestro” | interna | — | item → `bloqueado` |
| Usuário técnico “Maestro (executor)” (caminho B) | `users` | `papel = executor`, `pode_aprovar = não` | login próprio; senha guardada só no Maestro | — | — |

| Regra de negócio | Condição | Ação/resultado | Exceção | Fonte |
|---|---|---|---|---|
| RN-11 | Criar execução com a mesma `chave` de outra aberta | Recusado; mostra a execução aberta | — | idempotência |
| RN-12 | Falha (erro devolvido, prazo de 2 h, créditos, arquivo inválido) | Execução `falhou`; o item guarda o estado atual em `estado_antes_bloqueio` e fica `bloqueado` com motivo | Em `sugerir_pautas` não há item: a falha aparece na tela Pautas com o motivo e o botão “Tentar de novo” | RQ-009 |
| RN-13 | “Reprocessar” num item `bloqueado` por falha de execução | Cria execução com a mesma `chave` e `tentativa + 1`; o item volta ao `estado_antes_bloqueio` quando a nova execução conclui | Bloqueio por “tema vedado” não reprocessa | RQ-009 |
| RN-14 | Qualquer chamada às rotas do executor sem token válido nem sessão de executor | 401 e registro no log do backend sem o valor do token | — | RQ-010 |
| RN-15 | Token, senha do executor ou senha do Maestro | Nunca aparecem em tela, comentário, `entrada`, `resultado`, `erro` ou log | — | RQ-010 |

## Fluxo e regras

1. Ao pedir sugestões, texto ou imagens, o sistema cria uma execução `pendente` e o item mostra “aguardando o Maestro”.
2. A automação do Maestro (ou o pedido manual) busca a fila, assume uma execução, faz o trabalho e devolve o resultado ou o erro.
3. O sistema grava o resultado no item (SPECs 1-002 e 1-004) e conclui a execução; em erro ou prazo vencido, bloqueia o item com motivo.
4. O usuário vê tudo na tela Execuções e usa “Reprocessar” quando a falha estiver resolvida.

**Prova de conexão (primeira coisa a fazer, até 21/10):** criar uma execução de teste do tipo
`sugerir_pautas` com quantidade 1 para o perfil de teste (a sugestão que voltar fica marcada `teste`); tentar o caminho A; se em até 2 horas de
tentativas não funcionar, tentar o caminho B; registrar em `caminho.md` qual funcionou, com captura.

**Instrução da automação no Maestro (colar na automação):** “Busque a fila da Máquina de Conteúdo.
Para cada tarefa pendente, assuma, execute exatamente o que a tarefa pede usando só os dados da
tarefa e o que o escritório já me forneceu, e devolva o resultado no formato pedido. Se faltar dado,
acesso ou crédito, devolva erro com o motivo. Nunca aprove, publique, altere configuração ou use
outra ferramenta paga.”

| Cenário | Dado/condição | Resultado esperado | Caminho de erro/recuperação |
|---|---|---|---|
| Principal | Execução pendente e Maestro disponível | `concluida` com resultado no item | — |
| Limite | Duas rodadas tentam assumir a mesma execução | A segunda recebe 409 e não executa | — |
| Limite | Resultado enviado duas vezes | Segundo envio ignorado; nada duplicado | — |
| Falha | Maestro devolve erro ou passa de 2 h | Item `bloqueado` com motivo | “Reprocessar” |
| Falha | Chamada sem token ou com token errado | 401 | Corrigir a conexão no Maestro |

## Instruções de execução para o Ethos (Maestro)

1. **Ler antes de alterar:** esta SPEC e a SPEC-1-001.
2. **Alterar somente:** coleção `execucoes`, as quatro rotas, a rotina `expirar_execucoes`, as telas Execuções e Fila do Maestro, o usuário executor e a automação no Maestro.
3. **Não alterar:** regras de revisão e publicação; não criar rota de API paga nem conectar outra ferramenta.
4. **Executar nesta ordem:** coleção → rotas com token → prova de conexão (A, depois B) → registrar o caminho → rotina de prazo → tela Execuções e “Reprocessar” → automação agendada → testes do TDD.
5. **Parar e pedir validação quando:** A e B falharem; o Maestro pedir para conectar outra conta; o Skip Cloud exigir plano ou permissão que o escritório não tenha.
6. **Estado válido ao parar:** nenhuma execução fica presa sem estado; itens com falha ficam `bloqueado` com motivo.
7. **Segredos:** o token vai só no campo de cabeçalho/segredo da conexão do Maestro, nunca na conversa; no caminho B, o usuário executor tem senha exclusiva, permissões mínimas e senha trocada depois dos testes; nenhum dos dois é reaproveitado em outro lugar.

## Checklist de execução

- [ ] CL-001 e CL-006 conferidos (Maestro acessível, com créditos e com o contexto do escritório).
- [ ] Token criado no cofre do Skip Cloud e configurado só no Maestro.
- [ ] Prova de conexão feita e caminho registrado em `caminho.md`.
- [ ] Prazo de 2 horas, bloqueio e reprocessamento testados.
- [ ] Busca por token e senhas nas telas, comentários e registros sem nenhum resultado.
- [ ] Capturas em `05_entregas/fase-1/SPEC-1-003/`.

## Critérios de aceite

- [ ] **CA-1-08:** uma execução de teste é lida pelo Maestro e o resultado aparece no sistema (a sugestão de teste na tela Pautas); o caminho usado (A ou B) está registrado com captura.
- [ ] **CA-1-09:** cada execução registra tipo, item, versão, tentativa, provedor `maestro`, início, fim, resultado ou erro, visível na tela Execuções; nenhuma execução usa outro provedor.
- [ ] **CA-1-10:** erro devolvido ou prazo de 2 horas vencido deixa o item `bloqueado` com motivo; “Reprocessar” cria a tentativa seguinte com a mesma chave, sem duplicar item, versão ou arquivo, e resultado repetido é ignorado.
- [ ] **CA-1-11:** nenhum token ou senha aparece em tela, comentário, entrada, resultado, erro ou log; chamada sem token válido nem sessão de executor recebe 401.

## TDD da SPEC

| Etapa | Prova | Comando/ação | Resultado esperado | Evidência |
|---|---|---|---|---|
| RED | Sem rotas e sem token, o Maestro não consegue ler a fila | Pedir ao Maestro “processar a fila agora” com uma execução de teste pendente; chamar `GET <backend>/backend/v1/executor/fila` sem token | Execução continua `pendente`; chamada sem token não devolve dados | `05_entregas/fase-1/SPEC-1-003/red.png` |
| GREEN | Conexão e ciclo completo | (1) prova de conexão pelo caminho A ou B; (2) execução concluída com resultado gravado; (3) execução de um item de teste forçada a erro (o Maestro devolve o erro “teste de falha” pela rota de erro) | (1) caminho registrado; (2) `concluida`, provedor `maestro`; (3) item `bloqueado` com o motivo e `estado_antes_bloqueio` preenchido | `caminho.md`, `green-1..3.png` |
| REFACTOR/REGRESSÃO | Prazo, duplicidade e segredos | Deixar uma execução assumida sem resposta e aguardar a rotina (ou ajustar a hora de `assumida_em` da execução de teste pelo painel do Skip Cloud, como superusuário); reprocessar; reenviar o mesmo resultado; assumir duas vezes; procurar o token nas telas, comentários, `entrada`, `resultado`, `erro` e log | Item `bloqueado` “sem resposta do Maestro”; tentativa 2 conclui sem duplicar; segundo envio ignorado; 409 na segunda assunção; nenhuma ocorrência do token | `regressao.png` e registro da busca |

**Dados/fixtures:** perfil de teste da SPEC-1-001; execução de teste `sugerir_pautas` com quantidade 1; item “Pauta de teste — conexão” marcado `teste`, com uma execução de teste criada para ele (para os cenários de erro, prazo e reprocessamento); token de teste trocado por um novo depois dos testes.  
**Caminhos de erro obrigatórios:** sem token, prazo vencido, erro devolvido, assunção dupla, resultado repetido, créditos insuficientes (simulado com erro “créditos insuficientes”).  
**Evidência exigida:** `caminho.md`, capturas e registro da busca por segredos.

## Handoff e operação

- **Como demonstrar:** pedir uma tarefa, mostrar a execução na tela, forçar uma falha e reprocessar.
- **Como operar depois:** olhar a tela Execuções quando um item ficar “aguardando o Maestro” por muito tempo; reprocessar depois de resolver a causa.
- **Como monitorar:** itens `bloqueado` na lista; consumo de créditos no próprio Maestro.
- **Pendência conhecida:** se só o caminho B funcionar, a sessão do navegador do Maestro pode expirar — renovar o login é tarefa do administrador.

## Tasks vinculadas

| ID | Task (fase 1 · título exato) | SPEC | Critério | Recorte da prova | Evidência esperada | Pré-condições |
|---|---|---|---|---|---|---|
| id pendente | Ligar o Maestro ao sistema | SPEC-1-003 | CA-1-08 a CA-1-11 | TDD completo | `caminho.md` e capturas | SPEC-1-001 com o projeto criado |
| id pendente | Entrar no Maestro e colocar as informações do escritório | SPEC-1-003 | pré-condições CL-001 e CL-006 | — | login feito e contexto registrado no Maestro | login enviado no grupo |
| id pendente | Testar a conexão do Maestro com a fila do sistema | SPEC-1-003 | CA-1-08 | RED e GREEN 1–2 | `caminho.md` com captura | rotas e token criados |
| id pendente | Registrar cada execução e bloquear o item que falhar | SPEC-1-003 | CA-1-09, CA-1-10 (bloqueio) | GREEN 3 | tela Execuções e item `bloqueado` | conexão provada |
| id pendente | Reprocessar um item bloqueado sem duplicar | SPEC-1-003 | CA-1-10 (reprocessar) | REGRESSÃO (prazo, reprocessar, resultado repetido, assunção dupla) | tentativa 2 sem duplicidade | item bloqueado de teste |
| id pendente | Conferir que nenhuma senha ou chave aparece no sistema | SPEC-1-003 | CA-1-11 | RED (sem token) e REGRESSÃO (busca de segredos) | registro da busca sem ocorrências | rotas no ar |

## Emendas

| Data | Origem do sinal | Micro-spec/task | Motivo |
|---|---|---|---|
| | | | |
