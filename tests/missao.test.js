import test from 'node:test';
import assert from 'node:assert/strict';
import { criarMissao, coletarProduto, montarKit, objetivoMissao, criarProdutosCidade, META_KITS } from '../src/game/missao.js';
import { SHOWROOM, MUNDO, JOGADOR, MODO_FACIL } from '../src/game/config.js';

test('uma nova partida começa sem itens, kits ou estado reaproveitado', () => {
  const a = criarMissao(), b = criarMissao(); coletarProduto(a, 'caju'); a.estacoes.push(0);
  assert.deepEqual(b.coletados, { caju: 0, roma: 0, caixa: 0 }); assert.deepEqual(b.estacoes, []); assert.equal(b.fase, 'cidade');
});
test('somente os produtos da missão alteram estoque e coleta', () => {
  const m = criarMissao(); assert.equal(coletarProduto(m, 'fruta'), false);
  assert.equal(coletarProduto(m, 'caju'), true); coletarProduto(m, 'roma'); coletarProduto(m, 'caixa');
  assert.deepEqual(m.coletados, { caju: 1, roma: 1, caixa: 1 }); assert.deepEqual(m.estoque, m.coletados);
});
test('kits só podem ser montados no showroom com Caju, Romã e caixa de presente', () => {
  const m = criarMissao(); coletarProduto(m, 'caju'); coletarProduto(m, 'roma');
  assert.equal(montarKit(m, 0), false); m.fase = 'showroom';
  assert.equal(montarKit(m, 0), false, 'sem caixa de presente não monta');
  coletarProduto(m, 'caixa');
  assert.equal(montarKit(m, 0), true); assert.equal(m.kits, 1);
  assert.deepEqual(m.estoque, { caju: 0, roma: 0, caixa: 0 });
  assert.deepEqual(m.coletados, { caju: 1, roma: 1, caixa: 1 });
  assert.equal(montarKit(m, 1), false); assert.equal(m.kits, 1);
});
test('segurar ou repetir interação não duplica kits nem produz estoque negativo', () => {
  const m = criarMissao(); m.fase = 'showroom';
  for (let i = 0; i < 3; i++) { coletarProduto(m, 'caju'); coletarProduto(m, 'roma'); coletarProduto(m, 'caixa'); }
  assert.equal(montarKit(m, -1), false); assert.equal(montarKit(m, 3), false); assert.equal(montarKit(m, 0.5), false);
  assert.equal(montarKit(m, 0), true); assert.equal(montarKit(m, 0), false);
  assert.equal(montarKit(m, 1), true); assert.equal(montarKit(m, 2), true);
  assert.equal(m.kits, META_KITS); assert.deepEqual(m.estoque, { caju: 0, roma: 0, caixa: 0 });
  assert.match(objetivoMissao(m), /Vitrine pronta/);
});
test('a cidade garante a missão pelo chão e guarda o resto para saltos e tendas', () => {
  const itens = criarProdutosCidade({ chao: 240, tendas: [870, 1630], cestos: [[1065, 1], [1830, 2]], topoToldo: 168 });
  const chao = itens.filter(i => i.lugar === 'chao'), alto = itens.filter(i => i.lugar === 'alto');
  for (const tipo of ['caju', 'roma']) assert.ok(chao.filter(i => i.tipo === tipo).length >= 2);
  assert.ok(chao.every(i => i.y >= 200), 'itens de chão ficam na altura do corpo');
  assert.ok(alto.every(i => i.y < 100), 'itens das tendas só com o quique');
  assert.equal(new Set(itens.map(i => `${i.x},${i.y}`)).size, itens.length);
});
test('modo fácil mantém cidade e velocidade atuais', () => {
  assert.equal(SHOWROOM.x, 5216); assert.equal(MUNDO, 5856); assert.equal(JOGADOR.velocidade, 140);
  assert.equal(JOGADOR.coracoes, 5); assert.ok(JOGADOR.coyoteMs >= 100); assert.ok(MODO_FACIL.checkpointDistancia <= 400);
});
test('de volta à cidade, o objetivo convida a passear sem perder a missão', () => {
  const m = criarMissao(); m.fase = 'showroom';
  for (let i = 0; i < 3; i++) { coletarProduto(m, 'caju'); coletarProduto(m, 'roma'); }
  assert.match(objetivoMissao(m, 'cidade'), /Passeie à vontade/);
  assert.match(objetivoMissao(m, 'showroom'), /caixas de presente/, 'no showroom continua a orientação das caixas');
  m.estoque.roma = 1; assert.match(objetivoMissao(m, 'cidade'), /Reúna mais Caju e Romã/);
  m.kits = META_KITS; assert.match(objetivoMissao(m, 'cidade'), /Vitrine pronta! Passeie/);
  assert.match(objetivoMissao(criarMissao(), 'cidade'), /Reúna Caju e Romã/, 'antes do showroom, o objetivo é o de sempre');
  const f = criarMissao(); f.fase = 'fachada'; assert.match(objetivoMissao(f), /Fale com Pedro/);
  f.conversouPedro = true; assert.match(objetivoMissao(f), /Entre no showroom/, 'quem volta à fachada não é mandado falar com Pedro de novo');
  for (const fase of ['cidade', 'fachada', 'showroom']) { const n = criarMissao(); n.fase = fase; assert.doesNotMatch(objetivoMissao(n, 'cidade') + objetivoMissao(n), /segundo|tempo|rápido/i); }
});
