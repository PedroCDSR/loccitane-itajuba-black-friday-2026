import { SHOWROOM, ALTURA_SHOWROOM } from './config.js';

// Showroom no celular em pé: com o zoom pela altura sobravam ~110 unidades de largura.
// Aqui ficam o enquadramento do celular em pé, o "mapa da loja" no alto (uma segunda câmera que mostra
// o showroom inteiro com as próprias artes) e as setas que apontam para o próximo objetivo.
export const MAPA = { y1: 125, y2: 255 }; // faixa vertical do showroom que aparece no mapa (estantes e chão)
export const LARGURA_MIN_SHOWROOM = 150; // largura mínima visível (unidades) no celular em pé
const LARGURA_TOTAL = SHOWROOM.largura * 2;
const CORES = { alvo: 0xf2c14e, jogadora: 0xc8323f, moldura: 0xfff4df, escuro: 0x1f3329 };

// Celular em pé: a tela do jogo é bem mais alta que larga.
export const emPe = (largura, altura) => altura > largura * 1.15;

// Enquadramento por tamanho de tela, sem Phaser (testável): altura do mapa, zoom e área visível do jogo.
export function enquadramento(largura, altura) {
  if (!emPe(largura, altura)) return { mapa: 0, zoom: altura / ALTURA_SHOWROOM };
  const mapa = Math.round(largura * (MAPA.y2 - MAPA.y1) / LARGURA_TOTAL);
  const zoom = Math.min((altura - mapa) / ALTURA_SHOWROOM, largura / LARGURA_MIN_SHOWROOM);
  return { mapa, zoom };
}

export class GuiaShowroom {
  constructor(scene) {
    this.scene = scene;
    const { x, topo } = SHOWROOM;
    // Abaixo do piso: um reflexo escurecido da faixa de baixo de cada arte, que some no verde do painel.
    // Só aparece quando o enquadramento do celular em pé mostra mais que os 180 de altura do showroom.
    this.base = [];
    for (const [i, nome] of ['fachada', 'interior'].entries()) {
      const tex = scene.textures.get(nome);
      if (!tex.has('base')) tex.add('base', 0, 0, 450, 960, 90);
      this.base.push(scene.add.image(x + i * SHOWROOM.largura, topo + SHOWROOM.altura, nome, 'base').setOrigin(0).setScale(1 / 3).setFlipY(true).setDepth(-1));
    }
    const sombra = scene.add.graphics().setDepth(-1);
    sombra.fillGradientStyle(CORES.escuro, CORES.escuro, CORES.escuro, CORES.escuro, .45, .45, 1, 1);
    sombra.fillRect(x, topo + SHOWROOM.altura, LARGURA_TOTAL, 30);
    sombra.fillStyle(CORES.escuro, 1).fillRect(x, topo + SHOWROOM.altura + 30, LARGURA_TOTAL, 200);
    this.base.push(sombra);

    // Mapa da loja: segunda câmera no alto da tela, com o showroom inteiro.
    this.mapa = scene.cameras.add(0, 0, 10, 10).setVisible(false).setBackgroundColor(CORES.escuro).setRoundPixels(true);
    this.marcasMapa = scene.add.graphics().setDepth(20);
    // Setas da tela principal (tamanho constante na tela: a escala acompanha o zoom).
    this.setas = [];
    this.apontadores = [];
    scene.cameras.main.ignore(this.marcasMapa);
    this.alturaMapa = 0;
  }

  // Objetos que só a câmera principal deve mostrar (avisos, setas).
  soNaPrincipal(obj) { this.mapa.ignore(obj); return obj; }

  criarSeta() {
    const s = this.scene, g = s.add.graphics();
    g.fillStyle(CORES.escuro, 1).fillTriangle(18, 0, 7, -8, 7, 8);
    g.fillStyle(CORES.alvo, 1).fillTriangle(16, 0, 8, -6, 8, 6);
    g.fillStyle(CORES.escuro, .88).fillCircle(0, 0, 9);
    g.lineStyle(1.5, CORES.alvo, 1).strokeCircle(0, 0, 9);
    const icone = s.add.image(0, 0, 'embalagem').setScale(.18);
    const c = s.add.container(0, 0, [g, icone]).setDepth(9).setVisible(false);
    c.setData('icone', icone); this.soNaPrincipal(c); return c;
  }
  criarApontador() {
    const g = this.scene.add.graphics().setDepth(9).setVisible(false);
    g.fillStyle(CORES.escuro, .9).fillTriangle(-6, -4, 6, -4, 0, 5);
    g.fillStyle(CORES.alvo, 1).fillTriangle(-4, -3, 4, -3, 0, 3);
    return this.soNaPrincipal(g);
  }

