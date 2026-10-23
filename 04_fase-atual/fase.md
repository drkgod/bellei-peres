# Fase 1 — Tarefas

<!-- fase-format:2 -->

Cada linha é uma tarefa da Jornada de Execução. **Tudo que cabe num card cabe nesta linha** — se um
campo não estiver aqui, ele não tem como ser preenchido, porque é este arquivo que cria a tarefa.

```
- [ ] Título da tarefa @responsável !30/09/2026 #projeto [interno]   <!-- id:… -->
      > descrição da tarefa, uma ou mais linhas
  - [ ] subtarefa (basta indentar 2 espaços)                         <!-- id:… -->
    - [ ] sub-subtarefa (indente mais 2)                             <!-- id:… -->
```

| marcador | o que define | se você não escrever |
|---|---|---|
| `- [ ]` / `- [/]` / `- [x]` | a fazer / em andamento / concluída | a fazer |
| `@nome` | responsável (`@"Nome Composto"` com aspas) | fica **sem responsável** |
| `!dd/mm/aaaa` | prazo | fica **sem prazo** |
| `#projeto` / `#aculturamento` | tipo | Projeto de IA |
| `[interno]` | o cliente **não** vê esta tarefa | o cliente vê |
| `> texto` na linha de baixo | descrição (aparece ao abrir o card) | sem descrição |
| indentar 2 espaços | vira subtarefa da tarefa acima (vale em qualquer profundidade) | tarefa de topo |

Os marcadores só valem **no fim da linha** — `Revisar #3 do contrato` continua sendo um título.
Um título que TERMINA na forma de um marcador sai escapado com `\\` (`Ligar para \\@joao`); a barra é
só para o parser e nunca aparece no card. Você não precisa escrever isso à mão.
Marque `[x]` para concluir e adicione linhas novas à vontade: elas entram no quadro na próxima
sincronização e voltam aqui com o `<!-- id:… -->` preenchido. **Não apague o marcador de id** das
tarefas que já têm um.

- [ ] Preparar o sistema e cadastrar o perfil e os usuários @"Bellei e Peres" !22/10/2026  <!-- id:dacedcdf-c814-4da8-9ddb-ba11465cb4e2 -->
  > Criar a base do sistema no Skip, com o perfil do Instagram do primeiro ciclo (público, áreas, tom e temas proibidos) e as pessoas que vão usar, marcando quem pode aprovar os conteúdos.
  > Pronto quando: o perfil está salvo com histórico de alterações e só um administrador consegue mudar quem aprova. Ref.: SPEC-1-001 · CA-1-01 a CA-1-03.
  - [ ] Fazer a call de início da Fase 1 @"Rodrigo Santos" !19/10/2026  <!-- id:e4a137d2-e949-400c-b308-e3b1bd88b5e8 -->
    > Call com o consultor para combinar a ordem da fase, confirmar o perfil do primeiro ciclo e quem pode aprovar, tirar dúvidas do escopo (reenviado no grupo) e combinar a rotina diária de revisão.
    > Ref.: SPEC-1-001 · pré-condições CL-007, CL-PEND-004 e CL-PEND-005.
  - [ ] Entrar no Skip com o próprio e-mail @"Bellei e Peres" !19/10/2026  <!-- id:ff94c4b1-0696-4ded-be54-1c147248e6e4 -->
    > Frederico, Ruth, Héctor e Bárbara aceitam o convite do Skip enviado em 29/09 e entram cada um com o seu e-mail (vale olhar a aba Promoções). O Frederico segue com o e-mail atual até a Adapta corrigir a grafia.
    > Ref.: SPEC-1-001 · pré-condição CL-001.
  - [ ] Criar a conta no GitHub e o projeto do sistema no Skip @"Bellei e Peres" !20/10/2026  <!-- id:d8ffc0c6-e5f7-4ad2-a246-deeca04ca99c -->
    > Criar a conta do escritório no GitHub e um projeto novo no Skip para a Máquina de Conteúdo; mandar o nome da conta e o link do projeto no grupo.
    > Ref.: SPEC-1-001 · pré-condições CL-002 e CL-003.
  - [x] Confirmar o perfil do Instagram e quem pode aprovar @"Bellei e Peres" !20/10/2026  <!-- id:cabc4cc3-aecc-45f7-89dc-7ac1844732de -->
    > Dizer qual perfil do Instagram entra primeiro (sugestão: o do escritório), o @ do perfil, quem vai usar o sistema e quem pode aprovar conteúdo; se houver outros temas proibidos além de direito criminal, informar também.
    > Ref.: SPEC-1-001 · pré-condições CL-PEND-004, CL-PEND-005 e CL-PEND-006.
  - [x] Cadastrar o perfil editorial com público, áreas e temas vedados @"Bellei e Peres" !21/10/2026  <!-- id:ae72d282-2e84-4a78-a8b8-f0d7a4fba325 -->
    > Na tela Configuração, salvar o perfil com público (empresas), áreas (trabalhista, empresarial, cível e previdenciário), tom e temas vedados; trocar o público uma vez para conferir que o histórico registra quem mudou e quando.
    > Ref.: SPEC-1-001 · CA-1-01, CA-1-02 · prova: GREEN 1–2 e REGRESSÃO.
  - [ ] Cadastrar os usuários e marcar quem pode aprovar @"Bellei e Peres" !22/10/2026  <!-- id:cef32408-a46a-481f-b816-a267f7354d97 -->
    > Na tela Usuários, cadastrar as pessoas com papel (administrador ou usuário) e a marcação “pode aprovar”; conferir que um usuário comum não consegue mudar essas marcações.
    > Ref.: SPEC-1-001 · CA-1-03 · prova: RED e GREEN 3.
