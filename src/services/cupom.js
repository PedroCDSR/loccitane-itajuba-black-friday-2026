export function linkCupomWhatsApp(numero, pagina) {
  if (!/^\d{12,13}$/.test(numero)) throw new Error('WhatsApp da loja inválido');
  const url = new URL(pagina);
  if (!['https:', 'http:'].includes(url.protocol)) throw new Error('Link do cupom inválido');
  const mensagem = `Olá! Quero resgatar meu cupom JOGO10 de 10% de desconto da L’Occitane Itajubá.\n\nMeu cupom:\n${url.href}`;
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
}
