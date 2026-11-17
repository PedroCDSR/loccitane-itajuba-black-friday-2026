// Dicas da primeira partida, no estilo do jogo do Aladdin: um balão com seta aponta o botão certo e some quando
// a pessoa faz a ação (ou depois de alguns segundos). No computador, o texto mostra as teclas.
const $ = id => document.getElementById(id);
const TOQUE = typeof window !== 'undefined' && window.matchMedia?.('(pointer: coarse)').matches;
export const PASSOS = {
  andar: { alvo: 'direita', toque: 'Toque nas setas para andar', teclado: 'Use ← → (ou A/D) para andar', espera: 8000 },
  pular: { alvo: 'pular', toque: 'Toque em PULAR para saltar. Segure para ir mais alto!', teclado: 'Espaço (ou W) para saltar. Segure para ir mais alto!', espera: 8000 },
  caju: { alvo: 'fruta', toque: 'Toque em CAJU para dar uma fruta à capivara!', teclado: 'Aperte X para dar um caju à capivara!', espera: 9000 },
  toldo: { alvo: 'pular', toque: 'Pule no toldo da tendinha para quicar bem alto!', teclado: 'Pule no toldo da tendinha para quicar bem alto!', espera: 6000 },
};
export class Tutorial {
  constructor(ativo) { this.ativo = ativo; this.feitos = new Set(); this.atual = null; this.ate = 0; }
  // Mostra um passo (se ainda não foi feito e nenhum outro está na tela).
  mostrar(nome, agora) {
    if (!this.ativo || this.feitos.has(nome) || this.atual) return;
    const p = PASSOS[nome], botao = document.querySelector(`[data-controle="${p.alvo}"]`), dica = $('dica');
    this.atual = nome; this.ate = agora + p.espera;
    $('dica-texto').textContent = TOQUE ? p.toque : p.teclado;
    dica.hidden = false;
    document.querySelectorAll('.destaque').forEach(b => b.classList.remove('destaque'));
    botao?.classList.add('destaque');
    if (nome === 'andar') document.querySelector('[data-controle="esquerda"]')?.classList.add('destaque');
    // seta do balão alinhada ao centro do botão
    const painel = $('painel').getBoundingClientRect(), r = botao?.getBoundingClientRect();
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
