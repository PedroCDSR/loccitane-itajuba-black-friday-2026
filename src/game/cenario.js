import * as Phaser from 'phaser';
// Peças de cenário desenhadas em código na mesma densidade da cidade (3 pixels de textura por unidade do mundo):
// a tendinha da L'Occitane e a bandeira que marca o fim da rua. Os produtos sobre o balcão reaproveitam as artes
// já carregadas (frascos de Caju e Romã, kit e sacola).
const K = 3;
const COR = {
  contorno: '#3b1d1c', vermelho: '#a8323d', vermelhoClaro: '#c94a52', vermelhoEscuro: '#7d2029', creme: '#f6e6c4', cremeSombra: '#dcc59a',
  madeira: '#9a6243', madeiraClara: '#c48a55', madeiraEscura: '#6f4236', ouro: '#e6b84a',
};

function textura(scene, chave, w, h, pintar) {
  if (scene.textures.exists(chave)) return;
  const t = scene.textures.createCanvas(chave, w * K, h * K), c = t.getContext();
  c.imageSmoothingEnabled = false;
  // r(): retângulo em unidades do mundo, arredondado à grade de textura
  const r = (x, y, a, b, cor) => { c.fillStyle = cor; c.fillRect(Math.round(x * K), Math.round(y * K), Math.max(1, Math.round(a * K)), Math.max(1, Math.round(b * K))); };
  const img = (chaveImg, x, y, a, b) => { const src = scene.textures.get(chaveImg).getSourceImage(); c.drawImage(src, Math.round(x * K), Math.round(y * K), Math.round(a * K), Math.round(b * K)); };
  pintar(r, img, c);
  t.refresh();
}

