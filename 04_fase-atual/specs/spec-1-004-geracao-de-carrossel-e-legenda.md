# SPEC-1-004 — Geração do carrossel e da legenda

**Fase:** 1  
**Status:** planejada  
**Dono:** Bellei e Peres (execução com o Maestro) · aceite: Rodrigo Santos (consultor)  
**Origem no escopo:** RQ-003, RQ-004 (carrossel e imagem), RQ-001, RQ-010, AC-002/P2/P7; CL-005  
**Degrau da solução:** nativo da plataforma — tela no aplicativo Skip, arquivos no armazenamento do Skip Cloud e geração pelo Maestro pela fila da SPEC-1-003.

## Contexto e decisões fechadas

- **Estado atual:** cada imagem é montada à mão no Canva, “imagem por imagem” (1ª Consultoria [00:14:37]); a arte gerada por IA tende a sair genérica ([00:15:21]).
- **Estado desejado:** a partir de uma pauta em `roteiro/briefing`, o escritório pede ao Maestro o texto dos cards e a legenda e, depois, as imagens com o logo e as cores do escritório; tudo fica numa versão do item, que segue para revisão.
- **Decisões já fechadas:**
  - Formatos: **carrossel** (3 a 10 cards, 1080 × 1350 px, PNG ou JPG) e **imagem única** (1080 × 1350 px).
  - Legenda: até 2.200 caracteres (limite do Instagram), com até 5 hashtags opcionais.
  - Duas tarefas separadas na fila: `gerar_texto` e `gerar_imagens`; as imagens só são pedidas depois que o texto da versão existe.
  - Kit mínimo de marca: logo (PNG, de preferência com fundo transparente) e duas a quatro cores em código hexadecimal, cadastrados na tela **Marca** pelo administrador (CL-005). Sem kit, o texto pode ser gerado, mas o botão de imagens fica indisponível com o aviso “Envie o logo e as cores”.
  - Toda geração desta fase leva o selo “gerado sem referência” (a biblioteca de referências é de outra etapa).
  - A geração usa a versão da configuração editorial gravada no item; mudar o público no perfil vale só para gerações pedidas depois da mudança (ao pedir nova geração, o sistema atualiza `versao_config_perfil` e registra a troca no histórico).
  - O Maestro usa apenas os dados da tarefa, o kit de marca e o que o escritório já lhe forneceu (P7); não busca arquivos privados.
  - Texto devolvido pelo Maestro é dado não confiável: o sistema o exibe como texto puro (sem interpretar HTML ou scripts) e só aceita arquivos de imagem PNG ou JPG.
- **Bloqueios:** nenhum para construir; para gerar imagens reais, CL-005 (logo e cores).

## Resultado observável

O usuário abre uma pauta priorizada, clica “Gerar texto” e, minutos depois, vê os cards e a legenda;
clica “Gerar imagens” e vê o carrossel montado com o logo e as cores do escritório, pronto para
revisão.

## Limites e dependências

- **Inclui:** coleções `versoes_conteudo` e `kit_marca`; tela Marca; tela do item com abas Texto e Imagens; ações “Gerar texto” e “Gerar imagens”; tipos `gerar_texto` e `gerar_imagens` na fila; passagem do item para `em revisão`.
- **Fora de escopo:** roteiro de Reels e vídeo, biblioteca de referências, modelos reutilizáveis, publicação.
- **Entradas e pré-condições:** SPEC-1-002 (pauta em `roteiro/briefing`); SPEC-1-003 (fila funcionando); CL-005 (kit mínimo).
- **Saídas/artefatos:** versão `n` do item com cards, legenda, hashtags, imagens e selos.
- **Dependências e responsáveis:** Bellei e Peres; Héctor envia o logo e as cores; Maestro gera.
- **Atores e permissões mínimas:** usuário pede gerações; administrador mantém o kit; executor grava texto e imagens na versão da tarefa.
- **Superfícies/arquivos/configurações afetadas:** telas Marca e Item; coleções `versoes_conteudo` e `kit_marca`; armazenamento de arquivos do Skip Cloud.
- **Risco e plano B:** imagem fora do tamanho ou corrompida — o resultado é recusado (422) e a execução `falhou`, item `bloqueado` com motivo e “Reprocessar”; arte genérica — fica visível no selo e o revisor devolve com comentário.
- **Rollback ou reversão:** cada geração cria ou completa uma versão; versões anteriores nunca são apagadas.

## Dados e integrações

