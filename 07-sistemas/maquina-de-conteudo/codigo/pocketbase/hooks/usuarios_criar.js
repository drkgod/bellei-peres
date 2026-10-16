// pocketbase/hooks/usuarios_criar.js
// Padrões de cadastro, executor sem aprovação e primeira conta como administrador (RN-03).
onRecordCreateRequest((e) => {
  if (e.hasSuperuserAuth()) {
    return e.next()
  }
  const rec = e.record
  if (!rec.getString('papel')) {
    rec.set('papel', 'usuario')
  }
  if (rec.get('pode_aprovar') == null) {
    rec.set('pode_aprovar', false)
  }
  if (rec.get('ativo') == null) {
    rec.set('ativo', true)
  }
  rec.set('emailVisibility', true)
  if (rec.getString('papel') === 'executor' && rec.getBool('pode_aprovar')) {
    throw new BadRequestError('Usuário executor não pode aprovar conteúdo.')
  }
  const existentes = $app.findRecordsByFilter('users', "id != ''", '', 1, 0)
  if (existentes.length === 0) {
    rec.set('papel', 'administrador')
  }
  return e.next()
}, 'users')