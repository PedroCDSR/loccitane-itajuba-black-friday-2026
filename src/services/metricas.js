// Sem rede por padrão. Integre um provedor anônimo aqui; nunca inclua nome ou mensagem.
const PERMITIDOS = new Set(['inicio', 'conclusao', 'clique_oferta', 'clique_compartilhar', 'encaminhamento_whatsapp']);
export function registrar(nome, dados = {}) {
  if (!PERMITIDOS.has(nome)) return;
  const detail = { evento: nome, presentes: Number.isFinite(dados.presentes) ? dados.presentes : undefined };
  window.dispatchEvent(new CustomEvent('campanha:metrica', { detail }));
  if (import.meta.env.DEV) console.info('[campanha]', detail);
}
