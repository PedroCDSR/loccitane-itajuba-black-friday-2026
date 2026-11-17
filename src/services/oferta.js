export function percentualSeguro(valor) {
  return typeof valor === 'number' && Number.isFinite(valor) ? Math.min(10, Math.max(0, valor)) : 0;
}
export function podeResgatar(c) {
  return c.oferta.ativa === true && percentualSeguro(c.oferta.descontoPercentual) > 0 &&
    c.oferta.descontoPercentual <= 10 && /^\d{12,13}$/.test(c.whatsapp) &&
    !!c.oferta.validade.trim() && !!c.oferta.condicoes.trim() &&
    !!c.privacidade.responsavel.trim() && !!c.privacidade.contato.trim() && !!c.privacidade.retencao.trim();
}
export function linkResgate(c, nome, presentes, marketing = false) {
  if (!podeResgatar(c)) throw new Error('Configuração comercial incompleta');
  const n = nome.trim().slice(0, 60);
  if (n.length < 2) throw new Error('Informe seu primeiro nome');
  const texto = `Olá! Sou ${n}. Joguei A Última Aventura e coletei ${presentes} presentes. Quero solicitar o benefício de ${percentualSeguro(c.oferta.descontoPercentual)}% da Black Friday Itajubá. Validade: ${c.oferta.validade}. Condições: ${c.oferta.condicoes}. Autorizo o atendimento para este resgate.${marketing ? ' Também autorizo receber novidades pelo WhatsApp.' : ''}`;
  return `https://wa.me/${c.whatsapp}?text=${encodeURIComponent(texto)}`;
}
export function linkCompartilhar(url) {
  const u = new URL(url); u.search = ''; u.hash = '';
  return `https://wa.me/?text=${encodeURIComponent('Uma última aventura por Itajubá! Jogue a Black Friday L’Occitane Itajubá: ' + u.href)}`;
}