| Origem/destino | Fonte de verdade | Campos/contrato | Autenticação/permissão | Timeout/retry/idempotência | Tratamento de erro |
|---|---|---|---|---|---|
| `kit_marca` | este registro | `logo` (arquivo PNG/JPG até 5 MB), `cores` (2 a 4 códigos `#RRGGBB`), `atualizado_por`, `atualizado_em` | escrita: administrador; leitura: usuários e executor (link temporário na tarefa) | — | logo ausente ou cor inválida → não salva |
| `versoes_conteudo` | este registro | `item`, `numero` (1, 2, …), `cards` (lista de 3–10 textos, cada um até 300 caracteres; 1 para imagem única), `legenda` (até 2.200), `hashtags` (até 5), `imagens` (arquivos, um por card), `selos` (`gerado sem referência`, `fonte a validar` quando a pauta for “a validar”), `versao_config_perfil`, `publico_usado`, `comentario_contexto` (da devolução, quando houver), `execucao_texto`, `execucao_imagens` | criação pela ação “Gerar texto”; gravação de texto e imagens só pelo executor; ninguém edita versão já decidida | `gerar_texto` com a mesma chave aberta é recusado (RN-11); imagens repetidas para a mesma versão são ignoradas | número de cards fora de 3–10, legenda acima de 2.200 ou imagem fora de 1080 × 1350 → 422 e execução `falhou` |
| Tarefa `gerar_texto` | fila (SPEC-1-003) | entrada: pauta (título, descrição, fonte ou “a validar”), formato, perfil (público, áreas, tom, temas vedados) na versão gravada, comentário da devolução anterior; saída: `{cards[], legenda, hashtags[]}` | executor | ver SPEC-1-003 | tema vedado detectado → erro “tema vedado” e item `bloqueado` sem reprocessar |
| Tarefa `gerar_imagens` | fila (SPEC-1-003) | entrada: cards da versão, formato, link temporário do logo, cores; saída: arquivos na ordem dos cards | executor | ver SPEC-1-003 | quantidade de imagens diferente da de cards → 422 |

| Regra de negócio | Condição | Ação/resultado | Exceção | Fonte |
|---|---|---|---|---|
| RN-16 | “Gerar texto” num item em `roteiro/briefing` ou `ajustes solicitados` | Cria a versão n+1 e a tarefa `gerar_texto`; item → `em produção` | — | RQ-003 |
| RN-17 | Texto gravado | Libera “Gerar imagens” (se houver kit) | Sem kit → aviso “Envie o logo e as cores” | CL-005 |
| RN-18 | Imagens gravadas para todos os cards | Item → `em revisão` | — | RQ-006 |
| RN-19 | Pauta “a validar” | A versão leva o selo “fonte a validar”; o texto não afirma o fato como consolidado | — | RQ-002 |
| RN-20 | Público mudou no perfil desde a última geração | Nova geração usa a versão atual da configuração e registra a troca; a versão anterior mantém o público antigo | — | RQ-001 |

## Fluxo e regras

1. Administrador cadastra o kit na tela Marca.
2. No item priorizado, o usuário clica “Gerar texto” → versão n+1 e tarefa na fila; item `em produção`.
3. O Maestro devolve cards, legenda e hashtags; o usuário vê a aba Texto.
4. O usuário clica “Gerar imagens” → tarefa na fila; o Maestro devolve uma imagem por card.
5. Com todas as imagens gravadas, o item vai para `em revisão` (SPEC-1-005).

Instrução da tarefa `gerar_texto` para o Maestro: escrever para o público e o tom do perfil, em
linguagem simples e persuasiva, contando uma história útil, sem jargão desnecessário, sem promessa de
resultado e sem captação indevida (ética da OAB); não afirmar como fato o que vier marcado “a
validar”; card 1 é a chamada, o último card fecha com uma orientação ou convite à reflexão; aplicar o
comentário da devolução, quando houver.

Instrução da tarefa `gerar_imagens` para o Maestro: uma imagem 1080 × 1350 por card, com o texto do
card legível, as cores do kit e o logo em todas as imagens, no mesmo canto; sem pessoas reais
identificáveis e sem marcas de terceiros.

| Cenário | Dado/condição | Resultado esperado | Caminho de erro/recuperação |
|---|---|---|---|
| Principal | Pauta priorizada, kit cadastrado | Versão com cards, legenda e imagens; item `em revisão` | — |
| Limite | Sem kit | Texto gerado; imagens indisponíveis com aviso | Cadastrar o kit |
| Limite | Público trocado no perfil | Nova versão com o novo público; anterior inalterada | — |
| Falha | Maestro devolve 12 cards ou imagem 1080 × 1080 | 422; execução `falhou`; item `bloqueado` | “Reprocessar” |

## Instruções de execução para o Ethos (Maestro)

1. **Ler antes de alterar:** esta SPEC e as SPECs 1-001, 1-002 e 1-003.
2. **Alterar somente:** coleções `versoes_conteudo` e `kit_marca`, telas Marca e Item, tipos `gerar_texto` e `gerar_imagens`.
3. **Não alterar:** regras da fila, estados de revisão e publicação.
4. **Executar nesta ordem:** kit de marca → versão e `gerar_texto` → validações de tamanho → `gerar_imagens` → passagem a `em revisão` → testes do TDD.
5. **Parar e pedir validação quando:** o kit não chegar até 23/10 (seguir com texto e avisar no grupo); o Maestro não conseguir gerar imagens no tamanho pedido.
6. **Estado válido ao parar:** itens já gerados continuam com suas versões; nenhum item fica `em produção` sem execução aberta.

