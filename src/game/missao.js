export const META_KITS = 3;
// Cada kit leva 1 Caju, 1 Romã e 1 caixa de presente. As três caixas ficam no alto das estantes do interior.
export const ITENS_MISSAO = ['caju', 'roma', 'caixa'];
// Tudo o que se coleta e aparece nos contadores do HUD. Capim-Limão é coleção: não entra na receita dos kits.
export const PRODUTOS = ['caju', 'capim', 'roma', 'caixa'];
export function criarMissao() {
  return { coletados: { caju: 0, capim: 0, roma: 0, caixa: 0 }, estoque: { caju: 0, capim: 0, roma: 0, caixa: 0 }, kits: 0, estacoes: [], fase: 'cidade', conversouKarina: false };
}
export function coletarProduto(missao, tipo) {
  if (!PRODUTOS.includes(tipo)) return false;
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
// `sala` diz onde a exploradora está: quem já chegou ao showroom pode voltar para passear pela cidade.
export function objetivoMissao(missao, sala) {
  if (sala === 'cidade' && missao.fase !== 'cidade') {
    if (missao.kits === META_KITS) return 'Vitrine pronta! Passeie à vontade · a bandeira leva de volta ao showroom →';
    const faltam = META_KITS - missao.kits;
    if (missao.estoque.caju < faltam || missao.estoque.roma < faltam) return 'Reúna mais Caju e Romã · a bandeira leva ao showroom →';
    return 'Passeie à vontade · a bandeira leva de volta ao showroom →';
  }
  if (missao.kits === META_KITS) return 'A Karina preparou uma surpresa para você!';
  if (missao.fase === 'showroom') {
    if (missao.estoque.caixa < 1 && missao.coletados.caixa < META_KITS) return `Pegue as caixas de presente no alto das estantes · kits ${missao.kits}/${META_KITS}`;
    return `Ajude a Karina: pegue as caixas nas prateleiras · ${missao.kits}/${META_KITS}`;
  }
  if (missao.fase === 'fachada') {
    if (!missao.conversouKarina) return 'Fale com a Karina na porta do showroom →';
    return 'Entre no showroom pela porta: as caixas estão no alto das estantes';
  }
  return 'Recupere os produtos e siga em frente até o showroom →';
}
// Produtos da cidade a partir do traçado da rua (posições das tendas e dos cestos). Caju, Romã e Capim-Limão
// em quantidades iguais (9 de cada), espalhados entre chão, cestos e tendas:
// - chão: 12 pontos entre os marcos, alternando os três (o primeiro Caju logo no começo da rua);
// - sobre os cestos: alternando os três, pega quem salta por cima;
// - no alto das tendas: um ou dois produtos por tenda, nunca os três juntos (só com o quique no toldo).
export const CHAO_PRODUTOS = [330, 600, 1000, 1450, 1900, 2200, 2480, 2950, 3250, 3550, 3880, 4250];
export const TOPO_TENDAS = [['caju', 'capim'], ['roma'], ['capim', 'roma'], ['caju'], ['roma', 'caju'], ['capim']];
export function criarProdutosCidade({ chao, tendas, cestos, alturaCesto = 20, topoToldo }) {
  const produtos = [], ciclo = ['caju', 'capim', 'roma'];
  CHAO_PRODUTOS.forEach((x, i) => produtos.push({ tipo: ciclo[i % 3], x, y: chao - 30, lugar: 'chao' }));
  cestos.forEach(([x, n], i) => produtos.push({ tipo: ciclo[(i + 2) % 3], x, y: chao - alturaCesto * n - 18, lugar: 'cesto' }));
  tendas.forEach((x, i) => {
    const tipos = TOPO_TENDAS[i % TOPO_TENDAS.length];
    if (tipos.length === 1) produtos.push({ tipo: tipos[0], x: x + 6, y: topoToldo - 88, lugar: 'alto' });
    else { produtos.push({ tipo: tipos[0], x: x - 10, y: topoToldo - 86, lugar: 'alto' }); produtos.push({ tipo: tipos[1], x: x + 22, y: topoToldo - 80, lugar: 'alto' }); }
  });
  return produtos;
}
