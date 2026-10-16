// pocketbase/hooks/perfis_criar.js
// Criação do perfil editorial: valida temas vedados, grava versão 1 e quem alterou (RN-01, RN-02, CA-1-01).
onRecordCreateRequest((e) => {
  if (e.hasSuperuserAuth()) {
    return e.next()
  }
  const rec = e.record
  let temas = rec.get('temas_vedados')
  if (typeof temas === 'string') {
    try { temas = JSON.parse(temas) } catch (_) { temas = [] }
  }
  if (Array.isArray(temas) && temas.length > 0 && typeof temas[0] === 'number') {
    try { temas = JSON.parse(String.fromCharCode.apply(null, temas)) } catch (_) { temas = [] }
  }
  if (!Array.isArray(temas)) temas = []
  const lista = temas.map((t) => String(t))
  if (!lista.includes('direito criminal')) {
    throw new BadRequestError('O perfil deve manter "direito criminal" nos temas vedados.')
  }
  rec.set('versao_atual', 1)
  rec.set('ultima_alteracao_por', (e.auth && e.auth.id) || '')
  return e.next()
}, 'perfis_editoriais')