## Checklist de execução

- [ ] CL-005 recebido (logo e cores) e cadastrado.
- [ ] Geração de texto e de imagens funcionando para carrossel e imagem única.
- [ ] Validações de cards, legenda e tamanho testadas.
- [ ] Troca de público testada.
- [ ] Capturas e um carrossel de teste baixado em `05_entregas/fase-1/SPEC-1-004/`.

## Critérios de aceite

- [ ] **CA-1-12:** “Gerar texto” num item priorizado produz uma versão com 3 a 10 cards (ou 1, na imagem única), legenda até 2.200 caracteres e até 5 hashtags, com público e versão da configuração registrados e selo “gerado sem referência” (e “fonte a validar”, quando for o caso).
- [ ] **CA-1-13:** “Gerar imagens” produz uma imagem 1080 × 1350 por card, com o logo e as cores do kit, ligadas à mesma versão; com todas gravadas, o item vai para `em revisão`; sem kit, o botão fica indisponível com aviso.
- [ ] **CA-1-14:** resultado fora do contrato (quantidade de cards, tamanho da legenda ou da imagem) é recusado e deixa o item `bloqueado` com motivo e “Reprocessar”, sem criar versão nova.
- [ ] **CA-1-15:** depois de trocar o público no perfil, a nova geração usa o novo público e a versão anterior continua mostrando o público antigo.

## TDD da SPEC

| Etapa | Prova | Comando/ação | Resultado esperado | Evidência |
|---|---|---|---|---|
| RED | Sem validações, um resultado fora do contrato é aceito | Enviar pela rota de resultado (item de teste) 12 cards e uma imagem 1080 × 1080 | É aceito — falta a validação (CA-1-14) | `05_entregas/fase-1/SPEC-1-004/red.png` |
| GREEN | Geração completa | (1) cadastrar kit; (2) “Gerar texto” num carrossel de teste; (3) “Gerar imagens”; (4) repetir com imagem única | (1) kit salvo; (2) cards e legenda válidos com selos; (3) imagens 1080 × 1350 com logo e cores, item `em revisão`; (4) um card e uma imagem | `green-1..4.png` e imagens baixadas |
| REFACTOR/REGRESSÃO | Bordas e público | Repetir o RED (agora 422 e item `bloqueado`); remover o kit e ver o aviso; trocar o público para `pessoa_fisica` e gerar nova versão; reenviar as mesmas imagens | Recusa com motivo; botão indisponível; versão nova com o novo público e a anterior intacta; reenvio ignorado | `regressao.png` |

**Dados/fixtures:** perfil e pauta de teste das SPECs anteriores; kit de teste (logo qualquer em PNG e as cores `#1F3A5F` e `#C9A227`, trocadas depois pelo kit real); resultado inválido montado à mão para o RED.  
**Caminhos de erro obrigatórios:** contrato violado, kit ausente, tema vedado, reenvio.  
**Evidência exigida:** capturas e um carrossel de teste baixado.

## Handoff e operação

- **Como demonstrar:** abrir uma pauta priorizada, gerar texto e imagens e mostrar a versão com os selos.
- **Como operar depois:** gerar sempre a partir da pauta priorizada; atualizar o kit quando a marca mudar.
- **Como monitorar:** itens `em produção` há muito tempo ou `bloqueado`.
- **Pendência conhecida:** estilo ainda genérico até existir a biblioteca de referências.

## Tasks vinculadas

| ID | Task (fase 1 · título exato) | SPEC | Critério | Recorte da prova | Evidência esperada | Pré-condições |
|---|---|---|---|---|---|---|
| id pendente | Gerar o carrossel e a legenda a partir da pauta | SPEC-1-004 | CA-1-12 a CA-1-15 | TDD completo | capturas e carrossel de teste | SPECs 1-002 e 1-003 |
| id pendente | Enviar o logo e as cores do escritório | SPEC-1-004 | pré-condição CL-005 | — | logo e cores cadastrados na tela Marca | — |
| id pendente | Gerar o texto dos cards e a legenda | SPEC-1-004 | CA-1-12, CA-1-14 | RED, GREEN 2 e 4 (texto), REGRESSÃO (recusa) | versão com cards e legenda | pauta priorizada; fila funcionando |
| id pendente | Gerar as imagens do carrossel com a marca do escritório | SPEC-1-004 | CA-1-13 | GREEN 1, 3 e 4 (imagens), REGRESSÃO (sem kit, reenvio) | imagens baixadas | texto gerado; kit cadastrado |
| id pendente | Testar a troca de público numa nova geração | SPEC-1-004 | CA-1-15 | REGRESSÃO (troca de público) | duas versões com públicos diferentes | versão gerada |

## Emendas

| Data | Origem do sinal | Micro-spec/task | Motivo |
|---|---|---|---|
| | | | |
