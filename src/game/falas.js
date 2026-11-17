// Falas em páginas curtas para a caixa de diálogo (creme e vinho, texto revelado aos poucos).
// Quebra nas frases; junta frases curtas até ~limite caracteres por página. Sem Phaser (testado em tests/falas.test.js).
export const LIMITE_PAGINA = 96;
export function paginar(texto, limite = LIMITE_PAGINA) {
  const frases = [];
  for (const frase of String(texto).trim().split(/(?<=[.!?…:])\s+(?=[A-ZÀ-Ú“"'])/u)) {
    // frase longa demais para uma página: quebra na última vírgula antes do limite
    const corte = frase.length > limite ? frase.lastIndexOf(', ', limite) : -1;
    if (corte > limite / 3) frases.push(frase.slice(0, corte + 1), frase.slice(corte + 2)); else frases.push(frase);
  }
  const paginas = [];
  for (const frase of frases) {
    const ultima = paginas.at(-1);
    if (ultima && ultima.length + 1 + frase.length <= limite) paginas[paginas.length - 1] = `${ultima} ${frase}`;
    else paginas.push(frase);
  }
  return paginas.length ? paginas : [''];
}
