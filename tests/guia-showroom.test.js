import test from 'node:test';
import assert from 'node:assert/strict';
import { enquadramento, emPe, LARGURA_MIN_SHOWROOM } from '../src/game/guiaShowroom.js';
import { ALTURA_SHOWROOM } from '../src/game/config.js';

test('celular em pé: sem mapa da loja e ao menos 136 unidades de largura no showroom', () => {
  for (const altura of [1562, 1599, 1631, 1700]) { // 390x844, 412x915 e afins (canvas de 960 de largura)
    assert.ok(emPe(960, altura));
    const e = enquadramento(960, altura);
    assert.equal(e.mapa, undefined, 'o mapa da loja saiu');
    assert.ok(960 / e.zoom >= LARGURA_MIN_SHOWROOM - 1e-9, 'mostra pelo menos 136 de largura');
    assert.ok(altura / e.zoom >= ALTURA_SHOWROOM - 1e-9, 'a altura inteira do showroom continua visível');
  }
});

test('computador e celular deitado: zoom pela altura como antes', () => {
  for (const altura of [540, 784, 960]) {
    assert.equal(emPe(960, altura), false);
    assert.deepEqual(enquadramento(960, altura), { zoom: altura / ALTURA_SHOWROOM });
  }
});
