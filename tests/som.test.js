import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const memoria = new Map();
globalThis.localStorage = { getItem: k => memoria.get(k) ?? null, setItem: (k, v) => memoria.set(k, String(v)) };
const som = await import('../src/services/som.js');

test('todos os eventos do jogo têm som próprio', () => {
  for (const nome of ['pulo', 'toldo', 'arremesso', 'capivara', 'caju', 'roma', 'caixa', 'kit', 'vitrine', 'dano', 'transicao', 'conversa', 'falta', 'derruba', 'botao', 'dormir'])
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

test('instrumental local substitui a trilha antiga, com volume 0,8', () => {
 assert.equal(som.VOLUME_MUSICA,.8);
 assert.equal(som.ARQUIVO_MUSICA,'assets/audio/instrumental.mp3');
 assert.ok(readFileSync(new URL('../public/assets/audio/instrumental.mp3',import.meta.url)).length>1000);
});

test('cada nota tem queda de volume no código, não dentro de comentário (sem estalo no fim)', () => {
  const fonte = readFileSync(new URL('../src/services/som.js', import.meta.url), 'utf8');
  const ativas = fonte.split('\n').map(l => l.replace(/\/\/.*$/, ''));
  assert.equal(ativas.filter(l => /exponentialRampToValueAtTime\(\.0001, t \+ dur\)/.test(l)).length, 2);
});

test('trilha pausa, retoma e respeita o controle de som', () => {
 let play=0,pause=0;
 globalThis.document={baseURI:'https://example.com/jogo/'};
 globalThis.Audio=class {constructor(src){this.src=src;this.paused=true;}play(){play++;this.paused=false;return Promise.resolve();}pause(){pause++;this.paused=true;}};
 som.musica(true);assert.equal(play,1);
 som.definirAtivo(false);assert.equal(pause,1);
 som.definirAtivo(true);assert.equal(play,2);
 som.alternarSom();assert.equal(pause,2);
 som.alternarSom();assert.equal(play,3);
 som.musica(false);assert.equal(pause,3);
});
