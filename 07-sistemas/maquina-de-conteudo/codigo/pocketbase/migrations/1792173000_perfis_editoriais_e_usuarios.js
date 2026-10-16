// pocketbase/migrations/1792173000_perfis_editoriais_e_usuarios.js
// SPEC-1-001: coleções do perfil editorial, histórico de versões e campos de usuários.
migrate(
  (app) => {
    const perfis = new Collection({
      name: 'perfis_editoriais',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: "@request.auth.papel = 'administrador'",
      updateRule: "@request.auth.papel = 'administrador'",
      deleteRule: null,
      fields: [
        { name: 'nome', type: 'text', required: true, max: 100 },
        { name: 'canal', type: 'select', required: true, maxSelect: 1, values: ['instagram'] },
        { name: 'arroba', type: 'text', required: true, max: 100 },
        { name: 'publico', type: 'select', required: true, maxSelect: 1, values: ['empresas', 'pessoa_fisica', 'ambos'] },
        { name: 'areas', type: 'select', required: true, maxSelect: 4, values: ['trabalhista', 'empresarial', 'civil', 'previdenciario'] },
        { name: 'tom', type: 'text', max: 500 },
        { name: 'temas_vedados', type: 'json' },
        { name: 'versao_atual', type: 'number', required: true, min: 1 },
        { name: 'ativo', type: 'bool' },
        { name: 'ultima_alteracao_por', type: 'text', max: 255 },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(perfis)

    const perfisId = app.findCollectionByNameOrId('perfis_editoriais').id
    const versoes = new Collection({
      name: 'perfis_editoriais_versoes',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: null,
      updateRule: null,
      deleteRule: null,
      fields: [
        { name: 'perfil', type: 'relation', required: true, collectionId: perfisId, maxSelect: 1, cascadeDelete: true },
        { name: 'versao', type: 'number', required: true, min: 1 },
        { name: 'nome', type: 'text', required: true, max: 100 },
        { name: 'canal', type: 'select', required: true, maxSelect: 1, values: ['instagram'] },
        { name: 'arroba', type: 'text', required: true, max: 100 },
        { name: 'publico', type: 'select', required: true, maxSelect: 1, values: ['empresas', 'pessoa_fisica', 'ambos'] },
        { name: 'areas', type: 'select', required: true, maxSelect: 4, values: ['trabalhista', 'empresarial', 'civil', 'previdenciario'] },
        { name: 'tom', type: 'text', max: 500 },
        { name: 'temas_vedados', type: 'json' },
        { name: 'ativo', type: 'bool' },
        { name: 'alterado_por', type: 'relation', collectionId: '_pb_users_auth_', maxSelect: 1 },
        { name: 'alterado_em', type: 'date', required: true },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE UNIQUE INDEX idx_versoes_perfil_versao ON perfis_editoriais_versoes (perfil, versao)',
      ],
    })
    app.save(versoes)

    const users = app.findCollectionByNameOrId('_pb_users_auth_')
    if (!users.fields.getByName('papel')) {
      users.fields.add(new SelectField({ name: 'papel', maxSelect: 1, values: ['administrador', 'usuario', 'executor'] }))
    }
    if (!users.fields.getByName('pode_aprovar')) {
      users.fields.add(new BoolField({ name: 'pode_aprovar' }))
    }
    if (!users.fields.getByName('ativo')) {
      users.fields.add(new BoolField({ name: 'ativo' }))
    }
    users.listRule = "@request.auth.id != ''"
    users.viewRule = "@request.auth.id != ''"
    users.createRule = "(@request.body.papel:isset = false || @request.body.papel = 'usuario') && (@request.body.pode_aprovar:isset = false || @request.body.pode_aprovar = false) || @request.auth.papel = 'administrador'"
    users.updateRule = "(id = @request.auth.id && @request.body.papel:isset = false && @request.body.pode_aprovar:isset = false && @request.body.ativo:isset = false) || @request.auth.papel = 'administrador'"
    users.deleteRule = null
    app.save(users)
  },
  (app) => {
    try { app.delete(app.findCollectionByNameOrId('perfis_editoriais_versoes')) } catch (_) {}
    try { app.delete(app.findCollectionByNameOrId('perfis_editoriais')) } catch (_) {}
    const users = app.findCollectionByNameOrId('_pb_users_auth_')
    for (const nome of ['papel', 'pode_aprovar', 'ativo']) {
      try { users.fields.removeByName(nome) } catch (_) {}
    }
    users.listRule = 'id = @request.auth.id'
    users.viewRule = 'id = @request.auth.id'
    users.createRule = ''
    users.updateRule = 'id = @request.auth.id'
    users.deleteRule = 'id = @request.auth.id'
    app.save(users)
  },
)