// Tendinha: 96 x 80 unidades, com a base na última linha. Toldo em y 6..30, balcão em y 50..80.
export const TENDA = { largura: 96, altura: 80, toldo: 8, balcao: 50 };
export function criarCenario(scene) {
  textura(scene, 'tenda', TENDA.largura, TENDA.altura, (r, img, c) => {
    const W = TENDA.largura;
    // postes
    for (const x of [7, W - 11]) { r(x, 20, 4, 60, COR.contorno); r(x + .7, 20, 2.6, 60, COR.madeira); r(x + .7, 20, .9, 60, COR.madeiraClara); }
    // balcão: tampo, frente em tábuas e barrado de pano creme com borda vermelha
    r(2, 48, W - 4, 32, COR.contorno);
    r(3, 49, W - 6, 4, COR.madeiraClara); r(3, 49, W - 6, 1.2, '#e3b27a');
    for (let x = 4; x < W - 4; x += 9) { r(x, 53, 8.3, 27, COR.madeira); r(x, 53, 1, 27, COR.madeiraClara); r(x + 7.3, 53, 1, 27, COR.madeiraEscura); }
    r(10, 56, W - 20, 18, COR.vermelhoEscuro); r(11, 57, W - 22, 16, COR.creme); r(11, 57, W - 22, 2, COR.vermelho); r(11, 71, W - 22, 2, COR.vermelho);
    // emblema simples no pano (disco vermelho com ramos claros), sem reproduzir o logotipo oficial
    r(W / 2 - 5, 59, 10, 10, COR.vermelho); r(W / 2 - 6, 60, 12, 8, COR.vermelho);
    for (const dx of [-3, -1, 1, 3]) r(W / 2 + dx - .4, 61 + Math.abs(dx) * .5, .9, 6 - Math.abs(dx), COR.creme);
    // produtos sobre o balcão (artes existentes, reduzidas)
    img('caju', 14, 34, 6, 15); img('roma', 22, 35, 6, 14); img('presente', 31, 37, 13, 12);
    img('caju', 54, 34, 6, 15); img('sacola', 62, 35, 12, 14); img('roma', 76, 35, 6, 14);
    // toldo listrado em leve perspectiva, com franja ondulada
    r(0, 6, W, 25, COR.contorno);
    for (let i = 0; i < 8; i++) {
      const x = 1 + i * (W - 2) / 8, w = (W - 2) / 8;
      r(x, 7, w, 22, i % 2 ? COR.creme : COR.vermelho);
      r(x, 7, w, 2, i % 2 ? '#fff6dc' : COR.vermelhoClaro);
      r(x, 25, w, 4, i % 2 ? COR.cremeSombra : COR.vermelhoEscuro);
    }
    for (let i = 0; i < 16; i++) {
      const x = i * W / 16, cor = Math.floor(i / 2) % 2 ? COR.creme : COR.vermelho;
      c.fillStyle = COR.contorno; c.beginPath(); c.arc((x + W / 32) * K, 30 * K, (W / 32 + .5) * K, 0, Math.PI); c.fill();
      c.fillStyle = cor; c.beginPath(); c.arc((x + W / 32) * K, 30 * K, (W / 32 - .2) * K, 0, Math.PI); c.fill();
    }
    // placa no topo com o nome em letras claras
    r(W / 2 - 22, 0, 44, 9, COR.contorno); r(W / 2 - 21, 1, 42, 7, COR.vermelho);
    c.fillStyle = COR.creme; c.font = `bold ${Math.round(5.2 * K)}px Georgia, serif`; c.textAlign = 'center'; c.textBaseline = 'middle';
    c.fillText('L’OCCITANE', (W / 2) * K, 4.8 * K);
  });

  // Bandeira vertical vermelha no fim da rua: 34 x 100 unidades, base na última linha.
  textura(scene, 'bandeira', 34, 100, (r, _img, c) => {
    r(14, 96, 12, 4, COR.contorno); r(15, 96, 10, 3, '#2f2d2c');                      // base
    r(9, 6, 2.4, 92, COR.contorno); r(9.6, 6, 1.2, 92, '#55504a');                     // mastro
    c.fillStyle = COR.contorno; c.beginPath();
    c.moveTo(11 * K, 84 * K); c.bezierCurveTo(10 * K, 50 * K, 11 * K, 18 * K, 30 * K, 4 * K);
    c.bezierCurveTo(34 * K, 20 * K, 31 * K, 50 * K, 26 * K, 86 * K); c.closePath(); c.fill();
    c.fillStyle = COR.vermelho; c.beginPath();
    c.moveTo(12 * K, 83 * K); c.bezierCurveTo(11 * K, 50 * K, 12 * K, 19 * K, 29.5 * K, 6 * K);
    c.bezierCurveTo(33 * K, 21 * K, 30 * K, 50 * K, 25 * K, 84.5 * K); c.closePath(); c.fill();
    c.fillStyle = COR.vermelhoClaro; c.fillRect(13 * K, 20 * K, 2 * K, 60 * K);
    c.save(); c.translate(21 * K, 58 * K); c.rotate(-Math.PI / 2);
    c.fillStyle = COR.creme; c.font = `bold ${Math.round(6.4 * K)}px Georgia, serif`; c.textAlign = 'center'; c.textBaseline = 'middle';
    c.fillText('L’OCCITANE', 0, 0); c.restore();
    c.fillStyle = COR.creme; c.beginPath(); c.arc(19.5 * K, 77 * K, 4.2 * K, 0, Math.PI * 2); c.fill();
    c.fillStyle = COR.vermelho; c.beginPath(); c.arc(19.5 * K, 77 * K, 3.1 * K, 0, Math.PI * 2); c.fill();
  });

  // Placa de madeira apontando para o showroom: 46 x 40 unidades.
  textura(scene, 'placa', 46, 40, (r, _img, c) => {
    r(21, 14, 4, 26, COR.contorno); r(21.8, 14, 2.4, 26, COR.madeira);
    c.fillStyle = COR.contorno; c.beginPath(); c.moveTo(1 * K, 2 * K); c.lineTo(38 * K, 2 * K); c.lineTo(45 * K, 9 * K); c.lineTo(38 * K, 16 * K); c.lineTo(1 * K, 16 * K); c.closePath(); c.fill();
    c.fillStyle = COR.madeiraClara; c.beginPath(); c.moveTo(2 * K, 3 * K); c.lineTo(37.5 * K, 3 * K); c.lineTo(43.5 * K, 9 * K); c.lineTo(37.5 * K, 15 * K); c.lineTo(2 * K, 15 * K); c.closePath(); c.fill();
    r(2, 3, 35, 1, '#e3b27a');
    c.fillStyle = COR.contorno; c.font = `bold ${Math.round(5 * K)}px Georgia, serif`; c.textAlign = 'center'; c.textBaseline = 'middle';
    c.fillText('SHOWROOM', 20 * K, 9.3 * K);
  });

  // Brilho pequeno para a montagem dos kits.
  if (!scene.textures.exists('brilho')) {
    const t = scene.textures.createCanvas('brilho', 9, 9), c = t.getContext();
    c.fillStyle = '#fff3c4'; c.fillRect(4, 0, 1, 9); c.fillRect(0, 4, 9, 1); c.fillStyle = '#ffd86b'; c.fillRect(3, 3, 3, 3); t.refresh();
  }
  for (const k of ['tenda', 'bandeira', 'placa', 'brilho']) scene.textures.get(k).setFilter(Phaser.Textures.FilterMode.NEAREST);
}
