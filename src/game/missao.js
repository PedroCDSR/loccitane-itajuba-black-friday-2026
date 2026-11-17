export const META_KITS = 3;
// Cada kit leva 1 Caju, 1 Romã e 1 caixa de presente. As caixas ficam no alto das estantes do showroom.
export const ITENS_MISSAO = ['caju', 'roma', 'caixa'];
export function criarMissao() {
  return { coletados: { caju: 0, roma: 0, caixa: 0 }, estoque: { caju: 0, roma: 0, caixa: 0 }, kits: 0, estacoes: [], fase: 'cidade' };
}
export function coletarProduto(missao, tipo) {
  if (!ITENS_MISSAO.includes(tipo)) return false;
  missao.coletados[tipo]++; missao.estoque[tipo]++; return true;
}
export function faltaParaKit(missao) {
  return ITENS_MISSAO.filter(t => missao.estoque[t] < 1);
}
export function montarKit(missao, estacao) {
  if (missao.fase !== 'showroom' || !Number.isInteger(estacao) || estacao < 0 || estacao >= META_KITS || missao.estacoes.includes(estacao)) return false;
  if (faltaParaKit(missao).length) return false;
  for (const t of ITENS_MISSAO) missao.estoque[t]--;
  missao.estacoes.push(estacao); missao.kits++; return true;
}
export function objetivoMissao(missao) {
  if (missao.kits === META_KITS) return 'Vitrine pronta! Siga para a saída à direita →';
  if (missao.fase === 'showroom') {
    if (missao.estoque.caixa < 1 && missao.coletados.caixa < META_KITS) return `Pegue as caixas de presente no alto das estantes · kits ${missao.kits}/${META_KITS}`;
    return `Leve tudo à bancada para montar os kits · ${missao.kits}/${META_KITS}`;
  }
  if (missao.fase === 'fachada') return 'Fale com Pedro na porta do showroom →';
  return 'Reúna Caju e Romã pela cidade · pule nas tendinhas →';
}
// Produtos da cidade a partir do traçado da rua (posições das tendas e dos cestos).
// - chão: um par garantido no caminho, para nunca faltar o mínimo da missão;
// - sobre os cestos: pega quem salta por cima;
// - no alto de cada tenda: só com o quique no toldo.
export function criarProdutosCidade({ chao, tendas, cestos, alturaCesto = 20, topoToldo }) {
  const produtos = [];
  const tipo = i => (i % 2 ? 'roma' : 'caju');
  [330, 1500, 2700, 3880].forEach((x, i) => produtos.push({ tipo: tipo(i), x, y: chao - 30, lugar: 'chao' }));
  cestos.forEach(([x, n], i) => produtos.push({ tipo: tipo(i + 1), x, y: chao - alturaCesto * n - 18, lugar: 'cesto' }));
  for (const x of tendas) {
    produtos.push({ tipo: 'caju', x: x - 10, y: topoToldo - 86, lugar: 'alto' });
    produtos.push({ tipo: 'roma', x: x + 22, y: topoToldo - 80, lugar: 'alto' });
  }
  return produtos;
}
