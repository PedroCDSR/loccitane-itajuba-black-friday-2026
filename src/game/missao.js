export const META_KITS = 3;
export function criarMissao() {
  return { coletados: { caju: 0, roma: 0 }, estoque: { caju: 0, roma: 0 }, kits: 0, estacoes: [], fase: 'cidade' };
}
export function coletarProduto(missao, tipo) {
  if (!['caju', 'roma'].includes(tipo)) return false;
  missao.coletados[tipo]++; missao.estoque[tipo]++; return true;
}
export function montarKit(missao, estacao) {
  if (missao.fase !== 'showroom' || !Number.isInteger(estacao) || estacao < 0 || estacao >= META_KITS || missao.estacoes.includes(estacao)) return false;
  if (missao.estoque.caju < 1 || missao.estoque.roma < 1) return false;
  missao.estoque.caju--; missao.estoque.roma--; missao.estacoes.push(estacao); missao.kits++; return true;
}
export function objetivoMissao(missao) {
  if (missao.kits === META_KITS) return 'Vitrine pronta! Siga para a saída à direita →';
  if (missao.fase === 'showroom') return `Monte os kits na bancada · ${missao.kits}/${META_KITS}`;
  return 'Reúna Caju e Romã e leve os produtos ao showroom →';
}
export function criarProdutosCidade(fimCidade) {
  const produtos = [];
  // Pares acessíveis pelo chão; o salto só é necessário para bônus opcionais.
  for (let x = 240, i = 0; x < fimCidade + 260; x += 150, i++) produtos.push({ tipo: i % 2 ? 'roma' : 'caju', x, y: 210 });
  return produtos;
}