- [ ] Ligar o Maestro ao sistema @"Bellei e Peres" !23/10/2026  <!-- id:04bf8454-f416-486d-b488-a1ad7282f5d1 -->
  > Fazer o Maestro do escritório pegar as tarefas do sistema, executar e devolver o resultado, com registro de cada tentativa e bloqueio do item quando algo falhar.
  > Pronto quando: a conexão está provada, a falha bloqueia o item com motivo e o reprocessamento não duplica nada. Ref.: SPEC-1-003 · CA-1-08 a CA-1-11.
  - [ ] Entrar no Maestro e colocar as informações do escritório @"Bellei e Peres" !20/10/2026  <!-- id:43826365-2275-44c1-9c2d-322730db6362 -->
    > Entrar no Maestro com o login enviado no grupo, conferir os créditos e escrever no chat quem é o escritório, as áreas, o tipo de cliente que querem e o que não querem (se quiserem, conectar a pasta do Drive com posts anteriores).
    > Ref.: SPEC-1-003 · pré-condições CL-001 e CL-006.
  - [ ] Testar a conexão do Maestro com a fila do sistema @"Bellei e Peres" !21/10/2026  <!-- id:a7942deb-8cdd-4ef7-b5b5-4c01850534fc -->
    > Primeira prova da fase: o Maestro lê uma tarefa de teste do sistema e devolve o resultado. Tentar primeiro pela conexão por URL; se não funcionar, pelo navegador do Maestro. Se nenhum dos dois funcionar, parar e chamar o consultor.
    > Ref.: SPEC-1-003 · CA-1-08 · prova: RED e GREEN 1–2 · evidência: caminho.md.
  - [ ] Registrar cada execução e bloquear o item que falhar @"Bellei e Peres" !22/10/2026  <!-- id:4f0b4b9c-5604-4857-822b-be60b1c24981 -->
    > Na tela Execuções, cada tarefa mostra tipo, tentativa, início, fim e resultado; um erro do Maestro (ou 2 horas sem resposta) deixa o item bloqueado com o motivo.
    > Ref.: SPEC-1-003 · CA-1-09, CA-1-10 · prova: GREEN 3.
  - [ ] Reprocessar um item bloqueado sem duplicar @"Bellei e Peres" !23/10/2026  <!-- id:81aa0b8f-9e6d-483a-aaa4-ed34f16cc476 -->
    > O botão Reprocessar cria a tentativa seguinte e, ao concluir, o item volta para onde estava, sem criar item, versão ou arquivo repetido.
    > Ref.: SPEC-1-003 · CA-1-10 · prova: REGRESSÃO (prazo, reprocessar, resultado repetido, assunção dupla).
  - [ ] Conferir que nenhuma senha ou chave aparece no sistema @"Bellei e Peres" !23/10/2026  <!-- id:a084ad0a-c96d-4775-b87f-fa296099a3b0 -->
    > Procurar o token da conexão e as senhas nas telas, comentários e registros; não pode aparecer em lugar nenhum, e chamada sem token é recusada. O token fica só no cofre do Skip Cloud e no campo de conexão do Maestro, nunca na conversa.
    > Ref.: SPEC-1-003 · CA-1-11 · prova: RED (sem token) e REGRESSÃO (busca de segredos).
