import * as Phaser from 'phaser';
import { Jogador } from './Jogador.js';
import { Entrada } from './Entrada.js';
import { criarArte, criarCapivaraDormindo, criarZ } from './arte.js';
import { contatoCapivara, capivaraInofensiva, forcaQuique } from './capivaras.js';
import { criarCenario, TENDA } from './cenario.js';
import { Tutorial } from './Tutorial.js';
import { paginar } from './falas.js';
import { GuiaShowroom } from './guiaShowroom.js';
import { carregarArte } from './assets.js';
import { carregarPedro, criarPedro } from './pedro-animacoes.js';
import { carregarKarina, criarKarina } from './karina-animacoes.js';
import { criarMissao, coletarProduto, montarKit, objetivoMissao, criarProdutosCidade, faltaParaKit, META_KITS } from './missao.js';
import { ALTURA, MUNDO, SHOWROOM, ALTURA_CIDADE, MODO_FACIL } from './config.js';
import { desempenho } from '../data/recompensas.js';
import { CAMPANHA } from '../data/campanha.js';
import { registrar } from '../services/metricas.js';
import { tocar } from '../services/som.js';

// ---------- Traçado da rua (unidades do mundo) ----------
// Marcos de Itajubá na ordem real; árvores, tendas e cestos ficam só nos vãos entre eles.
const LUGARES = [['clube', 450], ['fonte', 1250], ['cafe', 2000], ['igreja', 2750], ['posto', 3450], ['estatua', 4100], ['helicoptero', 4550]];
const ARVORES = [[190, 'arvore2'], [660, 'arvore'], [1420, 'arvore2'], [2170, 'arvore'], [2925, 'arvore2'], [3590, 'arvore'], [4290, 'arvore2'], [4990, 'arvore']];
const TENDAS = [870, 1630, 2385, 3130, 3795, 4800];
const CESTOS = [[1065, 1], [1830, 2], [2575, 1], [3320, 2], [3985, 2], [4690, 1]]; // [x, quantos empilhados]
const CAPIVARAS = [1180, 2265, 3015, 3700, 4380];
const CHAO = 240;
const FACHADA = SHOWROOM.x, INTERIOR = SHOWROOM.x + SHOWROOM.largura;
const PORTAL = FACHADA - 46; // a bandeira do fim da rua: passou dela, a tela escurece e abre no showroom
// Volta ao showroom → cidade: andando para a esquerda no começo da fachada. As posições de chegada ficam longe
// dos dois gatilhos (PORTAL + 8 na rua, VOLTA na fachada) para a passagem nunca disparar em seguida, em loop.
const VOLTA = FACHADA + 12, CHEGADA_SHOWROOM = FACHADA + 34, CHEGADA_CIDADE = PORTAL - 40;
// Fachada (jardim, porta e Karina) e interior são duas telas separadas, com transição entre elas: andando para a
// direita no fim da fachada entra no showroom; para a esquerda no começo do interior volta ao jardim.
// A fachada nova é fechada: entra-se pela porta (botão "Entrar no showroom", E ou Enter), no centro da arte.
const PORTA = FACHADA + 157, PASSAGEM = 14, CHEGADA_INTERIOR = INTERIOR + 34, CHEGADA_JARDIM = PORTA;
const TRECHO = { fachada: FACHADA, interior: INTERIOR };
// Calçada da fachada: na arte ela desce levemente da esquerda (y 255) para a direita (y 241). A exploradora anda
// sobre ela, acompanhando a inclinação, e não no nível do jardim. O piso é feito de degraus de 4 unidades
// (0,18 de diferença cada), que a física sobe e desce sem travar.
const CALCADA = { esquerda: 255, direita: 241, degrau: 4 };
const chaoFachada = x => CALCADA.esquerda + (CALCADA.direita - CALCADA.esquerda) * Math.min(1, Math.max(0, (x - FACHADA) / SHOWROOM.largura));
// Pedro recebe a exploradora na praça (ao lado da fonte) e conta como a L’Occitane chegou a Itajubá.
// Karina (assets em personagens/karina/), a dona, atende no showroom: na porta e depois na bancada.
const PEDRO_ESCALA = .41, KARINA_ESCALA = .39; // alturas: exploradora 64, Karina 70, Pedro 78
const PEDRO_PRACA = 1330;
const DESENHADAS = ['tenda', 'placa', 'brilho', 'bandeira', 'capivara-dormindo', 'zzz'];
const ESCALA = SHOWROOM.largura / 1672; // as artes do showroom foram desenhadas em 1672 px de largura
const px = (base, x) => base + x * ESCALA, py = y => SHOWROOM.topo + y * ESCALA;
const $ = id => document.getElementById(id);

export class Aventura extends Phaser.Scene {
  constructor() { super('Aventura'); }
  preload() {
    this.falhas = [];
    const progresso = valor => { $('loading-texto').textContent = `Preparando a aventura · ${Math.round(valor * 100)}%`; const img = $('caju-partida'); if(img) { const n = [0,20,50,70,100].filter(n=>n<=valor*100).at(-1); img.src = `assets/carregamento/caju-${String(n).padStart(3,'0')}.png`; } };
    const falhou = arquivo => this.falhas.push(arquivo.key);
    this.load.on('progress', progresso); this.load.on('loaderror', falhou);
    this.events.once('shutdown', () => { this.load.off('progress', progresso); this.load.off('loaderror', falhou); });
    carregarArte(this);
    for (const n of ['fachada', 'interior', 'caju', 'roma', 'bandeira-jardim', 'logo-tenda', 'selo-tenda']) this.load.image(n, `assets/showroom/${n}.png`);
    this.load.image('capim', 'assets/produtos/capim-limao-colonia-sprite.png');
    carregarPedro(this); carregarKarina(this);
  }

