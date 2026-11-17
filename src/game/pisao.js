// Contato entre a exploradora e uma capivara (lógica pura, sem Phaser, para testar).
// - capivara dormindo ou alimentada: nada acontece (não machuca);
// - exploradora descendo com os pés acima do meio da capivara: pisão (a capivara dorme e a exploradora quica);
// - qualquer outro contato com capivara acordada: dano (1 coração), a não ser que esteja piscando (invencível).
// Os pés podem ter afundado um pouco na capivara no quadro do contato; por isso vale a posição do quadro
// anterior (pé − velocidade × dt), como no jogo do Aladdin.
export const QUIQUE_PISAO = { normal: 300, segurando: 400 };
export function decidirContato({ pe, velocidadeY, meioCapivara, dormindo = false, alimentada = false, invencivel = false, dt = 1 / 60 }) {
  if (dormindo || alimentada) return 'nada';
  const peAntes = pe - Math.max(0, velocidadeY) * dt;
  if (velocidadeY > 0 && peAntes <= meioCapivara) return 'pisao';
  return invencivel ? 'nada' : 'dano';
}