- [ ] Montar a tela de pautas @"Bellei e Peres" !23/10/2026  <!-- id:3b3823f7-6827-4a46-b501-a8da05dd9170 -->
  > Tela onde o escritório registra pautas próprias e pede sugestões ao Maestro, com fonte ou selo “a validar”, prioridade e histórico.
  > Pronto quando: pauta manual, sugestões, prioridade, descarte e reabertura funcionam e tema proibido é barrado. Ref.: SPEC-1-002 · CA-1-04 a CA-1-07.
  - [ ] Registrar uma pauta manual @"Bellei e Peres" !22/10/2026  <!-- id:4a25b07c-254b-471d-a65e-b2c6145e02ac -->
    > Registrar uma pauta própria (por exemplo, uma decisão judicial recente) com perfil, público, área, formato e prioridade; pauta incompleta fica como ideia e não pode seguir.
    > Ref.: SPEC-1-002 · CA-1-04 · prova: RED (parte 1) e GREEN 1.
  - [ ] Pedir sugestões de pauta ao Maestro @"Bellei e Peres" !23/10/2026  <!-- id:fbd7fc16-16c3-4f6a-94ee-8b4707a19f67 -->
    > Botão “Pedir sugestões”: o Maestro pesquisa atualidades das áreas do escritório e devolve as sugestões com o link da fonte; sem fonte, a sugestão vem marcada “a validar”. Tema proibido não entra.
    > Ref.: SPEC-1-002 · CA-1-05, CA-1-07 · prova: GREEN 5 e REGRESSÃO.
  - [ ] Priorizar, descartar e reabrir pautas com motivo @"Bellei e Peres" !23/10/2026  <!-- id:42ef582c-8cc8-42cb-8d4c-7c942f107cf1 -->
    > Priorizar manda a pauta para a produção; descartar pede motivo; só quem pode aprovar reabre uma pauta descartada, e o histórico guarda tudo.
    > Ref.: SPEC-1-002 · CA-1-06 · prova: RED (parte 2), GREEN 2–4 e REGRESSÃO.
