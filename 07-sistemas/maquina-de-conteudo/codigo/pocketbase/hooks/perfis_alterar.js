// pocketbase/hooks/perfis_alterar.js
// Versiona o perfil a cada alteração efetiva e grava o histórico antes de salvar (RN-02, CA-1-02).
onRecordUpdateRequest((e) => {
  if (e.hasSuperuserAuth()) {
    return e.next()
  }
  const rec = e.record
  const orig = rec.original()
  const lerTemas = (r) => {
    let v = r.get('temas_vedados')
    if (typeof v === 'string') {
      try { v = JSON.parse(v) } catch (_) { v = [] }
    }
    if (Array.isArray(v) && v.length > 0 && typeof v[0] === 'number') {
      try { v = JSON.parse(String.fromCharCode.apply(null, v)) } catch (_) { v = [] }
    }
    if (!Array.isArray(v)) v = []
    return v.map((t) => String(t))
  }
  const temas = lerTemas(rec)
  if (!temas.includes('direito criminal')) {
    throw new BadRequestError('O perfil deve manter "direito criminal" nos temas vedados.')
  }
  const temasOrig = lerTemas(orig)
  const iguais = (a, b) => JSON.stringify(a) === JSON.stringify(b)
  const mudou =
    rec.getString('nome') !== orig.getString('nome') ||
    rec.getString('canal') !== orig.getString('canal') ||
    rec.getString('arroba') !== orig.getString('arroba') ||
    rec.getString('publico') !== orig.getString('publico') ||
    rec.getString('tom') !== orig.getString('tom') ||
    rec.getBool('ativo') !== orig.getBool('ativo') ||
    !iguais(rec.getStringSlice('areas'), orig.getStringSlice('areas')) ||
    !iguais(temas, temasOrig)
  if (!mudou) {
    return e.next()
  }
  const proxima = orig.getInt('versao_atual') + 1
  rec.set('versao_atual', proxima)
  const d = new Date()
  const z = (n) => String(n).padStart(2, '0')
  const agora = d.getUTCFullYear() + '-' + z(d.getUTCMonth() + 1) + '-' + z(d.getUTCDate()) + ' ' + z(d.getUTCHours()) + ':' + z(d.getUTCMinutes()) + ':' + z(d.getUTCSeconds()) + '.000Z'
  const col = $app.findCollectionByNameOrId('perfis_editoriais_versoes')
  const existentes = $app.findRecordsByFilter('perfis_editoriais_versoes', 'perfil = {:p} && versao = {:v}', '', 1, 0, rec.id, proxima)
  const h = existentes.length > 0 ? existentes[0] : new Record(col)
  if (existentes.length === 0) {
    h.set('perfil', rec.id)
    h.set('versao', proxima)
  }
  h.set('nome', rec.getString('nome'))
  h.set('canal', rec.getString('canal'))
  h.set('arroba', rec.getString('arroba'))
  h.set('publico', rec.getString('publico'))
  h.set('areas', rec.getStringSlice('areas'))
  h.set('tom', rec.getString('tom'))
  h.set('temas_vedados', temas)
  h.set('ativo', rec.getBool('ativo'))
  h.set('alterado_por', (e.auth && e.auth.id) || '')
  h.set('alterado_em', agora)
  $app.save(h)
  return e.next()
}, 'perfis_editoriais')