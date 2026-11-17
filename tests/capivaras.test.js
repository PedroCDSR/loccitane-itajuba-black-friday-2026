import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { contatoCapivara, capivaraInofensiva, forcaQuique, PISAO } from '../src/game/capivaras.js';
import { PASSOS } from '../src/game/Tutorial.js';
import { CAMPANHA } from '../src/data/campanha.js';
import { SHOWROOM } from '../src/game/config.js';

const TOPO = 224; // topo do corpo da capivara no chão (CHAO 240 - 16)

test('pisão: caindo com os pés acima do topo da capivara faz ela dormir', () => {
  assert.equal(contatoCapivara({ vy: 300, baseAnterior: TOPO - 4 }, { topo: TOPO }), 'pisao');
  assert.equal(contatoCapivara({ vy: 520, baseAnterior: TOPO + PISAO.folga }, { topo: TOPO }), 'pisao', 'queda rápida ainda conta');
});
test('encostar de lado ou subindo por baixo continua tirando coração', () => {
  assert.equal(contatoCapivara({ vy: 0, baseAnterior: 240 }, { topo: TOPO }), 'dano', 'andando no chão');
  assert.equal(contatoCapivara({ vy: -200, baseAnterior: TOPO - 10 }, { topo: TOPO }), 'dano', 'subindo não é pisão');
  assert.equal(contatoCapivara({ vy: 200, baseAnterior: TOPO + PISAO.folga + 1 }, { topo: TOPO }), 'dano', 'caindo de lado, abaixo do topo');
});
test('capivara dormindo ou alimentada fica inofensiva e não dorme de novo', () => {
  for (const estado of [{ dormindo: true }, { alimentada: true }]) {
    assert.equal(capivaraInofensiva(estado), true);
    assert.equal(contatoCapivara({ vy: 0, baseAnterior: 240 }, { topo: TOPO, ...estado }), 'nada');
    assert.equal(contatoCapivara({ vy: 300, baseAnterior: TOPO - 4 }, { topo: TOPO, ...estado }), 'nada');
  }
  assert.equal(capivaraInofensiva({}), false); assert.equal(capivaraInofensiva(undefined), false);
});
test('quique do pisão é menor que o do toldo e cresce segurando PULAR', () => {
  assert.ok(forcaQuique(true) > forcaQuique(false));
  assert.ok(forcaQuique(true) < 430 && forcaQuique(false) < 360, 'o toldo continua sendo o quique mais alto');
});

function cena(elements = {}) {
  const source = readFileSync(new URL('../src/game/Aventura.js', import.meta.url), 'utf8').replace(/^import[^\n]*\n/gm, '').replace('export class Aventura', 'class Aventura');
  const Klass = vm.runInNewContext(source + '\nAventura;', {
    Phaser: { Scene: class {} }, CAMPANHA, SHOWROOM, document: { getElementById: id => elements[id] },
    contatoCapivara, capivaraInofensiva, forcaQuique, tocar() {},
  });
  return new Klass();
}
test('Aventura.adormecer: quica a exploradora, deixa a capivara parada, de olhos fechados e solta zzz', () => {
  const s = cena(); const dados = new Map(), feitos = [], zs = [];
  let quique, textura, parou = false, vx;
  const c = { x: 1180, y: 240, scaleY: 1 / 3, flipX: false, active: true, anims: { stop() { parou = true; } },
    setData: (k, v) => dados.set(k, v), getData: k => dados.get(k), setVelocityX: v => { vx = v; }, setTexture: t => { textura = t; } };
  const objeto = () => { const o = { x: 0, y: 0, setScale: () => o, setDepth: () => o, setOrigin: () => o, destroy() {} }; return o; };
  Object.assign(s, {
    jogador: { x: 1180, y: 220, quicar: f => { quique = f; } }, entrada: { pular: false },
    tutorial: { concluir: n => feitos.push(n) }, aviso() {}, tweens: { add() {} },
    time: { delayedCall: () => ({}) },
    add: { image: (x, y, t) => { zs.push(t); return Object.assign(objeto(), { x, y }); }, text: () => objeto() },
  });
  s.adormecer(c);
  assert.equal(dados.get('dormindo'), true); assert.equal(vx, 0); assert.equal(parou, true);
  assert.equal(textura, 'capivara-dormindo'); assert.equal(quique, forcaQuique(false));
  assert.deepEqual(feitos, ['pisao']); assert.ok(zs.includes('zzz'), 'o "zzz" aparece sobre a cabeça');
});

test('dicas e abertura explicam as três formas de lidar com a capivara, o toldo e o showroom', () => {
  assert.equal(PASSOS.pisao.toque, 'Pule em cima da capivara para ela dormir!');
  assert.match(PASSOS.caju.toque, /CAJU/); assert.match(PASSOS.dano.toque, /1 ♥/);
  assert.match(PASSOS.toldo.toque, /toldo/); assert.match(PASSOS.caixas.toque, /caixas/); assert.match(PASSOS.bancada.toque, /bancada/);
  for (const p of Object.values(PASSOS)) assert.ok(p.toque.length <= 80 && p.teclado.length <= 80, `dica curta: ${p.toque}`);
  const intro = CAMPANHA.introCena.map(l => l.texto).join(' ');
  for (const termo of [/[Pp]ise/, /caju/, /pule por cima/, /toldo/, /tira 1 ♥/, /bancada/, /75 segundos/]) assert.match(intro, termo);
  for (const l of CAMPANHA.introCena) assert.ok(l.texto.length <= 140, `fala curta: ${l.titulo}`);
  const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  assert.match(html, /Pise, dê caju ou pule por cima/); assert.match(html, /tira 1 coração/);
});