- [ ] Gerar o carrossel e a legenda a partir da pauta @"Bellei e Peres" !27/10/2026  <!-- id:f1f9041f-04ce-4a45-86c4-034fab4c6e14 -->
  > A partir de uma pauta priorizada, o Maestro escreve os cards e a legenda e depois gera as imagens com o logo e as cores do escritório; tudo fica numa versão pronta para revisão.
  > Pronto quando: carrossel (3 a 10 cards) e imagem única saem no tamanho do Instagram e resultado fora do padrão é recusado. Ref.: SPEC-1-004 · CA-1-12 a CA-1-15.
  - [ ] Enviar o logo e as cores do escritório @"Bellei e Peres" !20/10/2026  <!-- id:31a5c467-6e9e-440c-be68-fad60f055a59 -->
    > Mandar o logo em arquivo (PNG com fundo transparente, se tiver) e os códigos das cores, e cadastrar na tela Marca; os posts já feitos podem vir aos poucos.
    > Ref.: SPEC-1-004 · pré-condição CL-005.
  - [ ] Gerar o texto dos cards e a legenda @"Bellei e Peres" !26/10/2026  <!-- id:9e16e9b9-f5f7-41c9-b9d5-375c2818e795 -->
    > Botão “Gerar texto” na pauta priorizada: o Maestro devolve os cards e a legenda no tom do escritório, com o selo “gerado sem referência” (e “fonte a validar” quando for o caso).
    > Ref.: SPEC-1-004 · CA-1-12, CA-1-14 · prova: RED, GREEN 2 e 4 e REGRESSÃO (recusa).
  - [ ] Gerar as imagens do carrossel com a marca do escritório @"Bellei e Peres" !27/10/2026  <!-- id:4e1f0ad3-5049-428e-b7cf-32abd60cef71 -->
    > Botão “Gerar imagens”: uma imagem por card, no tamanho 1080 × 1350, com o logo e as cores; com todas prontas, a peça vai para revisão. Sem logo e cores, o botão avisa o que falta.
    > Ref.: SPEC-1-004 · CA-1-13 · prova: GREEN 1, 3 e 4 e REGRESSÃO.
  - [ ] Testar a troca de público numa nova geração @"Bellei e Peres" !27/10/2026  <!-- id:72509319-5bc5-483c-8445-9e365a3914a7 -->
    > Trocar o público do perfil (por exemplo, para pessoa física), gerar uma nova versão e conferir que só ela usa o novo público; a versão anterior continua como estava.
    > Ref.: SPEC-1-004 · CA-1-15 · prova: REGRESSÃO (troca de público).
- [ ] Montar a revisão e a aprovação @"Bellei e Peres" !28/10/2026  <!-- id:bfeace23-4e39-4dda-8ff4-99429cde0fe1 -->
  > Quem pode aprovar vê a lista “Aguardando revisão” e aprova, devolve com comentário (gera nova versão) ou arquiva; nada fica pronto para publicar sem aprovação.
  > Pronto quando: a primeira decisão encerra a versão e o sistema recusa “pronto” sem aprovação. Ref.: SPEC-1-005 · CA-1-16 a CA-1-19.
  - [ ] Mostrar a lista “Aguardando revisão” a quem pode aprovar @"Bellei e Peres" !27/10/2026  <!-- id:fe42cbab-4f19-4658-bf19-d42d5f7b0b9a -->
    > Toda peça em revisão aparece na lista e no contador para quem pode aprovar; quem não pode aprovar não vê os botões de decisão.
    > Ref.: SPEC-1-005 · CA-1-16 · prova: GREEN 1.
  - [ ] Devolver com comentário e gerar a nova versão @"Bellei e Peres" !28/10/2026  <!-- id:ad85dbf1-7e6a-4304-aca8-b0d9551680ac -->
    > Devolver pede comentário; a nova geração usa o comentário e cria a versão seguinte, guardando a anterior. A primeira decisão registrada vale; uma segunda na mesma versão é recusada.
    > Ref.: SPEC-1-005 · CA-1-17, CA-1-19 · prova: GREEN 2–4 e REGRESSÃO.
  - [ ] Bloquear “pronto para publicar” sem aprovação @"Bellei e Peres" !28/10/2026  <!-- id:f46417ef-b10a-4df1-aaca-67521fe789ee -->
    > Tentar marcar uma peça como pronta sem aprovação, pela tela e direto no sistema; as duas tentativas precisam ser recusadas.
    > Ref.: SPEC-1-005 · CA-1-18 · prova: RED e REGRESSÃO (400 e 403).
