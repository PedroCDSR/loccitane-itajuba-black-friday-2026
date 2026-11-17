import test from 'node:test';
import assert from 'node:assert/strict';
import { paginar, LIMITE_PAGINA } from '../src/game/falas.js';
import { CAMPANHA } from '../src/data/campanha.js';

test('falas longas viram páginas curtas, sem cortar frases nem perder texto', () => {
  for (const fala of [...Object.values(CAMPANHA.conversas), ...CAMPANHA.introCena]) {
    const paginas = paginar(fala.texto);
    assert.equal(paginas.join(' '), fala.texto.trim(), 'o texto inteiro aparece, na ordem');
    for (const p of paginas) assert.ok(p.length <= LIMITE_PAGINA || !p.slice(0, -1).match(/[.!?] [A-ZÀ-Ú]/u), `página curta: ${p}`);
  }
  assert.ok(paginar(CAMPANHA.conversas.karina.texto).length >= 2, 'a fala da Karina fica em mais de uma página');
  assert.deepEqual(paginar('Oi.'), ['Oi.']);
});
