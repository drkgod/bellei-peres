# Mapa — maquina-de-conteudo (versão Skip a0d29d7)

## Rotas
| Rota | Página | Componentes principais | Serviços |
|---|---|---|---|
| `/login` | Login | Card, Input | use-auth (entrar/cadastrar) |
| `/configuracao` | Configuracao | Table/Card de perfis, FormularioPerfil, HistoricoPerfil | perfis.ts |
| `/usuarios` | Usuarios | Table/Card de usuários, DialogoUsuario | usuarios.ts |
| `/` | Index | Navigate → /configuracao | — |

## Coleções
| Coleção | Campos principais | Regras de acesso (list/view/create/update/delete) |
|---|---|---|
| `perfis_editoriais` | nome, canal, arroba, publico, areas, tom, temas_vedados, versao_atual, ativo | l/v: autenticado; c/u: administrador; d: superusuário |
| `perfis_editoriais_versoes` | perfil(rel), versao, cópia dos campos, alterado_por(rel users), alterado_em | l/v: autenticado; c/u/d: superusuário (criado por hook) |
| `users` | + papel, pode_aprovar, ativo | l/v: autenticado; c: signup como usuário ou admin; u: self(sem papel/aprovar/ativo) ou admin; d: superusuário |

## Componentes reutilizáveis do projeto
- `src/components/ui/*` (shadcn): button, input, select, checkbox, textarea, dialog, alert-dialog, badge, card, table, skeleton, alert, label, form
- `src/lib/mensagens-erro.ts` (errosDeCampo, mensagemDeErro); `src/lib/formatos.ts` (formatarDataHora)
- `src/hooks/use-auth.tsx` (AuthProvider, useAuth, RotaProtegida)

## Padrões observados
- Acesso a dados só por `src/services/*`; pb nunca nos componentes.
- Formulários com react-hook-form + zodResolver + Form/FormField.
- Estados de carregando/vazio/erro/sucesso em toda tela com dados.
- Textos e mensagens em PT-BR.

## Arquivos gerados que não se editam
- `src/lib/pocketbase/client.ts`, `errors.ts`, `src/hooks/use-realtime.ts`, `src/components/ui/*`, `.skip.config.json`, `package.json`, lockfiles, `vite.config.ts`, `tsconfig*.json`, `.oxlintrc.json`, `.oxfmtrc.json`