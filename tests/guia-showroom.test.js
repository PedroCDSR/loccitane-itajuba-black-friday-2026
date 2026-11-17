import test from 'node:test';
import assert from 'node:assert/strict';
import { enquadramento, emPe, LARGURA_MIN_SHOWROOM, MAPA } from '../src/game/guiaShowroom.js';
import { ALTURA_SHOWROOM, SHOWROOM } from '../src/game/config.js';

test('celular em pé: mapa da loja no alto e ao menos 150 unidades de largura no showroom', () => {
  for (const altura of [1562, 1599, 1631, 1700]) { // 390x844, 412x915 e afins (canvas de 960 de largura)
    assert.ok(emPe(960, altura));
    const { mapa, zoom } = enquadramento(960, altura);
    assert.equal(mapa, Math.round(960 * (MAPA.y2 - MAPA.y1) / SHOWROOM.largura));
    assert.ok(960 / zoom >= LARGURA_MIN_SHOWROOM - 1e-9, 'mostra pelo menos 150 de largura (antes ~110)');
    assert.ok((altura - mapa) / zoom >= ALTURA_SHOWROOM - 1e-9, 'a altura inteira do showroom continua visível');
  }
});

test('computador e celular deitado: sem mapa, zoom pela altura como antes', () => {
  for (const altura of [540, 784, 960]) {
    assert.equal(emPe(960, altura), false);
    assert.deepEqual(enquadramento(960, altura), { mapa: 0, zoom: altura / ALTURA_SHOWROOM });
  }
});
