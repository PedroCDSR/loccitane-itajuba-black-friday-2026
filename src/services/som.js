// Sons do jogo, todos gerados em código com Web Audio: nenhum arquivo de áudio, nada de terceiros nem do projeto anterior.
//
// - O contexto de áudio só nasce no primeiro toque ou tecla (exigência do iPhone/Safari) e é retomado a cada gesto.
// - A escolha liga/desliga fica no localStorage ('aventura-som'); se o navegador bloquear o armazenamento, vale "ligado".
// - definirAtivo(false) suspende tudo (pausa, aba escondida, janela sem foco); definirAtivo(true) retoma.
// - Volumes: efeitos num barramento a 0,5 e música a 0,1, com um compressor no fim para segurar picos.

const CHAVE = 'aventura-som';
const N = m => 440 * 2 ** ((m - 69) / 12); // nota MIDI → Hz

let ctx = null, efeitos = null, trilha = null, ruidoBuffer = null;
let ligado = lerPreferencia(), ativo = true;
const ultimoToque = {}; // evita o mesmo som dobrado no mesmo instante
export const historico = []; // últimos sons tocados (conferência no navegador)
const ouvintes = new Set();

function lerPreferencia() {
  try { return globalThis.localStorage?.getItem(CHAVE) !== 'desligado'; } catch { return true; }
}
function salvarPreferencia() {
  try { globalThis.localStorage?.setItem(CHAVE, ligado ? 'ligado' : 'desligado'); } catch { /* sem armazenamento: só nesta visita */ }
}

// ---------- Blocos de síntese (recebem o contexto para poderem ser renderizados fora do jogo) ----------
function tom(c, saida, t, { f, ate, dur, tipo = 'triangle', vol = .2, ataque = .006, filtro }) {
  const o = c.createOscillator(), g = c.createGain();
  o.type = tipo; o.frequency.setValueAtTime(f, t);
  if (ate) o.frequency.exponentialRampToValueAtTime(ate, t + dur);
  g.gain.value = 0; g.gain.setValueAtTime(.0001, t); g.gain.linearRampToValueAtTime(vol, t + ataque); g.gain.exponentialRampToValueAtTime(.0001, t + dur); // começa e termina mudo: sem estalo
  let fim = o;
  if (filtro) { const fl = c.createBiquadFilter(); fl.type = 'lowpass'; fl.frequency.value = filtro; o.connect(fl); fim = fl; }
  fim.connect(g); g.connect(saida); o.start(t); o.stop(t + dur + .03);
}
function ruido(c, saida, t, { dur, vol = .12, de = 600, ate = 2400, tipo = 'bandpass', q = 1.2, ataque = .01 }) {
  if (!ruidoBuffer || ruidoBuffer.sampleRate !== c.sampleRate) {
    ruidoBuffer = c.createBuffer(1, c.sampleRate, c.sampleRate);
    const d = ruidoBuffer.getChannelData(0); let s = 48271;
    for (let i = 0; i < d.length; i++) { s = (s * 16807) % 2147483647; d[i] = s / 1073741823.5 - 1; } // ruído fixo, sem Math.random
  }
  const b = c.createBufferSource(), fl = c.createBiquadFilter(), g = c.createGain();
  b.buffer = ruidoBuffer; fl.type = tipo; fl.Q.value = q;
  fl.frequency.setValueAtTime(de, t); fl.frequency.exponentialRampToValueAtTime(ate, t + dur);
  g.gain.value = 0; g.gain.setValueAtTime(.0001, t); g.gain.linearRampToValueAtTime(vol, t + ataque); g.gain.exponentialRampToValueAtTime(.0001, t + dur); // começa e termina mudo: sem estalo
  b.connect(fl); fl.connect(g); g.connect(saida); b.start(t); b.stop(t + dur + .03);
}
const sino = (c, s, t, nota, dur = .28, vol = .16) => { // timbre de "coleta": triângulo com um brilho de seno uma oitava acima
  tom(c, s, t, { f: N(nota), dur, vol }); tom(c, s, t, { f: N(nota + 12), dur: dur * .6, tipo: 'sine', vol: vol * .3 });
};

