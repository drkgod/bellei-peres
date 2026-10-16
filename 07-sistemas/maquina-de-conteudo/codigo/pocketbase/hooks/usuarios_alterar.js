// pocketbase/hooks/usuarios_alterar.js
// Executor sem aprovação e proteção do último administrador ativo (RN-03, RN-04).
onRecordUpdateRequest((e) => {
  if (e.hasSuperuserAuth()) {
    return e.next()
  }
  const rec = e.record
  const orig = rec.original()
  const papelNovo = rec.getString('papel')
  const aprovaNovo = rec.getBool('pode_aprovar')
  const ativoNovo = rec.getBool('ativo')
  if (papelNovo === 'executor' && aprovaNovo) {
    throw new BadRequestError('Usuário executor não pode aprovar conteúdo.')
  }
  if (orig.getString('papel') === 'administrador' && (papelNovo !== 'administrador' || !ativoNovo)) {
    const outros = $app.findRecordsByFilter('users', "papel = 'administrador' && ativo = true && id != {:id}", '', 1, 0, rec.id)
    if (outros.length === 0) {
      throw new BadRequestError('Não é possível remover o último administrador ativo.')
    }
  }
  return e.next()
}, 'users')