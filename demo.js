(function () {
  var B = '/gr-vagas-demo';
  var MSG = 'Na demonstração nada é enviado nem salvo.';
  function aviso(t) {
    var el = document.getElementById('demo-aviso');
    if (!el) { el = document.createElement('div'); el.id = 'demo-aviso'; el.setAttribute('role', 'status'); document.body.appendChild(el); }
    el.textContent = t || MSG; el.className = 'mostra';
    clearTimeout(aviso.t); aviso.t = setTimeout(function () { el.className = ''; }, 3200);
  }
  function ir(p) { location.href = B + p; }
  document.addEventListener('submit', function (e) {
    var f = e.target;
    var post = (f.getAttribute('method') || '').toLowerCase() === 'post' || /^javascript:/.test(f.getAttribute('action') || '') || f.querySelector('input[name^="$ACTION"]');
    if (!post) return;
    e.preventDefault(); e.stopImmediatePropagation();
    var quem = ((f.querySelector('[name=email]') || {}).value || '') + ' ' + ((e.submitter && e.submitter.textContent) || '');
    quem = quem.toLowerCase();
    var p = location.pathname;
    if (/sair/.test((e.submitter && e.submitter.textContent || '').toLowerCase())) return ir('/');
    if (/\/entrar\/$/.test(p)) {
      if (/empresa/.test(quem)) return ir('/painel/');
      if (/candidato/.test(quem)) return ir('/candidato/');
      return aviso('Na demonstração, entre com empresa@teste.com ou candidato@teste.com.');
    }
    if (/\/criar-conta\/$/.test(p)) {
      var t = f.querySelector('input[name=tipo]:checked');
      return ir(t && t.value === 'contratante' ? '/painel/' : '/candidato/');
    }
    aviso();
  }, true);
  var of = window.fetch;
  window.fetch = function (i, o) {
    var m = ((o && o.method) || (i && i.method) || 'GET').toUpperCase();
    if (m === 'GET' || m === 'HEAD') return of.apply(this, arguments);
    var h = (o && o.headers) || {};
    var acao = h['Next-Action'] || h['next-action'] || (h.get && h.get('next-action'));
    aviso();
    if (acao) return new Promise(function () {});
    return Promise.resolve(new Response(JSON.stringify({ ok: false, erro: MSG }), { status: 503, headers: { 'content-type': 'application/json' } }));
  };
})();
