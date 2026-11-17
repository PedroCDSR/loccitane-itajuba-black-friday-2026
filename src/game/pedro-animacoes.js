// Integração opcional: não altera a cena existente automaticamente.
export function carregarPedro(scene) {
  // No jogo usa a folha em metade da resolução (0,18 MB, em vez de 1,18 MB); o original continua em personagens/.
  scene.load.atlas('pedro-npc', 'assets/showroom/pedro-jogo.webp', 'assets/showroom/pedro-jogo.json');
  scene.load.json('pedro-animacoes', 'assets/personagens/pedro-animacoes.json');
}
export function criarPedro(scene, x, y, escala = 0.2) {
  const config = scene.cache.json.get('pedro-animacoes');
  if (!config || !scene.textures.exists('pedro-npc')) throw new Error('Chame carregarPedro no preload da cena');
  for (const anim of config.animations) {
    if (!scene.anims.exists(anim.key)) scene.anims.create({
      key: anim.key,
      frames: anim.frames.map(frame => ({ key: 'pedro-npc', frame })),
      frameRate: anim.frameRate,
      repeat: anim.repeat,
    });
  }
  const pedro = scene.add.sprite(x, y, 'pedro-npc', 'parado-0').setOrigin(0.5, 1).setScale(escala);
  pedro.play('pedro-parado');
  pedro.on('animationcomplete-pedro-aceno', () => pedro.play('pedro-parado'));
  return pedro;
}
