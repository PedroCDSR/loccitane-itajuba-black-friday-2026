// Dicas da primeira partida, no estilo do jogo do Aladdin: um balão com seta aponta o botão certo e some quando
// a pessoa faz a ação (ou depois de alguns segundos). No computador, o texto mostra as teclas.
const $ = id => document.getElementById(id);
const TOQUE = typeof window !== 'undefined' && window.matchMedia?.('(pointer: coarse)').matches;
// Ordem na cidade: andar → pular → toldo (1ª tendinha) → pisão (1ª capivara) → caju (2ª capivara).
// "dano" aparece na primeira vez que uma capivara empurra de lado. No showroom: caixas → bancada → saída.
export const PASSOS = {
  andar: { alvo: 'direita', toque: 'Toque nas setas para andar', teclado: 'Use ← → (ou A/D) para andar', espera: 8000 },
  pular: { alvo: 'pular', toque: 'Toque em PULAR para saltar. Segure para ir mais alto!', teclado: 'Espaço (ou W) para saltar. Segure para ir mais alto!', espera: 8000 },
  toldo: { alvo: 'pular', toque: 'Pule no toldo da tendinha: ele quica bem alto e alcança os frascos lá de cima!', teclado: 'Pule no toldo da tendinha: ele quica bem alto e alcança os frascos lá de cima!', espera: 7000 },
  pisao: { alvo: 'pular', toque: 'Pule em cima da capivara para ela dormir!', teclado: 'Pule em cima da capivara para ela dormir! (Espaço)', espera: 7000 },
  caju: { alvo: 'fruta', toque: 'Outra capivara! Toque em CAJU: ela come feliz e deixa você passar.', teclado: 'Outra capivara! Aperte X: ela come o caju feliz e deixa você passar.', espera: 8000 },
  dano: { alvo: 'pular', toque: 'Encostar de lado tira 1 ♥. Pise nela, dê caju ou pule por cima!', teclado: 'Encostar de lado tira 1 ♥. Pise nela, dê caju (X) ou pule por cima!', espera: 6000 },
  caixas: { alvo: 'pular', toque: 'As caixas de presente estão no alto: suba pelas prateleiras!', teclado: 'As caixas de presente estão no alto: suba pelas prateleiras!', espera: 7000 },
  bancada: { alvo: 'direita', toque: 'Com Caju, Romã e caixa, passe pela bancada: o kit se monta sozinho!', teclado: 'Com Caju, Romã e caixa, passe pela bancada: o kit se monta sozinho!', espera: 7000 },
  saida: { alvo: 'direita', toque: 'Vitrine pronta! Siga para a SAÍDA →', teclado: 'Vitrine pronta! Siga para a SAÍDA → (D)', espera: 6000 },
};
export class Tutorial {
  constructor(ativo) { this.ativo = ativo; this.feitos = new Set(); this.atual = null; this.ate = 0; }
  // Mostra um passo (se ainda não foi feito e nenhum outro está na tela). "forcar" troca a dica atual.
  mostrar(nome, agora, forcar = false) {
    if (!this.ativo || this.feitos.has(nome) || this.atual === nome) return;
    if (this.atual && !forcar) return;
    if (this.atual) this.esconder();
    const p = PASSOS[nome], botao = document.querySelector(`[data-controle="${p.alvo}"]`), dica = $('dica');
    this.atual = nome; this.ate = agora + p.espera;
    $('dica-texto').textContent = TOQUE ? p.toque : p.teclado;
    dica.hidden = false;
    document.querySelectorAll('.destaque').forEach(b => b.classList.remove('destaque'));
    botao?.classList.add('destaque');
    if (nome === 'andar') document.querySelector('[data-controle="esquerda"]')?.classList.add('destaque');
    // seta do balão alinhada ao centro do botão
    const painel = $('painel')?.getBoundingClientRect() ?? { left: 0, width: 0 }, r = botao?.getBoundingClientRect();
    const centro = r ? (nome === 'andar' ? r.left - 6 : r.left + r.width / 2) - painel.left : painel.width / 2;
    dica.style.setProperty('--seta', `${Math.round(centro)}px`);
  }
  concluir(nome) {
    if (!this.ativo) return;
    this.feitos.add(nome);
    if (this.atual === nome) this.esconder();
  }
  atualizar(agora) { if (this.atual && agora > this.ate) { this.feitos.add(this.atual); this.esconder(); } }
  esconder() {
    this.atual = null; const dica = $('dica'); if (dica) dica.hidden = true;
    document.querySelectorAll('.destaque').forEach(b => b.classList.remove('destaque'));
  }
}
