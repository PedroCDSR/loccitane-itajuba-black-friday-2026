// Unifica teclado e Pointer Events. Pointer capture permite andar + pular + arremessar.
export class Entrada {
  constructor(scene) {
    this.scene = scene; this.toques = new Map(); this.antes = {};
    this.keys = scene.input.keyboard.addKeys({ esquerda: 'LEFT', direita: 'RIGHT', pular: 'SPACE', fruta: 'X', a: 'A', d: 'D', w: 'W', cima: 'UP', j: 'J', interagir: 'E', confirmar: 'ENTER' });
    this.abort = new AbortController();
    const signal = this.abort.signal;
    document.querySelectorAll('[data-controle]').forEach(b => {
      b.addEventListener('pointerdown', e => { e.preventDefault(); b.setPointerCapture(e.pointerId); this.toques.set(e.pointerId, b.dataset.controle); b.classList.add('pressed'); }, {signal});
      const soltar = e => { this.toques.delete(e.pointerId); b.classList.remove('pressed'); };
      b.addEventListener('pointerup', soltar, {signal}); b.addEventListener('pointercancel', soltar, {signal}); b.addEventListener('lostpointercapture', soltar, {signal});
    });
    window.addEventListener('blur', () => this.limpar(), {signal});
    scene.events.once('shutdown', () => { this.abort.abort(); this.limpar(); });
  }
  limpar() { this.toques.clear(); this.scene.input.keyboard.resetKeys(); this.antes = {}; document.querySelectorAll('.pressed').forEach(b => b.classList.remove('pressed')); }
  ignorarAteSoltar() {
    this.antes = { pular: true, fruta: true, interagir: true };
    this.scene.input.keyboard.resetKeys();
    this.toques.clear();
  }
  atualizar() {
    const t = new Set(this.toques.values()), k = this.keys;
    this.esquerda = t.has('esquerda') || k.esquerda.isDown || k.a.isDown;
    this.direita = t.has('direita') || k.direita.isDown || k.d.isDown;
    if (this.esquerda && this.direita) this.esquerda = this.direita = false;
    this.pular = t.has('pular') || k.pular.isDown || k.w.isDown || k.cima.isDown;
    this.fruta = t.has('fruta') || k.fruta.isDown || k.j.isDown;
    this.pularApertou = this.pular && !this.antes.pular;
    this.frutaApertou = this.fruta && !this.antes.fruta;
    this.interagir = t.has('interagir') || k.interagir.isDown || k.confirmar.isDown;
    this.interagirApertou = this.interagir && !this.antes.interagir;
    this.antes = { pular: this.pular, fruta: this.fruta, interagir: this.interagir };
  }
}