- [ ] Registrar a publicação e ver o calendário @"Bellei e Peres" !28/10/2026  <!-- id:528f5999-a747-420a-9815-86eca88c90cb -->
  > Depois de publicar manualmente no Instagram, registrar data, perfil e link; a peça vira publicada e aparece no calendário. Erro de publicação volta a peça para “pronto para publicar”.
  > Pronto quando: só link válido do Instagram é aceito e o calendário mostra o que saiu e o que está previsto. Ref.: SPEC-1-006 · CA-1-20 a CA-1-22.
  - [ ] Registrar a publicação com data, perfil e link @"Bellei e Peres" !28/10/2026  <!-- id:bd975428-875f-4c9f-9e79-935741d0a1ee -->
    > Na peça aprovada, baixar as imagens, copiar a legenda, publicar no Instagram e colar o link; link de outra rede, link repetido ou data futura são recusados.
    > Ref.: SPEC-1-006 · CA-1-20 · prova: RED, GREEN 1 e REGRESSÃO.
  - [ ] Registrar um erro de publicação e voltar o item para “pronto” @"Bellei e Peres" !28/10/2026  <!-- id:f414a290-5da5-4e21-9e1f-d62b28f2851d -->
    > Se o post saiu errado ou incompleto, registrar o erro com motivo e responsável; a peça volta para “pronto para publicar” e o histórico guarda o erro.
    > Ref.: SPEC-1-006 · CA-1-21 · prova: GREEN 3 e REGRESSÃO (arquivar pronto).
  - [ ] Ver as publicações no calendário @"Bellei e Peres" !28/10/2026  <!-- id:f85f83d9-7759-4dfe-a68d-6a67948ab191 -->
    > Calendário por perfil com os posts publicados (com link) e as peças prontas com data prevista; o sistema não publica nem agenda nada sozinho.
    > Ref.: SPEC-1-006 · CA-1-22 · prova: GREEN 2.
- [ ] Publicar o primeiro carrossel real pelo sistema @"Bellei e Peres" !30/10/2026  <!-- id:06fd5841-53b8-44d3-8e04-efb0a0d5b7b4 -->
  > Prova final da fase: uma pauta real do escritório vira carrossel publicado no Instagram, passando por devolução e aprovação, com os testes de erro repetidos e o aceite do consultor.
  > Pronto quando: o post está no ar com o link registrado, a regressão passou e o escritório contou o que achou. Ref.: SPEC-1-007 · CA-1-23 a CA-1-25.
  - [ ] Fazer o caminho completo com uma pauta real @"Bellei e Peres" !29/10/2026  <!-- id:00678cda-66ba-441c-8254-37b1898b4ae5 -->
    > Registrar a pauta real, gerar texto e imagens, devolver uma vez com comentário, aprovar a nova versão, publicar no Instagram e registrar o link no calendário.
    > Ref.: SPEC-1-007 · CA-1-23 · prova: RED e GREEN.
  - [ ] Repetir os testes de erro da fase @"Bellei e Peres" !29/10/2026  <!-- id:c3f8d767-34ca-457c-b1f9-c0550cb5fbd8 -->
    > Repetir as provas de erro de cada parte (pronto sem aprovação, troca de público, reabrir descartada, erro de publicação, falha do Maestro e busca de senhas) e anotar o resultado no relatório da fase.
    > Ref.: SPEC-1-007 · CA-1-24 · prova: REGRESSÃO · evidência: relatorio.md.
  - [ ] Contar o que gostaram e o que não gostaram do sistema @"Bellei e Peres" !29/10/2026  <!-- id:63a8fb24-2e18-41fd-8584-401ba3ac9b01 -->
    > Frederico e quem aprova revisam o carrossel real e escrevem no grupo ou nesta tarefa o que gostaram e o que não gostaram (texto, visual e facilidade de uso).
    > Ref.: SPEC-1-007 · CA-1-25 · teste humano CL-009.
  - [ ] Revisar as evidências e dar o aceite da fase @"Rodrigo Santos" !30/10/2026  <!-- id:cfaad3da-6ff7-4882-aeb8-f1253826eba0 -->
    > O consultor confere o relatório, o link do post e as capturas de cada parte e registra o aceite ou o que precisa voltar para ajuste.
    > Ref.: SPEC-1-007 · CA-1-25 (aceite).
  - [ ] Fazer a call de fechamento da Fase 1 @"Rodrigo Santos" !30/10/2026  <!-- id:47cfe900-af31-4b57-816f-8f7674c267c7 -->
    > Call de demonstração com o escritório para fechar a Fase 1 e decidir a passagem para a próxima etapa.
    > Ref.: SPEC-1-007 · CA-1-23 a CA-1-25 (decisão de fechamento).
