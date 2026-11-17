import * as Phaser from 'phaser';
import { Jogador } from './Jogador.js';
import { Entrada } from './Entrada.js';
import { criarArte } from './arte.js';
import { carregarArte } from './assets.js';
import { carregarPedro, criarPedro } from './pedro-animacoes.js';
import { criarMissao, coletarProduto, montarKit, objetivoMissao, criarProdutosCidade, META_KITS } from './missao.js';
import { ALTURA, MUNDO, DURACAO_SEGUNDOS, SHOWROOM, ZOOM_CIDADE, ZOOM_SHOWROOM, MODO_FACIL } from './config.js';
import { CAMPANHA } from '../data/campanha.js';
import { registrar } from '../services/metricas.js';
import { tocar } from '../services/som.js';

const LUGARES = [['clube',450],['fonte',1250],['cafe',2000],['igreja',2750],['posto',3450],['estatua',4100],['helicoptero',4550]];
const CHAO = 240;
const FIM_CIDADE = SHOWROOM.x - 620;
const FACHADA = SHOWROOM.x, INTERIOR = SHOWROOM.x + SHOWROOM.largura;
const ESCALA = SHOWROOM.largura / 1672;
const px = (base, x) => base + x * ESCALA, py = y => SHOWROOM.topo + y * ESCALA;
const $ = id => document.getElementById(id);

