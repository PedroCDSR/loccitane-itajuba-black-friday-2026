import test from 'node:test';
import assert from 'node:assert/strict';
import { criarMissao, coletarProduto, montarKit, objetivoMissao, criarProdutosCidade, META_KITS } from '../src/game/missao.js';
import { DURACAO_SEGUNDOS, SHOWROOM, MUNDO, JOGADOR, MODO_FACIL } from '../src/game/config.js';

test('uma nova partida começa sem itens, kits ou estado reaproveitado', () => {
  const a = criarMissao(), b = criarMissao(); coletarProduto(a, 'caju'); a.estacoes.push(0);
  assert.deepEqual(b.coletados, { caju: 0, roma: 0 }); assert.deepEqual(b.estacoes, []); assert.equal(b.fase, 'cidade');
});
test('somente os produtos da missão alteram estoque e coleta', () => {
  const m = criarMissao(); assert.equal(coletarProduto(m, 'fruta'), false);
  assert.equal(coletarProduto(m, 'caju'), true); coletarProduto(m, 'roma');
  assert.deepEqual(m.coletados, { caju: 1, roma: 1 }); assert.deepEqual(m.estoque, m.coletados);
});
test('kits só podem ser montados no showroom com um produto de cada tipo', () => {
  const m = criarMissao(); coletarProduto(m, 'caju'); coletarProduto(m, 'roma');
  assert.equal(montarKit(m, 0), false); m.fase = 'showroom';
  assert.equal(montarKit(m, 0), true); assert.equal(m.kits, 1);
  assert.deepEqual(m.estoque, { caju: 0, roma: 0 });
  assert.deepEqual(m.coletados, { caju: 1, roma: 1 });
  assert.equal(montarKit(m, 1), false); assert.equal(m.kits, 1);
});
test('segurar ou repetir interação não duplica kits nem produz estoque negativo', () => {
  const m = criarMissao(); m.fase = 'showroom';
  for (let i = 0; i < 3; i++) { coletarProduto(m, 'caju'); coletarProduto(m, 'roma'); }
  assert.equal(montarKit(m, -1), false); assert.equal(montarKit(m, 3), false); assert.equal(montarKit(m, 0.5), false);
  assert.equal(montarKit(m, 0), true); assert.equal(montarKit(m, 0), false);
  assert.equal(montarKit(m, 1), true); assert.equal(montarKit(m, 2), true);
  assert.equal(m.kits, META_KITS); assert.deepEqual(m.estoque, { caju: 0, roma: 0 });
  assert.match(objetivoMissao(m), /Vitrine pronta/);
});
test('a cidade oferece mais de três pares no caminho de chão', () => {
  const itens = criarProdutosCidade(SHOWROOM.x - 620);
  for (const tipo of ['caju', 'roma']) assert.ok(itens.filter(i => i.tipo === tipo).length >= META_KITS);
  assert.ok(itens.every(i => i.y === 210 && i.x < SHOWROOM.x));
  assert.equal(new Set(itens.map(i => i.x)).size, itens.length);
});
test('modo fácil mantém cidade, velocidade e duração atuais', () => {
  assert.equal(DURACAO_SEGUNDOS, 75); assert.equal(SHOWROOM.x, 5216); assert.equal(MUNDO, 5856); assert.equal(JOGADOR.velocidade, 140);
  assert.equal(JOGADOR.coracoes, 5); assert.ok(JOGADOR.coyoteMs >= 100); assert.ok(MODO_FACIL.checkpointDistancia <= 400);
});