// Cada som: (contexto, saída, início). Curtos, em tons maiores, sem nada estridente.
export const SONS = {
  pulo: (c, s, t) => { tom(c, s, t, { f: N(67), ate: N(79), dur: .14, tipo: 'sine', vol: .2 }); tom(c, s, t, { f: N(79), ate: N(86), dur: .08, vol: .04 }); },
  toldo: (c, s, t) => { // "boing" macio do tecido
    tom(c, s, t, { f: 140, ate: 560, dur: .3, vol: .24, filtro: 1800 });
    tom(c, s, t + .02, { f: 280, ate: 1100, dur: .22, tipo: 'sine', vol: .07 });
  },
  arremesso: (c, s, t) => { ruido(c, s, t, { dur: .16, vol: .16, de: 500, ate: 2600 }); tom(c, s, t, { f: 620, ate: 330, dur: .1, tipo: 'sine', vol: .05 }); },
  capivara: (c, s, t) => { // três mordidinhas e um "hm!" contente
    for (let i = 0; i < 3; i++) tom(c, s, t + i * .11, { f: 250 - i * 15, ate: 190, dur: .07, tipo: 'square', vol: .1, filtro: 900 });
    tom(c, s, t + .36, { f: N(76), dur: .12, tipo: 'sine', vol: .1 }); tom(c, s, t + .45, { f: N(81), dur: .2, tipo: 'sine', vol: .1 });
  },
  caju: (c, s, t) => { sino(c, s, t, 84, .12); sino(c, s, t + .07, 88, .3); },
  roma: (c, s, t) => { sino(c, s, t, 81, .12); sino(c, s, t + .07, 88, .3); },
  caixa: (c, s, t) => { [79, 83, 86].forEach((n, i) => sino(c, s, t + i * .06, n, i === 2 ? .35 : .12, .14)); },
  kit: (c, s, t) => {
    [72, 76, 79, 84].forEach((n, i) => sino(c, s, t + i * .07, n, i === 3 ? .5 : .14, .1));
    ruido(c, s, t + .28, { dur: .3, vol: .05, de: 5000, ate: 9000, tipo: 'highpass', q: .7 });
  },
  vitrine: (c, s, t) => { // pequena fanfarra e acorde final
    [72, 76, 79].forEach((n, i) => sino(c, s, t + i * .13, n, .16, .13));
    for (const n of [72, 76, 79, 84]) tom(c, s, t + .4, { f: N(n), dur: .9, vol: .07, ataque: .03 });
    ruido(c, s, t + .4, { dur: .6, vol: .04, de: 6000, ate: 9000, tipo: 'highpass', q: .7 });
  },
  dormir: (c, s, t) => { // pisão: quique fofo e um "zzz" que desce devagar
    tom(c, s, t, { f: 180, ate: 420, dur: .16, vol: .16, filtro: 1400 });
    [74, 71, 67].forEach((n, i) => tom(c, s, t + .2 + i * .17, { f: N(n), ate: N(n - 2), dur: .22, tipo: 'sine', vol: .08, ataque: .03 }));
  },
  dano: (c, s, t) => { // "ops" grave e redondo, sem susto
    tom(c, s, t, { f: 330, ate: 150, dur: .24, vol: .2, filtro: 1400 }); tom(c, s, t, { f: 165, ate: 95, dur: .26, tipo: 'sine', vol: .14 });
  },
  transicao: (c, s, t) => {
    ruido(c, s, t, { dur: .55, vol: .08, de: 300, ate: 1500, tipo: 'lowpass', q: .7, ataque: .2 });
    for (const n of [67, 71, 74, 79]) tom(c, s, t + .12, { f: N(n), dur: 1, tipo: 'sine', vol: .045, ataque: .18 });
  },
  pedro: (c, s, t) => { // "olá!" em dois bipes de voz
    tom(c, s, t, { f: N(69), ate: N(72), dur: .1, tipo: 'square', vol: .07, filtro: 1500 });
    tom(c, s, t + .12, { f: N(74), ate: N(77), dur: .14, tipo: 'square', vol: .07, filtro: 1500 });
  },
  falta: (c, s, t) => { tom(c, s, t, { f: N(76), dur: .1, tipo: 'sine', vol: .1 }); tom(c, s, t + .1, { f: N(72), dur: .16, tipo: 'sine', vol: .1 }); },
  derruba: (c, s, t) => { // a entrega cai na intro
    ruido(c, s, t, { dur: .25, vol: .14, de: 500, ate: 140, tipo: 'lowpass', q: .8 });
    tom(c, s, t, { f: 220, ate: 80, dur: .28, vol: .14, filtro: 900 });
    for (let i = 0; i < 4; i++) tom(c, s, t + .12 + i * .08, { f: N(84 - i * 3), dur: .08, tipo: 'sine', vol: .06 });
  },
  botao: (c, s, t) => tom(c, s, t, { f: 900, ate: 700, dur: .05, tipo: 'sine', vol: .09 }),
};

