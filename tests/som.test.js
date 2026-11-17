import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const memoria = new Map();
globalThis.localStorage = { getItem: k => memoria.get(k) ?? null, setItem: (k, v) => memoria.set(k, String(v)) };
const som = await import('../src/services/som.js');

test('todos os eventos do jogo têm som próprio', () => {
  for (const nome of ['pulo', 'toldo', 'arremesso', 'capivara', 'caju', 'roma', 'caixa', 'kit', 'vitrine', 'dano', 'transicao', 'pedro', 'falta', 'derruba', 'botao', 'dormir'])
    assert.equal(typeof som.SONS[nome], 'function', nome);
  const aventura = readFileSync(new URL('../src/game/Aventura.js', import.meta.url), 'utf8');
  for (const nome of [...aventura.matchAll(/tocar\('(\w+)'\)/g)].map(m => m[1])) assert.ok(som.SONS[nome], `som inexistente: ${nome}`);
});

test('a escolha de som fica guardada e começa ligada', () => {
  assert.equal(som.somLigado(), true);
  let avisado;
  som.aoMudarSom(v => { avisado = v; });
  assert.equal(som.alternarSom(), false); assert.equal(memoria.get('aventura-som'), 'desligado'); assert.equal(avisado, false);
  assert.equal(som.alternarSom(), true); assert.equal(memoria.get('aventura-som'), 'ligado');
});

test('sem gesto da pessoa nenhum contexto de áudio é criado e tocar não quebra', () => {
  som.tocar('pulo'); som.tocar('nao-existe'); som.definirAtivo(false); som.definirAtivo(true);
  assert.deepEqual(som.historico, []);
});

test('nenhum arquivo de áudio externo no código do jogo', () => {
  const fonte = readFileSync(new URL('../src/services/som.js', import.meta.url), 'utf8');
  assert.doesNotMatch(fonte, /\.(mp3|ogg|wav|m4a)\b|fetch\(|new Audio\(/);
});

test('cada nota tem queda de volume no código, não dentro de comentário (sem estalo no fim)', () => {
  const fonte = readFileSync(new URL('../src/services/som.js', import.meta.url), 'utf8');
  const ativas = fonte.split('\n').map(l => l.replace(/\/\/.*$/, ''));
  assert.equal(ativas.filter(l => /exponentialRampToValueAtTime\(\.0001, t \+ dur\)/.test(l)).length, 2);
});

test('música de fundo vem do MIDI enviado pelo Pedro: notas válidas, em ordem, ~1 min 44 s', async () => {
  const { MUSICA } = await import('../src/data/musica.js');
  const n = MUSICA.notas;
  assert.equal(n.length % 4, 0); assert.equal(n.length / 4, 1108);
  for (let i = 0; i < n.length; i += 4) {
    assert.ok(n[i + 1] > 0 && n[i + 2] >= 21 && n[i + 2] <= 108 && n[i + 3] > 0 && n[i + 3] <= 127);
    if (i) assert.ok(n[i] >= n[i - 4], 'notas em ordem de início');
  }
  const segundos = MUSICA.fim / MUSICA.divisao * 60 / MUSICA.bpm;
  assert.ok(segundos > 100 && segundos < 108, `${segundos} s`);
  assert.equal(typeof som.tocarNota, 'function'); assert.equal(typeof som.musica, 'function');
});
