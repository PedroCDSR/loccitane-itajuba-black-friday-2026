// Métricas anônimas no GoatCounter (painel: https://loccitane-itajuba.goatcounter.com).
// Sem cookies e sem dados pessoais: só nomes fixos de eventos. Nunca enviar nome, telefone ou texto de mensagem.
// O script oficial (index.html) não conta em localhost; em teste local os eventos só aparecem no console.
// Na dev (dev--…netlify.app) visitas entram como /dev/… e eventos como dev/…, para não misturar com produção.
const EVENTOS = {
  inicio: 'partida-iniciada',
  chegada_showroom: 'chegou-showroom',
  cupom_roma: 'concluiu-roma',
  cupom_caju: 'concluiu-caju',
  cupom_bresil: 'concluiu-bresil',
  resgatar_roma: 'clique-resgatar-roma',
  resgatar_caju: 'clique-resgatar-caju',
  resgatar_bresil: 'clique-resgatar-bresil',
  compartilhou: 'compartilhou',
  compartilhar_cancelado: 'compartilhar-cancelado',
  compartilhar_fallback: 'compartilhar-fallback',
  instagram: 'clique-instagram',
  whatsapp: 'clique-whatsapp',
};
const fila = [];
function enviar(caminho) {
  const gc = typeof window !== 'undefined' ? window.goatcounter : undefined;
  if (!gc?.count) { if (fila.length < 30) fila.push(caminho); return; } // script ainda carregando (ou bloqueado)
  try { gc.count({ path: (location.hostname.startsWith('dev--') ? 'dev/' : '') + caminho, title: caminho, event: true }); } catch { /* métrica nunca quebra o jogo */ }
}
// Esvazia a fila quando o script do GoatCounter terminar de carregar.
if (typeof window !== 'undefined' && typeof setInterval === 'function') {
  const espera = setInterval(() => {
    if (!window.goatcounter?.count) return;
    clearInterval(espera);
    for (const c of fila.splice(0)) enviar(c);
  }, 1000);
  setTimeout(() => clearInterval(espera), 60000);
}
// `dados` é aceito por compatibilidade com chamadas antigas, mas nada dele é enviado.
export function registrar(nome, _dados = {}) {
  const caminho = EVENTOS[nome];
  if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') window.dispatchEvent(new CustomEvent('campanha:metrica', { detail: { evento: nome } }));
  if (import.meta.env?.DEV) console.info('[campanha]', nome, caminho ?? '(não enviado)');
  if (caminho) enviar(caminho);
}
