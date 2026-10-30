/* Studio 212 - contagem anonima das visitas e cliques (sem cookie, sem dado pessoal).
   Grava em site_eventos (so inserir). Uso: <script src="rastro.js" data-site="esquadrias" defer></script> */
(function () {
  var ENDP = 'https://lthnoznikcklenzjwxdh.supabase.co/rest/v1/site_eventos';
  var KEY = 'sb_publishable_O0Hy3xQCrTd7CRhwV-yFtg_CrfM47Zu';
  var me = document.currentScript, site = (me && me.getAttribute('data-site')) || 'esquadrias';
  function id(n) { var s = ''; var c = 'abcdefghijklmnopqrstuvwxyz0123456789'; for (var i = 0; i < n; i++) s += c[Math.floor(Math.random() * c.length)]; return s; }
  var vis; try { vis = localStorage.getItem('s212_v'); if (!vis) { vis = id(16); localStorage.setItem('s212_v', vis); } } catch (e) { vis = id(16); }
  var sess = id(12), ini = Date.now(), maxRol = 0, enviouSaida = false;
  var apar = (window.matchMedia && matchMedia('(max-width: 760px)').matches) ? 'celular' : 'computador';
  var pagina = (location.pathname.replace(/^\/[^/]+/, '') || '/').slice(0, 120);
  var q = new URLSearchParams(location.search);
  var origem = q.get('utm_source') || (document.referrer && document.referrer.indexOf(location.host) < 0 ? (function () { try { return new URL(document.referrer).hostname; } catch (e) { return ''; } })() : '');
  function manda(ev, extra) {
    var o = { site: site, visitante: vis, sessao: sess, evento: ev, pagina: pagina, aparelho: apar };
    for (var k in extra) o[k] = extra[k];
    try { fetch(ENDP, { method: 'POST', keepalive: true, headers: { apikey: KEY, 'Content-Type': 'application/json', Prefer: 'return=minimal' }, body: JSON.stringify(o) }).catch(function () {}); } catch (e) {}
  }
  manda('visita', { origem: (origem || '').slice(0, 200) });
  // cliques: botoes de baixar (topo/meio/fim), menu, links de fora
  var baixar = [].slice.call(document.querySelectorAll('a[href*="/releases/"]'));
  var lugares = ['topo', 'meio', 'fim'];
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a,button'); if (!a) return;
    var alvo;
    var i = baixar.indexOf(a);
    if (i >= 0) alvo = 'baixar (' + (lugares[i] || (i + 1)) + ')';
    else alvo = (a.getAttribute('data-rastro') || (a.textContent || '').trim().replace(/\s+/g, ' ') || a.getAttribute('href') || '?');
    manda('clique', { alvo: alvo.slice(0, 160) });
  }, true);
  addEventListener('scroll', function () {
    var h = document.documentElement, t = (h.scrollTop + innerHeight) / Math.max(1, h.scrollHeight);
    maxRol = Math.max(maxRol, Math.min(100, Math.round(t * 100)));
  }, { passive: true });
  function saida() { if (enviouSaida) return; enviouSaida = true; manda('rolagem', { rolagem: maxRol || Math.min(100, Math.round(innerHeight / Math.max(1, document.documentElement.scrollHeight) * 100)), tempo_s: Math.min(86400, Math.round((Date.now() - ini) / 1000)) }); }
  addEventListener('visibilitychange', function () { if (document.visibilityState === 'hidden') saida(); });
  addEventListener('pagehide', saida);
  addEventListener('error', function (e) { manda('erro', { alvo: String((e && e.message) || 'erro').slice(0, 160) }); });
})();
