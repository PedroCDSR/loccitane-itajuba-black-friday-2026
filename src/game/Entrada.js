// Unifica teclado e Pointer Events. Pointer capture permite andar + pular + arremessar.
export class Entrada {
  constructor(scene) {
    this.scene = scene; this.toques = new Map(); this.antes = {}; this.bloqueados = {}; this.tocouAgora = new Set();
    this.keys = scene.input.keyboard.addKeys({ esquerda: 'LEFT', direita: 'RIGHT', pular: 'SPACE', fruta: 'X', a: 'A', d: 'D', w: 'W', cima: 'UP', j: 'J', interagir: 'E', confirmar: 'ENTER' });
    this.abort = new AbortController();
    const signal = this.abort.signal;
    document.querySelectorAll('[data-controle]').forEach(b => {
      b.addEventListener('pointerdown', e => { e.preventDefault(); b.setPointerCapture(e.pointerId); this.toques.set(e.pointerId, b.dataset.controle); this.tocouAgora.add(b.dataset.controle); b.classList.add('pressed'); }, {signal});
      const soltar = e => { this.toques.delete(e.pointerId); b.classList.remove('pressed'); };
      b.addEventListener('pointerup', soltar, {signal}); b.addEventListener('pointercancel', soltar, {signal}); b.addEventListener('lostpointercapture', soltar, {signal});
    });
    window.addEventListener('blur', () => this.limpar(), {signal});
    scene.events.once('shutdown', () => { this.abort.abort(); this.limpar(); });
  }
  limpar() { this.toques.clear(); this.tocouAgora.clear(); this.scene.input.keyboard.resetKeys(); this.antes = {}; this.bloqueados = {}; document.querySelectorAll('.pressed').forEach(b => b.classList.remove('pressed')); }
  ignorarAteSoltar() {
    this.antes = { pular: true, fruta: true, interagir: true };
    this.bloqueados = { pular: true, fruta: true, interagir: true };
    // Preserva isDown/pointers até o release real: resetá-los liberaria o autorepeat do teclado.
  }
  atualizar() {
    // Um toque curto (dedo sai antes do próximo quadro) ainda vale por um quadro.
    const t = new Set([...this.toques.values(), ...this.tocouAgora]), k = this.keys;
    this.tocouAgora.clear();
    this.esquerda = t.has('esquerda') || k.esquerda.isDown || k.a.isDown;
    this.direita = t.has('direita') || k.direita.isDown || k.d.isDown;
    if (this.esquerda && this.direita) this.esquerda = this.direita = false;
    const raw = {
      pular: t.has('pular') || k.pular.isDown || k.w.isDown || k.cima.isDown,
      fruta: t.has('fruta') || k.fruta.isDown || k.j.isDown,
      interagir: t.has('interagir') || k.interagir.isDown || k.confirmar.isDown,
    };
    for (const acao of Object.keys(raw)) if (!raw[acao]) this.bloqueados[acao] = false;
    this.pular = raw.pular && !this.bloqueados.pular;
    this.fruta = raw.fruta && !this.bloqueados.fruta;
    this.pularApertou = this.pular && !this.antes.pular;
    this.frutaApertou = this.fruta && !this.antes.fruta;
    this.interagir = raw.interagir && !this.bloqueados.interagir;
    this.interagirApertou = this.interagir && !this.antes.interagir;
    this.antes = { pular: this.pular, fruta: this.fruta, interagir: this.interagir };
  }
}
