// Regras das capivaras, sem Phaser (testadas em tests/capivaras.test.js).
// Três jeitos de lidar com elas: pular por cima, cair em cima (ela dorme) ou dar caju (ela come feliz).
// Encostar de lado numa capivara acordada e com fome tira 1 coração.

// Força do quique ao pisar (segurando PULAR vai mais alto). O toldo das tendas quica mais: 360/430.
export const PISAO = { quique: 260, quiqueSegurando: 340, folga: 8 };

// Dormindo ou alimentada: não machuca, não anda e o caju passa direto.
export function capivaraInofensiva(estado) {
  return Boolean(estado?.dormindo || estado?.alimentada);
}

// O que acontece quando a exploradora encosta numa capivara.
// jogador: { vy, baseAnterior } — velocidade vertical (positiva = caindo) e a altura dos pés no quadro anterior.
// capivara: { topo, dormindo, alimentada } — topo do corpo da capivara.
// Devolve 'pisao' (veio de cima, caindo), 'dano' (encostou de lado) ou 'nada' (já está inofensiva).
export function contatoCapivara(jogador, capivara) {
  if (capivaraInofensiva(capivara)) return 'nada';
  if (jogador.vy > 0 && jogador.baseAnterior <= capivara.topo + PISAO.folga) return 'pisao';
  return 'dano';
}

export function forcaQuique(segurandoPular) {
  return segurandoPular ? PISAO.quiqueSegurando : PISAO.quique;
}
