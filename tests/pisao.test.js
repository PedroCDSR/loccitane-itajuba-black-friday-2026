import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { decidirContato, QUIQUE_PISAO } from '../src/game/pisao.js';
import { PASSOS } from '../src/game/Tutorial.js';
import { CAMPANHA } from '../src/data/campanha.js';

// Capivara de 16 unidades de altura sobre o chão 240: topo 224, meio 232.
const MEIO = 232;

test('cair por cima com os pés acima do meio é pisão', () => {
  assert.equal(decidirContato({ pe: 226, velocidadeY: 200, meioCapivara: MEIO }), 'pisao');
  // afundou um pouco no quadro do contato, mas no quadro anterior ainda estava acima do meio
  assert.equal(decidirContato({ pe: 236, velocidadeY: 400, meioCapivara: MEIO }), 'pisao');
  // pisão vale mesmo piscando depois de um dano
  assert.equal(decidirContato({ pe: 226, velocidadeY: 200, meioCapivara: MEIO, invencivel: true }), 'pisao');
});

test('encostar de lado, subindo ou parado numa capivara acordada é dano', () => {
  assert.equal(decidirContato({ pe: 240, velocidadeY: 0, meioCapivara: MEIO }), 'dano'); // andando no chão
  assert.equal(decidirContato({ pe: 230, velocidadeY: -250, meioCapivara: MEIO }), 'dano'); // subindo
  assert.equal(decidirContato({ pe: 240, velocidadeY: 30, meioCapivara: MEIO }), 'dano'); // descendo, mas já abaixo do meio
  assert.equal(decidirContato({ pe: 240, velocidadeY: 0, meioCapivara: MEIO, invencivel: true }), 'nada');
});

test('capivara dormindo ou alimentada não machuca nem dorme de novo', () => {
  for (const estado of [{ dormindo: true }, { alimentada: true }]) {
    assert.equal(decidirContato({ pe: 240, velocidadeY: 0, meioCapivara: MEIO, ...estado }), 'nada');
    assert.equal(decidirContato({ pe: 226, velocidadeY: 200, meioCapivara: MEIO, ...estado }), 'nada');
  }
});

// Cena com adaptadores em memória, como em exploracao.test.js.
function cena() {
  const source = readFileSync(new URL('../src/game/Aventura.js', import.meta.url), 'utf8').replace(/^import[^\n]*\n/gm, '').replace('export class Aventura', 'class Aventura');
  const sons = [];
  const Klass = vm.runInNewContext(source + '\nAventura;', {
    Phaser: { Scene: class {} }, CAMPANHA, SHOWROOM: { x: 5216, largura: 320, topo: 90 }, MUNDO: 5856, decidirContato, QUIQUE_PISAO,
    tocar: n => sons.push(n), document: { getElementById: () => ({}) },
  });
  const s = new Klass();
  const avisos = [], quiques = [], danos = [], concluidos = [];
  const jogador = { x: 1000, vida: 5, body: { bottom: 226, velocity: { y: 200 } }, estaInvencivel: () => false,
    quicar: f => quiques.push(f), levarDano() { danos.push(1); return --jogador.vida; }, reposicionar() {} };
  const capivara = () => {
    const dados = {};
    return { x: 1010, y: 240, scaleX: 1 / 3, scaleY: 1 / 3, flipX: false, body: { center: { y: MEIO } }, anim: null,
      getData: k => dados[k], setData: (k, v) => { dados[k] = v; }, setVelocityX() {}, play(a) { this.anim = a; } };
  };
  Object.assign(s, {
    tempo: 10, jogador, entrada: { pular: false }, checkpoint: 80,
    tweens: { add: () => ({}) }, time: { addEvent: () => ({}) }, add: { text: () => ({}) },
    tutorial: { concluir: n => concluidos.push(n) }, aviso: t => avisos.push(t), atualizarHUD() {},
  });
  return { s, jogador, capivara, avisos, quiques, danos, concluidos, sons };
}

test('na cena, o pisão faz a capivara dormir, quica e conclui a dica; segurando Pular quica mais alto', () => {
  const { s, jogador, capivara, avisos, quiques, danos, concluidos } = cena();
  const c = capivara();
  s.tocarCapivara(jogador, c);
  assert.equal(c.getData('dormindo'), true); assert.equal(c.anim, 'capivara-dormir');
  assert.deepEqual(quiques, [QUIQUE_PISAO.normal]); assert.equal(danos.length, 0);
  assert.ok(concluidos.includes('pisao')); assert.match(avisos[0], /dormiu/);
  // dormindo: encostar de lado não tira coração
  jogador.body.bottom = 240; jogador.body.velocity.y = 0;
  s.tocarCapivara(jogador, c); assert.equal(danos.length, 0);
  // outra capivara, segurando Pular
  const outra = capivara(); s.entrada.pular = true; jogador.body.bottom = 226; jogador.body.velocity.y = 300;
  s.tocarCapivara(jogador, outra); assert.equal(quiques.at(-1), QUIQUE_PISAO.segurando);
  assert.ok(QUIQUE_PISAO.segurando > QUIQUE_PISAO.normal);
});

test('na cena, encostar de lado numa capivara acordada tira 1 coração', () => {
  const { s, jogador, capivara, danos, quiques } = cena();
  const c = capivara(); jogador.body.bottom = 240; jogador.body.velocity.y = 0;
  s.tocarCapivara(jogador, c);
  assert.equal(danos.length, 1); assert.equal(jogador.vida, 4); assert.equal(quiques.length, 0); assert.notEqual(c.getData('dormindo'), true);
});

test('as dicas e a abertura explicam as duas formas de lidar com a capivara, o toldo e as estantes', () => {
  assert.match(PASSOS.pisao.toque, /Pule em cima da capivara para ela dormir/); assert.equal(PASSOS.pisao.alvo, 'pular');
  assert.match(PASSOS.caju.toque, /CAJU/); assert.equal(PASSOS.caju.alvo, 'fruta');
  assert.match(PASSOS.toldo.toque, /toldo/); assert.match(PASSOS.estante.toque, /prateleiras/);
  const intro = CAMPANHA.introCena.map(l => l.texto).join(' ');
  for (const r of [/toldo/, /Pule em cima e ela dorme/, /caju/, /prateleiras/]) assert.match(intro, r);
  const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  for (const r of [/pule em cima e ela dorme/, /dê um caju/, /quicar/, /prateleiras/]) assert.match(html, r);
});
