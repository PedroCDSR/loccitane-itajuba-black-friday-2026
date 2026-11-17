// Assets preparados, integração opcional: não adiciona Karina à cena automaticamente.
export function carregarKarina(scene) {
  const base = 'assets/personagens/karina/';
  for (const nome of ['karina-parada', 'karina-aceno', 'karina-conversa']) {
    scene.load.spritesheet(nome, `${base}${nome}.png`, { frameWidth: 90, frameHeight: 180 });
  }
  scene.load.json('karina-animacoes', `${base}karina-animacoes.json`);
}
export function criarKarina(scene, x, y, escala = 1/3) {
  const config = scene.cache.json.get('karina-animacoes');
  if (!config || !scene.textures.exists('karina-parada')) throw new Error('Chame carregarKarina no preload da cena');
  for (const a of config.animations) {
    if (!scene.anims.exists(a.key)) scene.anims.create({
      key: a.key,
      frames: scene.anims.generateFrameNumbers(a.texture, { start: a.start, end: a.end }),
      frameRate: a.frameRate,
      repeat: a.repeat,
    });
  }
  const karina = scene.add.sprite(x, y, 'karina-parada', 0).setOrigin(.5, 1).setScale(escala);
  karina.play('karina-parada');
  karina.on('animationcomplete-karina-aceno', () => karina.play('karina-parada'));
  return karina;
}