  create() {
    if (this.falhas.length) { this.game.events.emit('falha-assets'); this.scene.stop(); return; }
    $('loading').hidden = true;
    // Texturas desenhadas em código: refeitas a cada partida e quando o navegador recupera o WebGL. No celular,
    // trocar de app pode descartar a memória de vídeo; sem isso, em "Jogar novamente" as tendas sumiam
    // (a colisão do toldo continuava e a exploradora ficava "no ar").
    for (const chave of DESENHADAS) if (this.textures.exists(chave)) this.textures.remove(chave);
    criarArte(this); criarCapivaraDormindo(this); criarZ(this); criarCenario(this);
    const refazer = () => { for (const chave of DESENHADAS) this.textures.get(chave)?.refresh?.(); };
    this.game.renderer?.on?.('restorewebgl', refazer);
    this.events.once('shutdown', () => this.game.renderer?.off?.('restorewebgl', refazer));
    for (const texture of this.textures.getTextureKeys()) this.textures.get(texture).setFilter(Phaser.Textures.FilterMode.NEAREST);
    this.fim = false; this.presentes = 0; this.tempo = 0; this.checkpoint = 80;
    this.proximoArremesso = 0; this.missao = criarMissao(); this.despedidaKarina = false; this.dialogoAberto = false; this.capivaraDoPisao = null;
    this.pedroPerto = false; this.pedroConversou = false; this.karinaPerto = false; this.karinaConversou = false; this.pedidoInteracao = false;
    this.estacoes = []; this.ultimoHUD = ''; this.avisoFaltaAte = 0;
    this.uiAbort = new AbortController();
    $('fechar-dialogo').addEventListener('click', () => this.avancarDialogo(), { signal: this.uiAbort.signal });
    $('pular-intro').addEventListener('click', e => { e.stopPropagation(); this.terminarIntro(); }, { signal: this.uiAbort.signal });
    // tocar na própria caixa também avança (primeiro completa o texto)
    $('dialogo').addEventListener?.('click', () => this.avancarDialogo(), { signal: this.uiAbort.signal });

    this.criarCidade();
    this.criarShowroom();
    this.jogador = new Jogador(this, 80, CHAO).setDepth(5);
    this.physics.add.collider(this.jogador, this.solidos);
    this.physics.add.collider(this.jogador, this.plataformas);
    // Toldo das tendas: ao cair sobre ele, quica alto (segurando PULAR vai mais alto).
    this.physics.add.collider(this.jogador, this.toldos, (j, toldo) => {
      if (!j.body.touching.down) return;
      j.quicar(this.entrada.pular ? 430 : 360); tocar('toldo'); this.tutorial?.concluir('toldo');
      const t = toldo.getData('visual'); // o toldo da fachada faz parte da arte de fundo: só quica
      if (t) this.tweens.add({ targets: t, scaleY: t.scaleY * .94, duration: 70, yoyo: true });
    });

    this.itens = this.physics.add.staticGroup();
    for (const p of criarProdutosCidade({ chao: CHAO, tendas: TENDAS, cestos: CESTOS, topoToldo: CHAO - TENDA.altura + TENDA.toldo })) this.adicionarItem(p.tipo, p.x, p.y);
    for (const [tipo, x, y] of this.itensShowroom) this.adicionarItem(tipo, x, y);
    this.physics.add.overlap(this.jogador, this.itens, (_, item) => this.pegarItem(item));

    this.capivaras = this.physics.add.group();
    for (const x of CAPIVARAS) {
      const c = this.capivaras.create(x, CHAO, 'capivara', 0).setOrigin(.5, 1).setScale(1 / 3).setDepth(4);
      c.body.setSize(72, 48).setOffset(12, 24); c.setData('origem', x); c.play('capivara-andar');
    }
    this.physics.add.collider(this.capivaras, this.solidos);
    // Cair em cima faz a capivara dormir (e quica); encostar de lado tira 1 coração.
    this.physics.add.overlap(this.jogador, this.capivaras, (j, c) => {
      const contato = contatoCapivara({ vy: j.body.velocity.y, baseAnterior: j.body.prev.y + j.body.height },
        { topo: c.body.top, dormindo: c.getData('dormindo'), alimentada: c.getData('alimentada') });
      if (contato === 'pisao') { this.adormecer(c); return; }
      if (contato !== 'dano' || j.estaInvencivel(this.tempo * 1000)) return;
      const vida = j.levarDano(c.x, this.tempo * 1000); tocar('dano');
      this.aviso('Ai! De lado ela empurra. Pise nela ou dê caju!', '#fff0d2');
      this.tutorial?.mostrar('dano', this.tempo * 1000, true);
      if (vida === 0) j.reposicionar(this.checkpoint, 200, this.tempo * 1000);
      this.atualizarHUD();
    });
    this.frutas = this.physics.add.group();
    this.physics.add.overlap(this.frutas, this.capivaras, (f, c) => {
      if (capivaraInofensiva({ dormindo: c.getData('dormindo'), alimentada: c.getData('alimentada') })) return;
      f.destroy(); c.setData('alimentada', true); c.setVelocityX(0); c.play('capivara-comer'); tocar('capivara'); this.tutorial?.concluir('caju');
      this.aviso('Nham! A capivara comeu feliz.', '#f5c875');
    });

    // Cidade e showroom são "salas" separadas: a câmera nunca mostra as duas ao mesmo tempo.
    this.physics.world.setBounds(0, 0, FACHADA, ALTURA);
    const cam = this.cameras.main;
    cam.setZoom(this.scale.height / ALTURA_CIDADE); cam.setBounds(0, 0, FACHADA, ALTURA); cam.startFollow(this.jogador, true, .15, .15); cam.setDeadzone(64, 56);
    this.sala = 'cidade'; this.trecho = 'fachada';
    this.guia = new GuiaShowroom(this); // setas para o próximo objetivo e enquadramento do celular em pé
    this.entrada = new Entrada(this);
    this.events.once('shutdown', () => {
      this.uiAbort.abort(); $('controles').hidden = true; $('dialogo').hidden = true; $('interagir').hidden = true;
      $('pular-intro').hidden = true; $('transicao').hidden = true; $('fechar-dialogo').hidden = true;
      this.tutorial?.esconder();
    });
    this.atualizarHUD();
    if (this.registry.get('comIntro')) this.comecarIntro(); else this.comecarJogo();
  }

  // ---------- Cidade ----------
  criarCidade() {
    this.add.image(240, 0, 'ceu').setOrigin(0).setScale(1 / 3).setScrollFactor(0, 1);
    this.morros = this.add.tileSprite(240, 0, 480, ALTURA, 'morros').setOrigin(0).setTileScale(1 / 3).setScrollFactor(0, 1);
    this.casas = this.add.tileSprite(240, CHAO - ALTURA, 480, ALTURA, 'casas').setOrigin(0).setTileScale(1 / 3).setScrollFactor(0, 1);
    for (const [n, x] of LUGARES) this.add.image(x, CHAO, n).setOrigin(.5, 1).setScale(n === 'igreja' ? .3 : 1 / 3);
    for (const [x, n] of ARVORES) this.add.image(x, CHAO, n).setOrigin(.5, 1).setScale(1 / 3);
    this.add.tileSprite(0, CHAO, FACHADA, 32, 'chao').setOrigin(0).setTileScale(1 / 3).setDepth(1);
    this.solidos = this.physics.add.staticGroup();
    const piso = this.add.zone(FACHADA / 2, 256, FACHADA, 32);
    this.physics.add.existing(piso, true); this.solidos.add(piso);
    // Cestos: a colisão acompanha só a parte visível da arte (os 20 de baixo da célula de 32).
    for (const [x, n] of CESTOS) {
      for (let i = 0; i < n; i++) this.add.image(x, CHAO - i * 20, 'caixa').setOrigin(.5, 1).setScale(1 / 3).setDepth(2);
      const corpo = this.add.zone(x, CHAO - 10 * n, 32, 20 * n);
      this.physics.add.existing(corpo, true); this.solidos.add(corpo);
    }
    // Tendas: balcão e toldo se atravessam por baixo; o toldo quica.
    this.plataformas = this.physics.add.staticGroup();
    this.toldos = this.physics.add.staticGroup();
    for (const x of TENDAS) {
      const visual = this.add.image(x, CHAO, 'tenda').setOrigin(.5, 1).setScale(1 / 3).setDepth(2);
      const topo = CHAO - TENDA.altura;
      this.umSentido(this.plataformas, x, topo + TENDA.balcao + 2, TENDA.largura - 12);
      const toldo = this.umSentido(this.toldos, x, topo + TENDA.toldo + 3, TENDA.largura - 4);
      toldo.setData('visual', visual);
    }
    this.pedro = criarPedro(this, PEDRO_PRACA, CHAO, PEDRO_ESCALA).setDepth(3).setInteractive({ useHandCursor: true });
    this.pedro.on('pointerup', () => { if (this.pedroPerto) this.pedidoInteracao = true; });
    this.add.image(PORTAL - 70, CHAO, 'placa').setOrigin(.5, 1).setScale(1 / 3).setDepth(2);
    // a mesma bandeira do jardim do showroom, recortada da arte da fachada (ferramentas/recortar_bandeira.py)
    this.add.image(PORTAL, CHAO + 2, 'bandeira-jardim').setOrigin(.5, 1).setScale(1 / 3).setDepth(2);
  }
  // Plataforma que só segura quem cai por cima.
  umSentido(grupo, x, y, largura) {
    const z = this.add.zone(x, y, largura, 6); this.physics.add.existing(z, true);
    const c = z.body.checkCollision; c.down = c.left = c.right = false; grupo.add(z); return z;
  }