// ---------- Contexto, desbloqueio e pausa ----------
function montar() {
  const AC = globalThis.AudioContext || globalThis.webkitAudioContext;
  if (!AC) return false;
  ctx = new AC();
  const comp = ctx.createDynamicsCompressor(), mestre = ctx.createGain();
  comp.threshold.value = -14; comp.ratio.value = 4; mestre.gain.value = .9;
  efeitos = ctx.createGain(); efeitos.gain.value = .5;
  trilha = ctx.createGain(); trilha.gain.value = .1;
  efeitos.connect(mestre); trilha.connect(mestre); mestre.connect(comp); comp.connect(ctx.destination);
  // iOS antigo só libera o áudio depois de algo tocar dentro do gesto: um buffer mudo resolve.
  const mudo = ctx.createBufferSource(); mudo.buffer = ctx.createBuffer(1, 1, 22050); mudo.connect(ctx.destination); mudo.start(0);
  return true;
}
function acordar() {
  if (!ligado || !ativo) return;
  if (!ctx && !montar()) return;
  if (ctx.state !== 'running') ctx.resume().catch(() => {});
}
// Chamar uma vez: todo gesto da pessoa tenta (re)abrir o áudio; cliques em botões da página fazem um "tic".
export function prepararSom() {
  if (typeof window === 'undefined') return;
  for (const ev of ['pointerdown', 'touchend', 'keydown', 'click']) window.addEventListener(ev, acordar, { capture: true, passive: true });
  document.addEventListener('click', e => {
    const b = e.target?.closest?.('button');
    if (b && !b.dataset.controle && !b.classList.contains('som-alternar')) tocar('botao');
  });
}
export function somLigado() { return ligado; }
export function aoMudarSom(fn) { ouvintes.add(fn); }
export function alternarSom() {
  ligado = !ligado; salvarPreferencia();
  if (ligado) { acordar(); tocar('botao'); } else ctx?.suspend().catch(() => {});
  for (const fn of ouvintes) fn(ligado);
  return ligado;
}
// Falso na pausa, com a aba escondida ou a janela sem foco: suspende efeitos e música juntos.
export function definirAtivo(valor) {
  ativo = valor;
  if (!ctx) return;
  if (ativo && ligado) ctx.resume().catch(() => {}); else ctx.suspend().catch(() => {});
}

export function tocar(nome) {
  const som = SONS[nome];
  if (!som || !ligado || !ativo || !ctx || ctx.state !== 'running') return;
  const t = ctx.currentTime;
  if (t - (ultimoToque[nome] ?? -1) < .06) return;
  ultimoToque[nome] = t;
  historico.push(nome); if (historico.length > 60) historico.shift();
  som(ctx, efeitos, t + .005);
}

// ---------- Música de fundo: 8 compassos em Dó maior, 92 bpm, timbres suaves e volume baixo ----------
const COLCHEIA = 60 / 92 / 2;
const ACORDES = [[48, 55, 64], [45, 52, 60], [41, 48, 57], [43, 50, 59], [48, 55, 64], [45, 52, 60], [41, 48, 57], [43, 50, 62]]; // C Am F G C Am F G
const MELODIA = [
  76, null, 79, null, 81, 79, 76, null, 72, null, 76, null, 74, null, 72, null,
  69, null, 72, null, 74, 76, 77, null, 74, null, 71, null, 74, null, null, null,
  76, null, 79, null, 81, null, 84, 81, 79, null, 76, null, 74, 76, 72, null,
  69, null, 72, 74, 77, null, 76, 74, 71, null, 74, null, 72, null, null, null,
];
let relogioMusica = 0, proxima = 0, passo = 0;
export function tocarCompasso(c, saida, t, i) { // uma colcheia da trilha (exportado para conferência)
  const acorde = ACORDES[Math.floor(i / 8) % ACORDES.length], p = i % 8, nota = MELODIA[i % MELODIA.length];
  if (p === 0 || p === 4) tom(c, saida, t, { f: N(acorde[0] + (p === 4 ? 7 : 0)), dur: COLCHEIA * 3.6, tipo: 'triangle', vol: .35, filtro: 700, ataque: .02 });
  if (p === 2 || p === 6) for (const n of acorde.slice(1)) tom(c, saida, t, { f: N(n + 12), dur: COLCHEIA * 1.6, vol: .1, ataque: .01, filtro: 1600 });
  if (nota) tom(c, saida, t, { f: N(nota), dur: COLCHEIA * 1.8, vol: .3, ataque: .015, filtro: 2600 });
}
function agendar() {
  if (!ctx || ctx.state !== 'running') return;
  if (proxima < ctx.currentTime) proxima = ctx.currentTime + .06; // aba voltou de segundo plano: recomeça do ponto atual
  while (proxima < ctx.currentTime + .25) { tocarCompasso(ctx, trilha, proxima, passo++); proxima += COLCHEIA; }
}
export function musica(tocando) {
  clearInterval(relogioMusica); relogioMusica = 0;
  if (!tocando) return;
  passo = 0; proxima = 0;
  relogioMusica = setInterval(agendar, 60);
}