  // Liga o mapa e ajusta a câmera principal ao tamanho da tela; devolve o zoom usado.
  layout(ativo) {
    const s = this.scene, cam = s.cameras.main, w = s.scale.width, h = s.scale.height;
    const { mapa, zoom } = ativo ? enquadramento(w, h) : { mapa: 0, zoom: 0 };
    const mostrar = ativo && mapa > 0;
    if (this.alturaMapa !== (mostrar ? mapa : 0) || cam.height !== h - (mostrar ? mapa : 0) || cam.width !== w) {
      this.alturaMapa = mostrar ? mapa : 0;
      cam.setViewport(0, this.alturaMapa, w, h - this.alturaMapa);
      if (mostrar) {
        this.mapa.setViewport(0, 0, w, mapa).setZoom(w / LARGURA_TOTAL);
        this.mapa.centerOn(SHOWROOM.x + LARGURA_TOTAL / 2, (MAPA.y1 + MAPA.y2) / 2);
      }
    }
    this.mapa.setVisible(mostrar);
    for (const b of this.base) b.setVisible(mostrar);
    return zoom;
  }
  esconder() {
    this.mapa.setVisible(false); this.marcasMapa.clear();
    for (const o of [...this.setas, ...this.apontadores]) o.setVisible(false);
  }

  // alvos: [{ x, y, icone, frame?, escala? }] em unidades do mundo. Fora da tela vira seta na borda; dentro, um triângulo
  // que balança em cima do alvo. No mapa, o alvo pisca e a moldura mostra o pedaço visível.
  atualizar(alvos, jogadora, agora) {
    const cam = this.scene.cameras.main, v = cam.worldView, escala = this.scene.scale;
    // seta com ~38 px de diâmetro na tela, no celular e no computador (o canvas é reduzido para caber na página)
    const cssPorPx = (escala.displaySize?.width || escala.width) / escala.width;
    const esc = 38 / cssPorPx / (18 * cam.zoom);
    const margem = 12 * esc, balanco = Math.sin(agora / 160) * 2;
    while (this.setas.length < alvos.length) this.setas.push(this.criarSeta());
    while (this.apontadores.length < alvos.length) this.apontadores.push(this.criarApontador());
    alvos.forEach((a, i) => {
      const seta = this.setas[i], ap = this.apontadores[i];
      const dentro = a.x > v.x - 2 && a.x < v.right + 2 && a.y > v.y && a.y < v.bottom;
      ap.setVisible(dentro).setPosition(a.x, a.y - 14 + balanco).setScale(Math.min(1, esc));
      seta.setVisible(!dentro);
      if (!dentro) {
        const cx = Math.max(v.x + margem, Math.min(v.right - margem - 6 * esc, a.x));
        const cy = Math.max(v.y + margem + 10 * esc, Math.min(v.bottom - margem, a.y));
        seta.setPosition(cx + (a.x < v.x ? 1 : a.x > v.right ? -1 : 0) * Math.abs(balanco) * esc, cy).setScale(esc);
        seta.first.setRotation(Math.atan2(a.y - cy, a.x - cx));
        const icone = seta.getData('icone');
        icone.setTexture(a.icone, a.frame).setScale(a.escala ?? .2);
      }
    });
    for (let i = alvos.length; i < this.setas.length; i++) { this.setas[i].setVisible(false); this.apontadores[i].setVisible(false); }

    const g = this.marcasMapa; g.clear();
    if (!this.mapa.visible) return;
    const pisca = .55 + .45 * Math.sin(agora / 200);
    g.lineStyle(2, CORES.moldura, .9).strokeRect(v.x, Math.max(v.y, MAPA.y1 + 1), v.width, Math.min(v.bottom, MAPA.y2 - 1) - Math.max(v.y, MAPA.y1 + 1));
    for (const a of alvos) {
      g.lineStyle(5, CORES.escuro, .7 * pisca).strokeCircle(a.x, a.y, 11);
      g.lineStyle(3, CORES.alvo, pisca).strokeCircle(a.x, a.y, 11);
    }
    // a exploradora: um losango vermelho acima da cabeça
    const jx = jogadora.x, jy = jogadora.y - 52;
    g.fillStyle(CORES.moldura, 1).fillTriangle(jx - 8, jy, jx + 8, jy, jx, jy + 11).fillTriangle(jx - 8, jy, jx + 8, jy, jx, jy - 7);
    g.fillStyle(CORES.jogadora, 1).fillTriangle(jx - 5.5, jy, jx + 5.5, jy, jx, jy + 7.5).fillTriangle(jx - 5.5, jy, jx + 5.5, jy, jx, jy - 4.5);
  }
}