  // Pisão: a capivara deita, fecha os olhos, respira devagar e solta "zzz". Fica inofensiva até o fim.
  adormecer(c) {
    const j = this.jogador;
    c.setData('dormindo', true); c.setVelocityX(0);
    j.quicar(forcaQuique(this.entrada.pular)); tocar('dormir'); this.tutorial?.concluir('pisao');
    this.aviso('Zzz… a capivara dormiu!', '#d8e6ff');
    this.dormir(c);
  }
  // Visual do sono (também usado na abertura): olhos fechados, respiração lenta e "zzz" subindo.
  dormir(c) {
    c.anims.stop(); c.setTexture('capivara-dormindo');
    const base = c.scaleY;
    this.tweens.add({ targets: c, scaleY: { from: base * .82, to: base }, duration: 180, ease: 'Back.out' });
    this.tweens.add({ targets: c, scaleY: base * .95, delay: 200, duration: 900, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
    // cabeça fica do lado para onde ela olha; os Z sobem em zigue-zague, crescem e somem
    const soltarZ = (i = 0) => {
      if (!c.active) return;
      const lado = c.flipX ? -1 : 1, z = this.add.image(c.x + lado * 9, c.y - 18, 'zzz').setScale(.55).setDepth(6);
      this.tweens.add({ targets: z, x: z.x + lado * 10, y: z.y - 22, scale: 1.1, duration: 1400, ease: 'Sine.out', onComplete: () => z.destroy() });
      this.tweens.add({ targets: z, alpha: { from: 1, to: 0 }, delay: 800, duration: 600 });
      this.tweens.add({ targets: z, angle: { from: -10, to: 10 }, duration: 350, yoyo: true, repeat: 1 });
      c.setData('proximoZ', this.time.delayedCall(i % 3 === 2 ? 900 : 450, () => soltarZ(i + 1)));
    };
    soltarZ();
  }

  // ---------- Showroom ----------
  criarShowroom() {
    const { topo } = SHOWROOM;
    this.add.image(FACHADA, topo, 'fachada').setOrigin(0).setScale(1 / 3);
    this.add.image(INTERIOR, topo, 'interior').setOrigin(0).setScale(1 / 3);
    // piso do interior (reto) e calçada da fachada (degraus finos seguindo a inclinação)
    const piso = this.add.zone(INTERIOR + SHOWROOM.largura / 2, 255, SHOWROOM.largura, 30);
    this.physics.add.existing(piso, true);
    this.pisoShowroom = [piso];
    for (let x = FACHADA; x < INTERIOR; x += CALCADA.degrau) {
      const topo = chaoFachada(x + CALCADA.degrau / 2), degrau = this.add.zone(x + CALCADA.degrau / 2, topo + 20, CALCADA.degrau, 40);
      this.physics.add.existing(degrau, true); this.pisoShowroom.push(degrau);
    }
    const tampo = (x1, x2, y) => this.umSentido(this.plataformas, (x1 + x2) / 2, y + 3, x2 - x1);
    // fachada fechada: só a calçada, a Karina e a porta (sem subir no toldo nem na marquise, pedido do Pedro)
    // interior: mesa e prateleiras só onde a arte tem tábua (medidas sobre interior.png, 17/11/2026).
    // Estante da esquerda: parte da esquerda (52–97) com tábua em 183; parte do meio (105–152) com tábua em 168 e
    // duas prateleirinhas de parede (129–152) em 209 e 190, que servem de degrau; topo das duas em 150.
    // Estante da direita (234–314): tábua em 185 e topo em 150.
    tampo(px(INTERIOR, 745), px(INTERIOR, 1132), py(646));
    for (const [x1, x2, y] of [[52, 153, 150], [52, 97, 183], [105, 152, 168], [129, 152, 190], [129, 152, 209], [234, 314, 150], [234, 314, 185]])
      tampo(INTERIOR + x1, INTERIOR + x2, y);
    // Itens do showroom: as três caixas no alto das estantes do interior (duas na da esquerda, uma na da direita)
    // e um par de reserva de Caju e Romã na calçada da fachada.
    this.itensShowroom = [
      ['caixa', INTERIOR + 72, 138], ['caixa', INTERIOR + 136, 138], ['caixa', INTERIOR + 296, 138],
      ['caju', FACHADA + 238, chaoFachada(FACHADA + 238) - 18], ['roma', FACHADA + 262, chaoFachada(FACHADA + 262) - 18],
    ];
    // Karina recebe na porta; depois da conversa ela entra e espera ao lado da bancada.
    this.karinaX = FACHADA + 122; // ao lado da porta, na frente do pilar de pedra
    this.karina = criarKarina(this, this.karinaX, chaoFachada(this.karinaX), KARINA_ESCALA).setDepth(3).setInteractive({ useHandCursor: true });
    this.karina.off('animationcomplete-karina-aceno');
    this.karina.on('animationcomplete-karina-aceno', () => this.karina.play(this.dialogoAberto ? 'karina-conversa' : 'karina-parada'));
    this.karina.on('pointerup', () => { if (this.karinaPerto) this.pedidoInteracao = true; });
    // na bancada ela fica uns passos à frente da parede, já sobre o piso (na linha da parede parecia flutuar)
    this.karinaBancada = criarKarina(this, INTERIOR + 229, CHAO + 10, KARINA_ESCALA).setDepth(3).setAlpha(0);
    this.karinaBancada.on('animationcomplete-karina-aceno', () => this.karinaBancada.play('karina-parada'));
    // Bancada: três lugares marcados; o kit se monta ao passar com os três itens.
    for (let i = 0; i < META_KITS; i++) {
      const x = INTERIOR + 160 + i * 20;
      const visual = this.add.image(x, py(646), 'presente').setOrigin(.5, 1).setScale(.3).setAlpha(.28).setDepth(4);
      this.estacoes.push({ id: i, x, visual });
    }
    this.placaCidade = this.add.text(FACHADA + 46, 128, '← ITAJUBÁ', { fontFamily: 'Georgia, serif', fontSize: '7px', color: '#fff4df', backgroundColor: '#304f3d', padding: { x: 3, y: 2 }, resolution: 4 })
      .setOrigin(.5).setDepth(6).setAlpha(.9); // no alto: não cobre a exploradora na chegada e aparece no celular em pé
    // placas das passagens entre o jardim e o interior
    const placa = { fontFamily: 'Georgia, serif', fontSize: '7px', color: '#fff4df', backgroundColor: '#7d2029', padding: { x: 3, y: 2 }, resolution: 4 };
    this.add.text(INTERIOR + 28, 128, '← FACHADA', { ...placa, backgroundColor: '#304f3d' }).setOrigin(.5).setDepth(6).setAlpha(.9);
    this.saida = this.add.text(MUNDO - 22, 186, 'SAÍDA →', { fontFamily: 'Georgia, serif', fontSize: '9px', color: '#fff4df', backgroundColor: '#7d2029', padding: { x: 3, y: 2 }, resolution: 4 })
      .setOrigin(.5).setDepth(6).setAlpha(0);
  }

  adicionarItem(tipo, x, y) {
    const textura = tipo === 'caixa' ? 'embalagem' : tipo;
    // Capim-Limão ocupa os 78 px do PNG; Caju e Romã, 67: ele fica 67/78 menor para parecerem do mesmo tamanho
    const item = this.itens.create(x, y, textura).setScale(tipo === 'caixa' ? .3 : tipo === 'capim' ? .42 * 67 / 78 : .42).setDepth(4).setData('tipo', tipo);
    item.refreshBody();
    // Sombra oval e flutuação leve: destaca sem caixa nem halo sobre a arte.
    const sinal = this.add.ellipse(x, y + item.displayHeight / 2 + 3, item.displayWidth + 4, 3, 0x2a1626, .35).setDepth(3);
    item.setData('sinal', sinal);
    this.tweens.add({ targets: item, y: y - 2, duration: 700 + (x * 13) % 300, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
  }
  pegarItem(item) {
    if (!item.active || this.estado !== 'jogo') return;
    const tipo = item.getData('tipo');
    item.getData('sinal')?.destroy(); item.destroy();
    coletarProduto(this.missao, tipo); this.presentes++; tocar(tipo);
    if (tipo === 'caixa') this.tutorial?.concluir('caixas');
    this.aviso({ caju: '+1 Caju', capim: '+1 Capim-Limão', roma: '+1 Romã', caixa: '+1 caixa de presente' }[tipo], { caju: '#f5cc73', capim: '#dbe9a6', roma: '#ffa5c0', caixa: '#fff1d5' }[tipo]);
    this.atualizarHUD();
  }
  aviso(texto, cor = '#fff1d5') {
    if (!this.jogador) return;
    const t = this.add.text(this.jogador.x, this.jogador.y - 62, texto, {
      fontFamily: 'system-ui', fontSize: '8px', color: cor, backgroundColor: '#35263b', padding: { x: 3, y: 2 }, resolution: 4,
    }).setOrigin(.5).setDepth(10);
    // No showroom o zoom é maior: aviso menor e sempre inteiro dentro da tela.
    if (this.sala === 'showroom') t.setScale(.72);
    const v = this.cameras.main.worldView, meia = t.displayWidth / 2 + 2;
    if (v.width > meia * 2) t.x = Math.max(v.x + meia, Math.min(v.right - meia, t.x));
    this.guia?.soNaPrincipal(t);
    this.tweens.add({ targets: t, y: t.y - 12, alpha: 0, delay: 500, duration: 500, onComplete: () => t.destroy() });
  }

  // ---------- Intro encenada ----------
  // A exploradora chega, uma capivara derruba a entrega e os frascos voam pela rua. Não gasta tempo.
  comecarIntro() {
    this.estado = 'intro'; this.passoIntro = -1; this.acaoIntro = false;
    // tudo perto da exploradora, dentro do enquadramento do celular em pé: ela à esquerda, o cesto logo ao lado
    // e a capivara chegando pela direita
    this.jogador.body.enable = false; this.jogador.setPosition(-20, CHAO).play('correndo');
    const entrega = [this.add.image(112, CHAO, 'caixa').setOrigin(.5, 1).setScale(1 / 3).setDepth(4)];
    entrega.push(this.add.image(106, CHAO - 19, 'presente').setOrigin(.5, 1).setScale(.28).setDepth(4));
    entrega.push(this.add.image(120, CHAO - 19, 'sacola').setOrigin(.5, 1).setScale(.24).setDepth(4));
    this.frascosIntro = [];
    const tipos = ['caju', 'capim', 'roma'];
    for (let i = 0; i < 6; i++) this.frascosIntro.push(this.add.image(102 + i * 4, CHAO - 14, tipos[i % 3]).setOrigin(.5, 1).setScale(tipos[i % 3] === 'capim' ? .3 * 67 / 78 : .3).setDepth(3));
    this.entregaIntro = entrega;
    this.capivaraIntro = this.add.sprite(178, CHAO, 'capivara', 0).setOrigin(.5, 1).setScale(1 / 3).setFlipX(true).setDepth(5);
    this.tweens.add({ targets: this.jogador, x: 58, duration: 1100, onComplete: () => { if (this.estado === 'intro') this.jogador.play('parado'); } });
    $('pular-intro').hidden = false;
    this.ultimoHUD = ''; this.atualizarHUD(); $('local').textContent = 'Itajubá';
    this.avancarDialogo();
  }
  // A capivara anda até o cesto, derruba a entrega e os frascos voam pela rua. Chama pronto() no fim da cena.
  derrubarEntrega(pronto) {
    this.capivaraIntro.play('capivara-andar');
    this.tweens.add({ targets: this.capivaraIntro, x: 132, duration: 1000, onComplete: () => {
      tocar('derruba');
      this.tweens.add({ targets: this.entregaIntro, angle: { from: 0, to: 70 }, x: '+=12', y: '+=4', duration: 260 });
      this.frascosIntro.forEach((f, i) => {
        const destinoX = 260 + i * 80, altura = 60 + (i % 3) * 25;
        this.tweens.add({ targets: f, x: destinoX, duration: 900 + i * 90, ease: 'Linear' });
        this.tweens.add({ targets: f, y: CHAO - 14 - altura, duration: (900 + i * 90) / 2, yoyo: true, ease: 'Sine.out' });
        this.tweens.add({ targets: f, angle: 540, duration: 900 + i * 90 });
      });
      this.capivaraIntro.play('capivara-comer');
      this.time.delayedCall(1300, pronto);
    } });
  }

  // ---------- Caixa de diálogo (creme e vinho): páginas curtas, texto revelado aos poucos ----------
  // O primeiro toque (ou E/Enter/Espaço) completa a página; o seguinte avança. AVANÇAR fica acima de Caju/Pular.
  mostrarFala(titulo, texto, botaoFinal = 'AVANÇAR') {
    this.paginas = paginar(texto); this.pagina = 0; this.botaoFinal = botaoFinal;
    $('dialogo-titulo').textContent = titulo; $('dialogo').hidden = false; $('fechar-dialogo').hidden = false;
    $('objetivo-aviso')?.classList.remove('visivel'); // o aviso de objetivo não fica embaixo da conversa
    this.entrada?.ignorarAteSoltar();
    this.escreverPagina();
  }
  escreverPagina() {
    const texto = this.paginas[this.pagina], el = $('dialogo-texto'), ultima = this.pagina === this.paginas.length - 1;
    $('fechar-dialogo').textContent = ultima ? this.botaoFinal : 'AVANÇAR';
    el.setAttribute?.('aria-label', texto);
    this.digitacao?.remove(); this.digitacao = null;
    const semMovimento = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!this.time?.addEvent || semMovimento) { this.completarPagina(); return; }
    let n = 0; el.textContent = ''; this.digitando = true; $('dialogo').classList?.remove('pronto');
    this.digitacao = this.time.addEvent({ delay: 24, repeat: texto.length - 1, callback: () => {
      n++; el.textContent = texto.slice(0, n);
      if (n >= texto.length) this.completarPagina();
    } });
  }
  completarPagina() {
    this.digitacao?.remove(); this.digitacao = null; this.digitando = false;
    $('dialogo-texto').textContent = this.paginas?.[this.pagina] ?? ''; $('dialogo').classList?.add('pronto');
  }
  // Devolve true se o toque foi usado pela fala (completar o texto ou passar de página).
  avancarFala() {
    if (this.digitando) { this.completarPagina(); return true; }
    if (this.paginas && this.pagina < this.paginas.length - 1) { this.pagina++; this.escreverPagina(); tocar('botao'); return true; }
    return false;
  }
  esconderFala() { this.digitacao?.remove(); this.digitacao = null; this.digitando = false; this.paginas = null; $('dialogo').hidden = true; $('fechar-dialogo').hidden = true; }

  avancarDialogo() {
    if (this.acaoIntro) return; // a capivara está em cena: nada de avanço duplicado
    if (this.avancarFala()) return;
    if (this.estado === 'intro') {
      this.passoIntro++;
      const linhas = CAMPANHA.introCena;
      if (this.passoIntro > 0) tocar('botao');
      if (this.passoIntro >= linhas.length) { this.terminarIntro(); return; }
      if (this.passoIntro === 1) this.jogador.setFlipX(false);
      const l = linhas[this.passoIntro], botao = this.passoIntro === linhas.length - 1 ? 'COMEÇAR' : 'AVANÇAR';
      if (l.acao === 'derrubar') {
        // a caixa some para a cena da capivara aparecer inteira; a fala continua quando ela termina
        this.esconderFala(); this.acaoIntro = true;
        this.derrubarEntrega(() => { if (this.estado !== 'intro') return; this.acaoIntro = false; this.mostrarFala(l.titulo, l.texto, botao); });
        return;
      }
      this.mostrarFala(l.titulo, l.texto, botao);
      return;
    }
    if (this.dialogoAberto === 'karina-final') {
      this.dialogoAberto = false; this.esconderFala(); this.concluir('vitrine'); return;
    }
    if (this.dialogoAberto) this.fecharDialogo();
  }
  terminarIntro() {
    if (this.estado !== 'intro') return;
    this.acaoIntro = false;
    this.tweens.killTweensOf([this.jogador, this.capivaraIntro, ...this.entregaIntro, ...this.frascosIntro]);
    for (const o of [this.capivaraIntro, ...this.entregaIntro, ...this.frascosIntro]) o.destroy();
    this.esconderFala(); $('pular-intro').hidden = true;
    this.comecarJogo();
  }
  comecarJogo() {
    this.estado = 'jogo';
    this.jogador.body.enable = true; this.jogador.body.reset(80, CHAO); this.jogador.play('parado');
    this.entrada.ignorarAteSoltar();
    $('controles').hidden = false; $('dialogo').hidden = true;
    // dicas só na primeira partida desta visita
    this.tutorial = new Tutorial(!this.registry.get('tutorialVisto')); this.registry.set('tutorialVisto', true);
    this.tutorial.mostrar('andar', 0);
    this.ultimoHUD = ''; this.atualizarHUD();
  }

  // ---------- Passagem entre a rua e o showroom (nos dois sentidos) ----------
  // A tela escurece, troca a "sala" (limites de câmera e de física) e reabre. Missão, itens já pegos e capivaras
  // alimentadas ficam como estão: só a exploradora muda de lugar.
  // Destinos: 'cidade', 'showroom' (chega à fachada vindo da rua), 'interior' e 'jardim' (as duas telas do showroom).
  trocarSala(destino) {
    this.estado = 'transicao';
    this.jogador.body.setVelocity(0, 0); this.physics.world.pause(); this.entrada.limpar(); this.tutorial?.esconder(); this.guia.esconder();
    const textos = {
      showroom: ['Showroom', 'L’Occitane au Brésil', 'Itajubá'],
      cidade: ['De volta a', 'Itajubá', 'Passeie à vontade'],
      interior: ['Entrando no', 'Showroom', 'Os presentes estão lá dentro'],
      jardim: ['De volta à', 'Fachada', 'A rua de Itajubá fica à esquerda'],
    }[destino];
    $('transicao-titulo').textContent = textos[0]; $('transicao-nome').textContent = textos[1]; $('transicao-sub').textContent = textos[2];
    $('transicao').hidden = false; tocar('transicao');
    const cam = this.cameras.main, dentroDaLoja = destino === 'interior' || destino === 'jardim';
    cam.fadeOut(dentroDaLoja ? 300 : 380, 30, 16, 22);
    cam.once('camerafadeoutcomplete', () => {
      this.sala = destino === 'cidade' ? 'cidade' : 'showroom';
      if (this.sala === 'showroom') {
        if (this.missao.fase === 'cidade') { this.missao.fase = 'fachada'; registrar('chegada_showroom'); }
        for (const p of this.pisoShowroom) if (!this.solidos.contains(p)) this.solidos.add(p);
        const [trecho, chegada, direita] = { showroom: ['fachada', CHEGADA_SHOWROOM, true], interior: ['interior', CHEGADA_INTERIOR, true], jardim: ['fachada', CHEGADA_JARDIM, true] }[destino];
        this.trecho = trecho;
        if (trecho === 'interior') {
          if (!this.karinaConversou) this.karinaEntra();
          if (this.missao.fase !== 'showroom') { this.missao.fase = 'showroom'; this.time.delayedCall(900, () => this.aviso('Caixas no alto das estantes!')); }
        }
        this.physics.world.setBounds(TRECHO[trecho], 0, SHOWROOM.largura, ALTURA);
        this.jogador.body.reset(chegada, trecho === 'fachada' ? chaoFachada(chegada) : CHAO); this.jogador.olhandoDireita = direita; this.checkpoint = chegada;
        this.enquadrar(); cam.centerOn(chegada + (direita ? 40 : -40), 180);
      } else {
        this.physics.world.setBounds(0, 0, FACHADA, ALTURA);
        this.jogador.body.reset(CHEGADA_CIDADE, CHAO); this.jogador.olhandoDireita = false; this.checkpoint = CHEGADA_CIDADE;
        this.enquadrar();
        cam.centerOn(CHEGADA_CIDADE - 40, ALTURA / 2);
      }
      this.ultimoHUD = ''; this.atualizarHUD();
      this.time.delayedCall(dentroDaLoja ? 450 : 650, () => {
        $('transicao').hidden = true; cam.fadeIn(420, 30, 16, 22);
        this.physics.world.resume(); this.estado = 'jogo'; this.entrada.ignorarAteSoltar();
        this.ultimoHUD = ''; this.atualizarHUD(); // mostra o objetivo do lugar novo
      });
    });
  }
  entrarNoShowroom() { this.trocarSala('showroom'); }
  entrarNoInterior() { this.trocarSala('interior'); }
  voltarAoJardim() { this.trocarSala('jardim'); }
  voltarParaCidade() { this.trocarSala('cidade'); }

  // ---------- Conversas: Pedro na praça, Karina no showroom ----------
  // quem: 'pedro' ou 'karina'. Textos em CAMPANHA.conversas.
  abrirDialogo(quem = 'karina') {
    this.dialogoAberto = quem; // mostrarFala descarta o toque que abriu a conversa
    this.jogador.body.setVelocity(0, 0); this.physics.world.pause(); this.jogador.play('parado');
    this[quem].play(`${quem}-conversa`); tocar('conversa');
    const fala = CAMPANHA.conversas[quem];
    this.mostrarFala(fala.titulo, fala.texto, fala.botao);
    $('interagir').hidden = true; this.tutorial?.esconder(); $('fechar-dialogo').focus?.({ preventScroll: true });
  }
  fecharDialogo() {
    const quem = this.dialogoAberto;
    if (!quem) return;
    this.dialogoAberto = false; this.esconderFala();
    this.entrada.ignorarAteSoltar(); this.physics.world.resume(); this[quem].play(`${quem}-${quem === 'pedro' ? 'parado' : 'parada'}`);
    if (quem === 'pedro') { this.pedroConversou = true; this.pedro.disableInteractive(); } else this.karinaEntra();
  }
  // Karina sai da porta e aparece ao lado da bancada.
  karinaEntra() {
    if (this.karinaConversou) return;
    this.karinaConversou = true; this.missao.conversouKarina = true; this.ultimoHUD = '';
    this.tweens.add({ targets: this.karina, alpha: 0, duration: 350, onComplete: () => this.karina.disableInteractive() });
    this.tweens.add({ targets: this.karinaBancada, alpha: 1, duration: 350 });
  }

  // ---------- Bancada ----------
  // O kit se monta ao passar pelo lugar livre mais próximo com os três itens; a animação corre sem travar o passo.
  verificarBancada() {
    if (this.missao.kits >= META_KITS) return;
    const livres = this.estacoes.filter(e => !this.missao.estacoes.includes(e.id) && Math.abs(this.jogador.x - e.x) <= 12);
    if (!livres.length) return;
    const estacao = livres.sort((a, b) => Math.abs(this.jogador.x - a.x) - Math.abs(this.jogador.x - b.x))[0];
    const falta = faltaParaKit(this.missao);
    if (falta.length) {
      if (this.tempo * 1000 > this.avisoFaltaAte) {
        this.avisoFaltaAte = this.tempo * 1000 + 1800;
        const nomes = { caju: 'Caju', roma: 'Romã', caixa: 'caixa de presente' };
        this.aviso(`Falta: ${falta.map(f => nomes[f]).join(', ')}`); tocar('falta');
      }
      return;
    }
    montarKit(this.missao, estacao.id); tocar('kit'); this.atualizarHUD(); this.tutorial?.concluir('bancada');
    const pronto = this.missao.kits === META_KITS, numero = this.missao.kits;
    // os três itens voam até a bancada; o kit aparece com um brilho
    const voos = ['caju', 'roma', 'embalagem'].map(t => this.add.image(this.jogador.x, this.jogador.y - 30, t)
      .setScale(t === 'embalagem' ? .26 : .34).setDepth(7));
    voos.forEach((v, i) => this.tweens.add({ targets: v, x: estacao.x + (i - 1) * 3, y: py(646) - 6, scale: v.scale * .6, duration: 340, delay: i * 80, ease: 'Quad.in', onComplete: () => v.destroy() }));
    this.time.delayedCall(520, () => {
      estacao.visual.setAlpha(1);
      this.tweens.add({ targets: estacao.visual, scale: { from: .42, to: .3 }, duration: 260, ease: 'Back.out' });
      for (let k = 0; k < 7; k++) {
        const b = this.add.image(estacao.x, py(646) - 8, 'brilho').setScale(.5).setDepth(8), a = k / 7 * Math.PI * 2;
        this.tweens.add({ targets: b, x: b.x + Math.cos(a) * 16, y: b.y + Math.sin(a) * 12 - 6, alpha: 0, duration: 520, onComplete: () => b.destroy() });
      }
      this.karinaBancada.play('karina-aceno');
      this.aviso(pronto ? 'Vitrine pronta! Obrigado pela ajuda!' : `Kit ${numero} pronto!`, '#ffe7a6');
      if (pronto) { tocar('vitrine'); this.tweens.add({ targets: this.saida, alpha: 1, duration: 400 }); }
    });
  }

  contextoInteracao() {
    if (this.sala === 'cidade' && this.pedroPerto && !this.pedroConversou && !this.dialogoAberto) return { tipo: 'pedro', texto: 'Conversar com Pedro' };
    if (this.sala === 'showroom' && this.karinaPerto && !this.karinaConversou && !this.dialogoAberto) return { tipo: 'karina', texto: 'Conversar com a Karina' };
    if (this.sala === 'showroom' && this.trecho === 'fachada' && Math.abs(this.jogador.x - PORTA) < 20 && this.jogador.y > chaoFachada(this.jogador.x) - 6) return { tipo: 'porta', texto: 'Entrar no showroom' };
    return null;
  }
  interagir(contexto) {
    if (contexto?.tipo === 'pedro' || contexto?.tipo === 'karina') this.abrirDialogo(contexto.tipo);
    if (contexto?.tipo === 'porta') this.entrarNoInterior();
  }

  // Ordem das dicas (Tutorial.js): andar → pular → toldo na 1ª tendinha → pisão na 1ª capivara → caju na 2ª.
  // No showroom: caixas no alto → bancada → saída.
  atualizarTutorial(agora) {
    const t = this.tutorial; if (!t?.ativo) return;
    t.atualizar(agora);
    const x = this.jogador.x;
    if (this.sala === 'showroom') {
      const m = this.missao;
      if (m.kits >= META_KITS) { t.mostrar('saida', agora, true); return; }
      if (m.fase === 'showroom') t.mostrar('caixas', agora);
      if (m.fase === 'showroom' && !faltaParaKit(m).length) t.mostrar('bancada', agora, t.atual === 'caixas');
      return;
    }
    if (x > 125) t.concluir('andar');
    if (t.feitos.has('andar')) t.mostrar('pular', agora);
    if (!t.feitos.has('pular')) return;
    if (TENDAS.some(tx => tx - x > 0 && tx - x < 150)) t.mostrar('toldo', agora);
    if (x > TENDAS[0] + 60) t.concluir('toldo');
    const capivara = this.capivaras.getChildren().find(c => !c.getData('alimentada') && !c.getData('dormindo') && c.x - x > 0 && c.x - x < 170);
    if (!capivara) return;
    if (!t.feitos.has('pisao')) { this.capivaraDoPisao ??= capivara; if (capivara === this.capivaraDoPisao) t.mostrar('pisao', agora); }
    else if (capivara !== this.capivaraDoPisao) t.mostrar('caju', agora);
  }
  // Sem relógio no HUD: a partida não tem limite de tempo (pedido do Pedro). O tempo de passeio aparece só no final.
  atualizarHUD() {
    const m = this.missao, assinatura = [m.coletados.caju, m.coletados.capim, m.coletados.roma, m.coletados.caixa, this.jogador?.vida, m.fase, m.kits, this.sala, this.estado].join('|');
    if (assinatura === this.ultimoHUD) return;
    this.ultimoHUD = assinatura;
    // Contadores no canto superior esquerdo: ícone do produto e número. Cada um aparece ao pegar o primeiro item
    // daquele tipo e dá um pulinho a cada novo item.
    for (const c of $('presentes').querySelectorAll?.('[data-tipo]') ?? []) {
      const n = m.coletados[c.dataset.tipo] ?? 0, numero = c.querySelector('b');
      c.hidden = n === 0;
      if (numero.textContent !== String(n)) {
        numero.textContent = n; c.classList.remove('ganhou'); void c.offsetWidth; if (n > 0) c.classList.add('ganhou');
      }
    }
    const nomes = { caju: 'Caju', capim: 'Capim-Limão', roma: 'Romã', caixa: 'caixas' };
    $('presentes').setAttribute?.('aria-label', Object.entries(nomes).filter(([t]) => m.coletados[t]).map(([t, nome]) => `${m.coletados[t]} ${nome}`).join(', ') || 'Nenhum produto ainda');
    // cinco corações pixel art: cheios até a vida atual, vazios depois
    const vida = this.jogador?.vida ?? 5, coracoes = $('vida');
    Array.from(coracoes.children ?? []).forEach((c, i) => c.classList.toggle('vazio', i >= vida));
    coracoes.setAttribute?.('aria-label', `${vida} de 5 corações`);
    if (!coracoes.children) coracoes.textContent = `${vida} ♥`;
    if (this.estado === 'jogo') this.mostrarObjetivo(objetivoMissao(m, this.sala));
    $('kits').textContent = `Kits ${m.kits}/${META_KITS}`;
  }
  // Objetivo: aviso curto em creme e vinho que aparece quando muda e some sozinho (sem barra fixa).
  mostrarObjetivo(texto) {
    if (texto === this.objetivoAtual) return;
    this.objetivoAtual = texto; $('objetivo').textContent = texto;
    const aviso = $('objetivo-aviso');
    if (!aviso) return;
    aviso.classList.add('visivel'); this.objetivoSome?.remove?.();
    this.objetivoSome = this.time?.delayedCall(5000, () => aviso.classList.remove('visivel'));
  }
  concluir(motivo) {
    if (this.fim) return;
    if (!this.despedidaKarina) {
      this.despedidaKarina = true;
      this.dialogoAberto = 'karina-final';
      this.jogador.body.setVelocity(0, 0); this.physics.world.pause(); this.jogador.play('parado');
      this.karinaBancada?.play('karina-conversa');
      const pontos = desempenho({ ...this.missao.coletados, kits: this.missao.kits }).total;
      this.mostrarFala('KARINA · SHOWROOM ITAJUBÁ', `Olha só como nossa vitrine ficou linda! Obrigada por ajudar a preparar os kits.\n\nForam muitos encontros e boas lembranças aqui em Itajubá. Você agora faz parte dessa história!\n\nVocê conquistou ${pontos} pontos! Guardei uma recompensa para você usar em toda a loja. Vamos descobrir?`, 'REVELAR CUPOM');
      $('interagir').hidden = true;
      return;
    }
    this.fim = true;
    registrar('conclusao', { presentes: this.presentes });
    this.game.events.emit('conclusao', { presentes: this.presentes, tempo: Math.round(this.tempo), motivo,
      caju: this.missao.coletados.caju, capim: this.missao.coletados.capim, roma: this.missao.coletados.roma, kits: this.missao.kits });
    this.scene.stop();
  }
  // Cidade: zoom pela altura da tela. Showroom no celular em pé: zoom limitado para mostrar ao menos
  // LARGURA_MIN_SHOWROOM unidades de largura; o que sobra embaixo é um reflexo escurecido do piso.
  enquadrar() {
    const cam = this.cameras.main, showroom = this.sala === 'showroom';
    const x0 = TRECHO[this.trecho] ?? FACHADA;
    const zoom = showroom ? this.guia.layout(true, x0) : (this.guia.layout(false), this.scale.height / ALTURA_CIDADE);
    if (Math.abs(cam.zoom - zoom) > .001) cam.setZoom(zoom);
    const limites = showroom ? [x0, SHOWROOM.topo, SHOWROOM.largura, Math.max(SHOWROOM.altura, cam.height / zoom)] : [0, 0, FACHADA, ALTURA];
    const b = cam.getBounds();
    if (b.x !== limites[0] || Math.abs(b.height - limites[3]) > .01 || b.width !== limites[2]) cam.setBounds(...limites);
    return zoom;
  }
  // Para onde ir no showroom: Karina, caixas, produtos de reserva, o próximo lugar livre da bancada e a saída.
  alvosShowroom() {
    if (!this.karinaConversou) return [{ x: this.karinaX, y: this.karina.getTopCenter().y + 6, icone: 'karina-parada', frame: 0, escala: .08 }];
    if (this.missao.kits >= META_KITS) return this.alvosNestaTela([{ x: MUNDO - 22, y: 200, icone: 'sacola', escala: .22 }]);
    const alvos = [];
    const falta = faltaParaKit(this.missao);
    for (const item of this.itens.getChildren()) {
      const tipo = item.getData('tipo');
      if (!item.active || item.x < FACHADA) continue;
      if (tipo === 'caixa' || falta.includes(tipo)) alvos.push({ x: item.x, y: item.y - 4, icone: item.texture.key, escala: tipo === 'caixa' ? .18 : .26 });
    }
    if (!falta.length) {
      const livre = this.estacoes.find(e => !this.missao.estacoes.includes(e.id));
      if (livre) alvos.push({ x: livre.x, y: py(646) - 8, icone: 'presente', escala: .22 });
    } else if (!falta.includes('caixa') || !alvos.length) {
      // faltam frutas e não há reserva no showroom: o caminho é a cidade
      if (!alvos.some(a => a.icone === 'caju' || a.icone === 'roma')) alvos.push({ x: FACHADA + 46, y: 128, icone: falta.includes('caju') ? 'caju' : 'roma', escala: .26 });
    }
    return this.alvosNestaTela(alvos);
  }
  // O que fica na outra tela do showroom vira um alvo na passagem (uma seta só, com o ícone do primeiro).
  alvosNestaTela(alvos) {
    const interior = this.trecho === 'interior', nesta = [], passagem = [];
    for (const a of alvos) (a.x >= INTERIOR) === interior ? nesta.push(a) : passagem.push(a);
    if (passagem.length) nesta.push({ ...passagem[0], x: interior ? INTERIOR + 8 : PORTA, y: interior ? 205 : 196 });
    return nesta;
  }
  // Zoom pela altura da tela (que muda com o celular) e câmera um pouco à frente de quem anda.
  atualizarCamera() {
    const cam = this.cameras.main;
    const zoom = this.enquadrar();
    const frente = Math.min(40, (this.scale.width / zoom) * .2);
    cam.setFollowOffset(this.jogador.olhandoDireita ? -frente : frente, 0);
    this.morros.tilePositionX = cam.scrollX * .15 * 3; this.casas.tilePositionX = cam.scrollX * .4 * 3;
  }

  update(_agora, delta) {
    if (this.fim || !this.entrada) return;
    this.entrada.atualizar();
    if (this.estado === 'intro') {
      if (this.entrada.interagirApertou || this.entrada.pularApertou) this.avancarDialogo();
      this.atualizarCamera(); return;
    }
    if (this.dialogoAberto) { if (this.entrada.interagirApertou || this.entrada.pularApertou) this.avancarDialogo(); return; }
    if (this.estado === 'transicao') return;
    this.tempo += delta / 1000;
    const agora = this.tempo * 1000; // relógio de jogo ativo (invencibilidade, avisos): pausa, intro, transição e conversa não contam
    const soltou = this.jogador.atualizar(this.entrada, agora, delta, true);
    if (this.jogador.pulou) tocar('pulo');
    if (this.entrada.pularApertou) this.tutorial?.concluir('pular');
    if (this.entrada.frutaApertou && this.tutorial?.atual === 'caju') this.tutorial.concluir('caju');
    this.atualizarTutorial(agora);
    if (soltou && agora >= this.proximoArremesso) {
      this.proximoArremesso = agora + 350;
      const dir = this.jogador.olhandoDireita ? 1 : -1;
      const f = this.frutas.create(this.jogador.x + dir * 22, this.jogador.y - 20, 'caju-fruta').setScale(1 / 3);
      f.body.setAllowGravity(false); f.setVelocityX(dir * 260); tocar('arremesso');
      this.time.delayedCall(1500, () => { if (f.active) f.destroy(); });
    }
    for (const c of this.capivaras.getChildren()) if (!c.getData('alimentada') && !c.getData('dormindo')) {
      const dir = Math.sin(agora / 1800 + c.getData('origem')) > 0 ? 1 : -1;
      c.setVelocityX(dir * MODO_FACIL.capivaraVelocidade); c.setFlipX(dir < 0);
    }
    this.atualizarCamera();
    const x = this.jogador.x;
    if (this.sala === 'cidade') {
      this.guia.esconder();
      if (x > PORTAL + 8) { this.entrarNoShowroom(); return; }
      if (x > this.checkpoint + MODO_FACIL.checkpointDistancia) this.checkpoint = x;
      // Pedro na praça: acena quando ela chega perto e a conversa abre sozinha na primeira passagem, lado a lado
      const pertoPedro = !this.pedroConversou && Math.abs(x - PEDRO_PRACA) < 45;
      if (pertoPedro !== this.pedroPerto) { this.pedroPerto = pertoPedro; this.pedro.play(pertoPedro ? 'pedro-aceno' : 'pedro-parado'); }
      if (pertoPedro && Math.abs(x - PEDRO_PRACA) < 30) { this.abrirDialogo('pedro'); return; }
    } else {
      // andando para a esquerda no começo da fachada, volta para a rua
      if (this.trecho !== 'interior' && x < VOLTA && this.entrada.esquerda) { this.voltarParaCidade(); return; }
      if (this.trecho === 'interior' && x < INTERIOR + PASSAGEM && this.entrada.esquerda) { this.voltarAoJardim(); return; }
      const perto = !this.karinaConversou && Math.abs(x - this.karinaX) < 45;
      if (perto !== this.karinaPerto) { this.karinaPerto = perto; this.karina.play(perto ? 'karina-aceno' : 'karina-parada'); }
      // a primeira passagem pela porta abre a conversa sozinha: é ela que explica as caixas de presente
      if (perto && !this.karinaConversou && Math.abs(x - this.karinaX) < 30) { this.abrirDialogo('karina'); return; }
      if (x > PORTA + 30 && !this.karinaConversou) this.karinaEntra();
      if (this.missao.fase === 'showroom') this.verificarBancada();
      this.guia.atualizar(this.alvosShowroom(), this.jogador, agora);
    }
    const contexto = this.contextoInteracao();
    $('interagir').hidden = !contexto;
    if (contexto && $('interagir').textContent !== contexto.texto) $('interagir').textContent = contexto.texto;
    if (this.entrada.interagirApertou || this.pedidoInteracao) { this.pedidoInteracao = false; this.interagir(contexto); }
    const local = this.sala === 'cidade' ? 'Pelas ruas de Itajubá' : this.trecho === 'interior' ? 'Showroom · monte a vitrine' : 'Showroom L’Occitane';
    if ($('local').textContent !== local) $('local').textContent = local;
    this.atualizarHUD();
    // A partida só termina saindo à direita com os três kits; não há fim por tempo.
    if (x > MUNDO - 14 && this.missao.kits === META_KITS) this.concluir('vitrine');
    else if (x > MUNDO - 14) this.mostrarObjetivo('Antes de sair, monte os três kits na bancada');
  }
}
