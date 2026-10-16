// pocketbase/hooks/perfis_versao_inicial.js
// Grava a versão 1 do perfil no histórico imutável depois da criação (CA-1-02).
onRecordAfterCreateSuccess((e) => {
  try {
    const rec = e.record
    let temas = rec.get('temas_vedados')
    if (typeof temas === 'string') {
      try { temas = JSON.parse(temas) } catch (_) { temas = [] }
    }
    if (Array.isArray(temas) && temas.length > 0 && typeof temas[0] === 'number') {
      try { temas = JSON.parse(String.fromCharCode.apply(null, temas)) } catch (_) { temas = [] }
    }
    if (!Array.isArray(temas)) temas = []
    const d = new Date()
    const z = (n) => String(n).padStart(2, '0')
    const agora = d.getUTCFullYear() + '-' + z(d.getUTCMonth() + 1) + '-' + z(d.getUTCDate()) + ' ' + z(d.getUTCHours()) + ':' + z(d.getUTCMinutes()) + ':' + z(d.getUTCSeconds()) + '.000Z'
    const col = $app.findCollectionByNameOrId('perfis_editoriais_versoes')
    const h = new Record(col)
    h.set('perfil', rec.id)
    h.set('versao', 1)
    h.set('nome', rec.getString('nome'))
    h.set('canal', rec.getString('canal'))
    h.set('arroba', rec.getString('arroba'))
    h.set('publico', rec.getString('publico'))
    h.set('areas', rec.getStringSlice('areas'))
    h.set('tom', rec.getString('tom'))
    h.set('temas_vedados', temas)
    h.set('ativo', rec.getBool('ativo'))
    h.set('alterado_por', rec.getString('ultima_alteracao_por'))
    h.set('alterado_em', agora)
    $app.save(h)
  } catch (err) {
    $app.logger().error('falha ao gravar a versao 1 do perfil', { perfil: e.record.id, erro: String(err) })
  } finally {
    e.next()
  }
}, 'perfis_editoriais')