import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { SHOWROOM, MUNDO, ALTURA, ALTURA_CIDADE, ALTURA_SHOWROOM } from '../src/game/config.js';
import { CAMPANHA } from '../src/data/campanha.js';
import { criarMissao, coletarProduto, objetivoMissao, META_KITS } from '../src/game/missao.js';

// Carrega a cena com adaptadores em memória (sem Phaser nem navegador), como em dialogo.test.js.
function cena() {
  const el = () => ({ hidden: true, textContent: '' });
  const elements = Object.fromEntries(['transicao', 'transicao-titulo', 'transicao-nome', 'transicao-sub', 'interagir', 'local', 'objetivo', 'presentes', 'vida', 'kits'].map(id => [id, el()]));
  const metricas = [];
  const source = readFileSync(new URL('../src/game/Aventura.js', import.meta.url), 'utf8').replace(/^import[^\n]*\n/gm, '').replace('export class Aventura', 'class Aventura');
  const Klass = vm.runInNewContext(source + '\nAventura;', {
    Phaser: { Scene: class {} }, CAMPANHA, SHOWROOM, MUNDO, ALTURA, ALTURA_CIDADE, ALTURA_SHOWROOM, META_KITS, objetivoMissao, faltaParaKit: () => [],
    MODO_FACIL: { capivaraVelocidade: 10, checkpointDistancia: 400 }, TENDA: {}, registrar: n => metricas.push(n), tocar() {},
    document: { getElementById: id => elements[id] },
  });
  const s = new Klass();
  const pisos = new Set(), mundo = { bounds: null, pausado: 0, retomado: 0 };
  const jogador = { x: 100, y: 240, vida: 5, olhandoDireita: true, body: { setVelocity() {}, reset(x, y) { jogador.x = x; jogador.y = y; } }, atualizar: () => false, play() {} };
  const cam = { fadeOut() {}, fadeIn() {}, once(_e, f) { f(); }, setZoom(z) { cam.zoom = z; }, setBounds(...b) { cam.bounds = b; }, centerOn() {}, setFollowOffset() {}, zoom: 1, scrollX: 0 };
  Object.assign(s, {
    fim: false, tempo: 0, estado: 'jogo', sala: 'cidade', checkpoint: 80, presentes: 0, proximoArremesso: 0, missao: criarMissao(),
    dialogoAberto: false, pedroPerto: false, pedroConversou: true, pedidoInteracao: false, ultimoHUD: '', jogador,
    entrada: { esquerda: false, atualizar() {}, limpar() {}, ignorarAteSoltar() {} },
    physics: { world: { setBounds(...b) { mundo.bounds = b; }, pause() { mundo.pausado++; }, resume() { mundo.retomado++; } } },
    solidos: { contains: p => pisos.has(p), add: p => pisos.add(p) }, pisoShowroom: { piso: true },
    cameras: { main: cam }, scale: { width: 960, height: 960 }, time: { delayedCall(_ms, f) { f(); } },
    capivaras: { getChildren: () => s.listaCapivaras }, listaCapivaras: [], morros: {}, casas: {}, pedroX: SHOWROOM.x + 129, estacoes: [], faltaParaKit: () => [],
    game: { events: { emit: (...a) => s.emitidos.push(a) } }, emitidos: [], scene: { stop() {} },
  });
  return { s, elements, metricas, mundo, pisos, cam };
}

test('tempo longo de passeio não encerra a partida', () => {
  const { s } = cena();
  for (let i = 0; i < 20; i++) s.update(0, 60000); // 20 minutos de jogo ativo
  assert.equal(s.fim, false); assert.equal(s.emitidos.length, 0);
  assert.ok(s.tempo >= 1200, 'o relógio de jogo ativo continua contando para invencibilidade e avisos');
  assert.doesNotMatch(readFileSync(new URL('../src/game/Aventura.js', import.meta.url), 'utf8'), /concluir\('tempo'\)|DURACAO_SEGUNDOS/);
});

test('a partida só termina saindo do showroom com os três kits', () => {
  const { s } = cena(); s.sala = 'showroom'; s.missao.fase = 'showroom'; s.jogador.x = MUNDO - 5;
  s.update(0, 16); assert.equal(s.fim, false, 'sem kits a saída não conclui');
  s.missao.kits = META_KITS; s.update(0, 16);
  assert.equal(s.fim, true); assert.equal(s.emitidos[0][1].motivo, 'vitrine');
});

test('voltar à cidade e retornar ao showroom preserva missão, itens e capivaras, sem disparar em loop', () => {
  const { s, elements, metricas, mundo, pisos, cam } = cena();
  const capivara = { alimentada: true, getData: k => k === 'alimentada' ? capivara.alimentada : 0, setVelocityX() {}, setFlipX() {} };
  s.listaCapivaras = [capivara];
  // rua → showroom pela bandeira
  s.jogador.x = SHOWROOM.x - 30; s.update(0, 16);
  assert.equal(s.sala, 'showroom'); assert.equal(s.missao.fase, 'fachada'); assert.equal(s.estado, 'jogo');
  assert.equal(mundo.bounds[0], SHOWROOM.x); assert.ok(pisos.size === 1); assert.equal(cam.zoom, 960 / ALTURA_SHOWROOM);
  const chegada = s.jogador.x;
  // parado na chegada não volta sozinho; nem andando para a direita
  s.update(0, 16); s.update(0, 16); assert.equal(s.sala, 'showroom');
  // a missão avança dentro do showroom
  s.missao.fase = 'showroom'; for (const t of ['caju', 'roma', 'caixa']) coletarProduto(s.missao, t); s.missao.kits = 1; s.missao.estacoes.push(0);
  const antes = JSON.stringify(s.missao);
  // showroom → rua andando para a esquerda no começo da fachada
  s.entrada.esquerda = true; s.jogador.x = SHOWROOM.x + 10; s.update(0, 16);
  assert.equal(s.sala, 'cidade'); assert.equal(elements['transicao-nome'].textContent, 'Itajubá'); assert.equal(elements.transicao.hidden, true);
  assert.equal(JSON.stringify(s.missao), antes, 'missão, estoque e kits continuam iguais');
  assert.equal(capivara.alimentada, true);
  assert.equal(mundo.bounds[2], SHOWROOM.x); assert.equal(cam.zoom, 960 / ALTURA_CIDADE);
  assert.ok(s.jogador.x < SHOWROOM.x - 46 + 8 - 30, 'chega na rua com folga antes da bandeira');
  assert.equal(s.jogador.olhandoDireita, false); assert.equal(s.checkpoint, s.jogador.x);
  assert.match(elements.objetivo.textContent, /Passeie à vontade|Reúna mais/);
  // continua na rua mesmo segurando a esquerda
  for (let i = 0; i < 5; i++) s.update(0, 16); assert.equal(s.sala, 'cidade');
  // rua → showroom de novo: a fase não regride para a fachada e a métrica de chegada não se repete
  s.entrada.esquerda = false; s.jogador.x = SHOWROOM.x - 30; s.update(0, 16);
  assert.equal(s.sala, 'showroom'); assert.equal(s.missao.fase, 'showroom'); assert.equal(s.jogador.x, chegada);
  assert.equal(metricas.filter(n => n === 'chegada_showroom').length, 1); assert.equal(pisos.size, 1);
  assert.equal(mundo.pausado, mundo.retomado, 'toda transição retoma a física');
  assert.equal(s.fim, false);
});