export class Aventura extends Phaser.Scene {
  constructor() { super('Aventura'); }
  preload() {
    this.falhas = [];
    const progresso = valor => { $('loading-texto').textContent = `Preparando a aventura · ${Math.round(valor*100)}%`; };
    const falhou = arquivo => this.falhas.push(arquivo.key);
    this.load.on('progress', progresso); this.load.on('loaderror', falhou);
    this.events.once('shutdown', () => { this.load.off('progress', progresso); this.load.off('loaderror', falhou); });
    carregarArte(this);
    for (const n of ['fachada','interior','caju','roma']) this.load.image(n, `assets/showroom/${n}.png`);
    carregarPedro(this);
  }
  create() {
    if (this.falhas.length) { this.game.events.emit('falha-assets'); this.scene.stop(); return; }
    $('loading').hidden = true;
    criarArte(this);
    for (const texture of this.textures.getTextureKeys()) this.textures.get(texture).setFilter(Phaser.Textures.FilterMode.NEAREST);
    this.fim = false; this.presentes = 0; this.tempo = 0; this.checkpoint = 80;
    this.proximoArremesso = 0; this.missao = criarMissao(); this.dialogoAberto = false;
    this.pedroPerto = false; this.vistaTravada = false; this.pedidoInteracao = false;
    this.estacoes = []; this.ultimoHUD = ''; this.uiAbort = new AbortController();
    $('fechar-dialogo').addEventListener('click', () => this.fecharDialogo(), { signal: this.uiAbort.signal });
    this.add.image(240, 0, 'ceu').setOrigin(0).setScale(1/3).setScrollFactor(0, 1);
    this.morros = this.add.tileSprite(240, 0, 480, ALTURA, 'morros').setOrigin(0).setTileScale(1/3).setScrollFactor(0, 1);
    this.casas = this.add.tileSprite(240, CHAO-ALTURA, 480, ALTURA, 'casas').setOrigin(0).setTileScale(1/3).setScrollFactor(0, 1);
    for (const [n, x] of LUGARES) this.add.image(x, CHAO, n).setOrigin(.5, 1).setScale(n === 'igreja' ? .3 : 1/3);
    for (let x = 150; x < FIM_CIDADE; x += 520) this.add.image(x, CHAO, x % 3 ? 'arvore' : 'arvore2').setOrigin(.5, 1).setScale(1/3);
    this.add.tileSprite(0, CHAO, FACHADA, 32, 'chao').setOrigin(0).setTileScale(1/3).setDepth(1);
    this.solidos = this.physics.add.staticGroup();
    const pisoCidade = this.add.zone(FACHADA/2, 256, FACHADA, 32);
    this.physics.add.existing(pisoCidade, true); this.solidos.add(pisoCidade);
    for (let x = 650; x < FIM_CIDADE; x += 600) {
      this.add.image(x, CHAO, 'caixa').setOrigin(.5, 1).setScale(1/3).setDepth(2);
      // O cesto ocupa apenas os 60 px inferiores da célula de 96 px: colisão acompanha a arte.
      const corpo = this.add.zone(x, CHAO-10, 32, 20);
      this.physics.add.existing(corpo, true); this.solidos.add(corpo);
    }
    this.criarShowroom();
    this.jogador = new Jogador(this, 80, CHAO).setDepth(5);
    this.physics.add.collider(this.jogador, this.solidos);
    this.physics.add.collider(this.jogador, this.plataformas);
    this.itens = this.physics.add.staticGroup();
    for (const item of criarProdutosCidade(FIM_CIDADE)) this.adicionarProduto(item.tipo, item.x, item.y);
    for (const [tipo, x, y] of this.itensShowroom) this.adicionarProduto(tipo, x, y);
    this.physics.add.overlap(this.jogador, this.itens, (_, item) => this.pegarProduto(item));
    this.capivaras = this.physics.add.group();
    for (let x = 950; x < FIM_CIDADE; x += 1200) {
      const c = this.capivaras.create(x, CHAO, 'capivara', 0).setOrigin(.5, 1).setScale(1/3);
      c.body.setSize(72, 48).setOffset(12, 24); c.setData('origem', x); c.play('capivara-andar');
    }
    this.physics.add.collider(this.capivaras, this.solidos);
    this.physics.add.overlap(this.jogador, this.capivaras, (j, c) => {
      if (c.getData('alimentada') || j.estaInvencivel(this.tempo * 1000)) return;
      const vida = j.levarDano(c.x, this.tempo * 1000);
      this.aviso('Tudo bem! Seus produtos estão guardados.', '#fff0d2');
      if (vida === 0) j.reposicionar(this.checkpoint, 200, this.tempo * 1000);
      this.atualizarHUD();
    });
    this.frutas = this.physics.add.group();
    this.physics.add.overlap(this.frutas, this.capivaras, (f, c) => {
      if (c.getData('alimentada')) return;
      f.destroy(); c.setData('alimentada', true); c.setVelocityX(0); c.play('capivara-comer');
      this.aviso('A capivara gostou do caju!', '#f5c875');
    });
    this.physics.world.setBounds(0, 0, MUNDO, ALTURA);
    const cam = this.cameras.main;
    cam.setZoom(ZOOM_CIDADE); cam.setBounds(0, 0, MUNDO, ALTURA); cam.startFollow(this.jogador, true, .15, .15); cam.setDeadzone(64, 56);
    this.entrada = new Entrada(this); this.atualizarHUD();
    this.events.once('shutdown', () => {
      this.uiAbort.abort(); $('controles').hidden = true; $('dialogo').hidden = true; $('interagir').hidden = true;
    });
  }
  adicionarProduto(tipo, x, y) {
    const item = this.itens.create(x, y, tipo).setScale(.42).setDepth(4).setData('tipo', tipo);
    item.refreshBody();
    // Contorno discreto de UI, sem halo borrado ou nova arte sobre o produto.
    const sinal = this.add.rectangle(x, y, item.displayWidth + 6, item.displayHeight + 6, 0, 0)
      .setStrokeStyle(.7, tipo === 'caju' ? 0xecc778 : 0xf3a5b1).setDepth(3);
    item.setData('sinal', sinal);
  }
  pegarProduto(item) {
    if (!item.active) return;
    const tipo = item.getData('tipo');
    item.getData('sinal')?.destroy(); item.destroy();
    coletarProduto(this.missao, tipo); this.presentes++; tocar('coleta');
    this.aviso(tipo === 'caju' ? '+1 Caju' : '+1 Romã', tipo === 'caju' ? '#f5cc73' : '#ffa5c0');
    this.atualizarHUD();
  }
  aviso(texto, cor = '#fff1d5') {
    if (!this.jogador) return;
    const t = this.add.text(this.jogador.x, this.jogador.y - 70, texto, {
      fontFamily: 'system-ui', fontSize: '8px', color: cor, backgroundColor: '#35263b', padding: { x: 3, y: 2 }, resolution: 3,
    }).setOrigin(.5).setDepth(10);
    this.tweens.add({ targets: t, y: t.y - 12, alpha: 0, delay: 400, duration: 450, onComplete: () => t.destroy() });
  }
  criarShowroom() {
    const { topo } = SHOWROOM;
    const FAIXAS = 10, LF = 2;
    for (let i = 0; i < FAIXAS; i++) this.add.image(FACHADA, topo, 'fachada').setOrigin(0).setScale(1/3)
      .setCrop(i*LF*3, 0, LF*3, 540).setAlpha((i+1)/(FAIXAS+1));
    this.add.image(FACHADA, topo, 'fachada').setOrigin(0).setScale(1/3).setCrop(FAIXAS*LF*3, 0, 960-FAIXAS*LF*3, 540);
    this.add.image(INTERIOR, topo, 'interior').setOrigin(0).setScale(1/3);
    this.add.image(FACHADA-4, CHAO, 'arvore2').setOrigin(.5, 1).setScale(1/3);
    const g = this.add.graphics();
    g.fillStyle(0x4a2c1c).fillRect(INTERIOR-3, topo, 6, 150); g.fillStyle(0xd9a765).fillRect(INTERIOR-2, topo, 2, 150);
    const piso = this.add.zone(FACHADA+SHOWROOM.largura, 255, SHOWROOM.largura*2, 30);
    this.physics.add.existing(piso, true); this.solidos.add(piso);
    this.plataformas = this.physics.add.staticGroup();
    const tampo = (x1, x2, y) => {
      const z = this.add.zone((x1+x2)/2, y+3, x2-x1, 6); this.physics.add.existing(z, true);
      const c = z.body.checkCollision; c.down = c.left = c.right = false; this.plataformas.add(z);
    };
    tampo(px(FACHADA,846), px(FACHADA,1082), py(657));
    tampo(px(FACHADA,1040), px(FACHADA,1640), py(432));
    tampo(px(INTERIOR,745), px(INTERIOR,1132), py(646));
    this.itensShowroom = [
      ['roma',px(FACHADA,330),210], ['caju',px(FACHADA,520),210],
      ['roma',px(FACHADA,960),py(657)-22], ['roma',px(FACHADA,1200),py(432)-18], ['caju',px(FACHADA,1420),py(432)-18],
      ['roma',px(INTERIOR,250),210], ['caju',px(INTERIOR,380),210],
      ['caju',px(INTERIOR,860),py(646)-25], ['roma',px(INTERIOR,1010),py(646)-25],
      ['caju',px(INTERIOR,1330),210], ['roma',px(INTERIOR,1520),210],
    ];
    const pedroX = px(FACHADA,694);
    this.pedro = criarPedro(this, pedroX, py(792)+3, .158).setDepth(2).setInteractive({ useHandCursor: true });
    this.pedro.off('animationcomplete-pedro-aceno');
    this.pedro.on('animationcomplete-pedro-aceno', () => this.pedro.play(this.dialogoAberto ? 'pedro-conversa' : 'pedro-parado'));
    this.pedro.on('pointerup', () => { if (this.pedroPerto) this.pedidoInteracao = true; });
    this.pedroX = pedroX;
    for (let i = 0; i < META_KITS; i++) {
      const x = INTERIOR + 155 + i*25;
      const visual = this.add.image(x, py(646), 'presente').setOrigin(.5, 1).setScale(.4).setAlpha(.3).setDepth(4);
      this.estacoes.push({ id: i, x, visual });
      this.add.text(x, 178, String(i+1), { fontSize: '8px', color: '#fff0cf', backgroundColor: '#49342c', resolution: 3 }).setOrigin(.5).setDepth(4);
    }
  }
  abrirDialogo() {
    this.dialogoAberto = true; this.entrada.ignorarAteSoltar();
    this.jogador.body.setVelocity(0, 0); this.physics.world.pause(); this.jogador.play('parado');
    this.pedro.play('pedro-conversa');
    $('dialogo-texto').textContent = `${CAMPANHA.boasVindasPedro} Cada kit leva um Caju e uma Romã. Vá até os três pontos da bancada e toque em “Montar kit”.`;
    $('dialogo').hidden = false; $('fechar-dialogo').focus({ preventScroll: true });
  }
  fecharDialogo() {
    if (!this.dialogoAberto) return;
    this.dialogoAberto = false; $('dialogo').hidden = true;
    this.entrada.ignorarAteSoltar(); this.physics.world.resume(); this.pedro.play('pedro-parado');
  }
  contextoInteracao() {
    if (this.pedroPerto) return { tipo: 'pedro', texto: 'Conversar · E / Enter' };
    const estacao = this.estacoes.find(e => !this.missao.estacoes.includes(e.id) && Math.abs(this.jogador.x-e.x) < 40);
    if (estacao && this.missao.fase === 'showroom') return { tipo: 'kit', texto: `Montar kit ${estacao.id+1} · E / Enter`, estacao };
    return null;
  }
  interagir(contexto) {
    if (!contexto) return;
    if (contexto.tipo === 'pedro') { this.abrirDialogo(); return; }
    if (!montarKit(this.missao, contexto.estacao.id)) {
      this.aviso('Pegue 1 Caju e 1 Romã para este kit.'); return;
    }
    contexto.estacao.visual.setAlpha(1); tocar('coleta');
    this.aviso(this.missao.kits === META_KITS ? 'Vitrine pronta! Obrigada por ajudar!' : `Kit pronto · ${this.missao.kits}/${META_KITS}`);
    this.atualizarHUD();
  }
  atualizarHUD() {
    const segundos = Math.max(0, Math.ceil(DURACAO_SEGUNDOS-this.tempo));
    const assinatura = [this.missao.coletados.caju, this.missao.coletados.roma, this.jogador.vida, segundos, this.missao.fase, this.missao.kits].join('|');
    if (assinatura === this.ultimoHUD) return;
    this.ultimoHUD = assinatura;
    $('presentes').textContent = `Caju ${this.missao.coletados.caju} · Romã ${this.missao.coletados.roma}`;
    $('vida').textContent = `${this.jogador.vida} ♥`;
    $('tempo').textContent = `${segundos}s`;
    $('tempo').classList.toggle('urgente', this.tempo >= DURACAO_SEGUNDOS-15);
    $('objetivo').textContent = objetivoMissao(this.missao);
    $('kits').textContent = `Kits ${this.missao.kits}/${META_KITS}`;
  }
  concluir(motivo) {
    if (this.fim) return;
    this.fim = true;
    registrar('conclusao', { presentes: this.presentes });
    this.game.events.emit('conclusao', { presentes: this.presentes, tempo: Math.round(this.tempo), motivo,
      caju: this.missao.coletados.caju, roma: this.missao.coletados.roma, kits: this.missao.kits });
    this.scene.stop();
  }
  atualizarCamera(delta) {
    const cam = this.cameras.main, x = this.jogador.x;
    const alvo = x > SHOWROOM.x-430 ? ZOOM_SHOWROOM : ZOOM_CIDADE;
    let z = cam.zoom+(alvo-cam.zoom)*Math.min(1,delta/260); if (Math.abs(z-alvo)<.01) z=alvo;
    if (z !== cam.zoom) cam.setZoom(z);
    const travada = z === ZOOM_SHOWROOM;
    if (travada !== this.vistaTravada) { this.vistaTravada=travada; cam.setBounds(0,travada?SHOWROOM.topo:0,MUNDO,travada?SHOWROOM.altura:ALTURA); }
    cam.setFollowOffset(this.jogador.olhandoDireita ? -40 : 40, 0);
    this.morros.tilePositionX = cam.scrollX*.15*3; this.casas.tilePositionX = cam.scrollX*.4*3;
  }
  update(_agora, delta) {
    if (this.fim || !this.entrada) return;
    this.entrada.atualizar();
    if (this.dialogoAberto) { if (this.entrada.interagirApertou) this.fecharDialogo(); return; }
    this.tempo += delta/1000;
    const agora = this.tempo*1000; // Relógio de jogo ativo: pausa e conversa não consomem invencibilidade.
    const soltou = this.jogador.atualizar(this.entrada, agora, delta, true);
    if (this.entrada.pularApertou) tocar('pulo');
    if (soltou && agora >= this.proximoArremesso) {
      this.proximoArremesso = agora+350;
      const dir = this.jogador.olhandoDireita ? 1 : -1;
      const f = this.frutas.create(this.jogador.x+dir*22, this.jogador.y-20, 'caju-fruta').setScale(1/3);
      f.body.setAllowGravity(false); f.setVelocityX(dir*260);
      this.time.delayedCall(1500, () => { if (f.active) f.destroy(); });
    }
    for (const c of this.capivaras.getChildren()) if (!c.getData('alimentada')) {
      const dir = Math.sin(agora/1800+c.getData('origem')) > 0 ? 1 : -1;
      c.setVelocityX(dir*MODO_FACIL.capivaraVelocidade); c.setFlipX(dir<0);
    }
    this.atualizarCamera(delta);
    const x = this.jogador.x;
    const perto = Math.abs(x-this.pedroX)<45;
    if (perto !== this.pedroPerto) { this.pedroPerto=perto; this.pedro.play(perto ? 'pedro-aceno' : 'pedro-parado'); }
    if (x > INTERIOR && this.missao.fase !== 'showroom') {
      this.missao.fase = 'showroom'; registrar('chegada_showroom'); this.aviso('Vamos montar os três kits na bancada!');
    }
    const contexto = this.contextoInteracao();
    $('interagir').hidden = !contexto;
    if (contexto && $('interagir').textContent !== contexto.texto) $('interagir').textContent = contexto.texto;
    if (this.entrada.interagirApertou || this.pedidoInteracao) { this.pedidoInteracao=false; this.interagir(contexto); }
    if (x > this.checkpoint+MODO_FACIL.checkpointDistancia || (x>FACHADA+20 && this.checkpoint<FACHADA)) this.checkpoint=x;
    const local = x>INTERIOR ? 'Showroom · monte a vitrine' : x>FACHADA+60 ? 'Pedro espera por você' : 'Pelas ruas de Itajubá';
    if ($('local').textContent !== local) $('local').textContent = local;
    this.atualizarHUD();
    if (this.tempo >= DURACAO_SEGUNDOS) this.concluir('tempo');
    else if (x > MUNDO-14 && this.missao.kits === META_KITS) this.concluir('vitrine');
    else if (x > MUNDO-14) $('objetivo').textContent = 'Antes de sair, monte os três kits na bancada ←';
  }
}
