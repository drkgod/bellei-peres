# Construção — Bellei e Peres

## Alvo

Sistema de conteúdo do escritório no Skip, construído com o Maestro: perfil editorial e usuários,
pautas, geração de carrossel e legenda, revisão e aprovação, registro de publicação e calendário.
A fase 1 termina com o primeiro carrossel real aprovado e publicado pelo fluxo do sistema.

## Execução

- Leia `04_fase-atual/fase.md`, `04_fase-atual/specs/00-INDICE.md` e a SPEC da tarefa antes de
  alterar qualquer coisa. Siga a seção "Instruções de execução" da SPEC: o que pode e o que não pode
  ser alterado, a ordem e quando parar.
- Uma tarefa por vez. Rode o TDD da SPEC, registre a evidência em `05_entregas/` e peça o teste
  humano. Só marque `[x]` depois de prova e teste humano confirmados ("testei, pode seguir").
- Não invente perfil editorial, público, temas vedados, quem aprova, marca ou aceite: esses dados
  vêm do escritório. Se faltarem, pare e pergunte.
- Nada é publicado no Instagram sem aprovação registrada no sistema. Na fase 1 não há integração
  automática com rede social nem uso de API paga.
- Falha não apaga nem duplica item: o item com erro fica bloqueado com o motivo e pode ser
  reprocessado.

## Arquivos de tarefas

Mantenha o formato `<!-- fase-format:2 -->` de `fase.md`: IDs, status, responsável, prazo,
descrições e subtarefas. Não apague marcadores `<!-- id:… -->`. Novas tarefas podem ser
acrescentadas no fim da lista; elas entram no portal na próxima sincronização.

## Segurança

Nenhuma senha, chave, token ou dado sigiloso de cliente do escritório vai para esta pasta, para o
código ou para o histórico do Git. Variáveis secretas ficam somente nas configurações do Skip.
