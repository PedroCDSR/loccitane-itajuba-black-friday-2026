// Efeitos próprios. Sem músicas ou arquivos sonoros da campanha anterior.
let audio, ligado = false;
export function alternarSom() { ligado = !ligado; if (ligado) { audio ||= new (window.AudioContext || window.webkitAudioContext)(); audio.resume(); } return ligado; }
export function tocar(tipo) {
  if (!ligado || !audio) return;
  const o = audio.createOscillator(), g = audio.createGain(), t = audio.currentTime;
  o.type = 'triangle'; o.frequency.setValueAtTime(tipo === 'coleta' ? 700 : 280, t); o.frequency.exponentialRampToValueAtTime(tipo === 'coleta' ? 1200 : 440, t + .09);
  g.gain.setValueAtTime(.05, t); g.gain.exponentialRampToValueAtTime(.001, t + .12); o.connect(g); g.connect(audio.destination); o.start(); o.stop(t + .13);
}
