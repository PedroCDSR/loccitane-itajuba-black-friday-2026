// Assets preparados, integração opcional: não adiciona Carina à cena automaticamente.
export function carregarCarina(scene) {
  const base = 'assets/personagens/carina/';
  for (const nome of ['carina-parada', 'carina-aceno', 'carina-conversa']) {
    scene.load.spritesheet(nome, `${base}${nome}.png`, { frameWidth: 90, frameHeight: 180 });
  }
  scene.load.json('carina-animacoes', `${base}carina-animacoes.json`);
}
export function criarCarina(scene, x, y, escala = 1/3) {
  const config = scene.cache.json.get('carina-animacoes');
  if (!config || !scene.textures.exists('carina-parada')) throw new Error('Chame carregarCarina no preload da cena');
  for (const a of config.animations) {
    if (!scene.anims.exists(a.key)) scene.anims.create({
      key: a.key,
      frames: scene.anims.generateFrameNumbers(a.texture, { start: a.start, end: a.end }),
      frameRate: a.frameRate,
      repeat: a.repeat,
    });
  }
  const carina = scene.add.sprite(x, y, 'carina-parada', 0).setOrigin(.5, 1).setScale(escala);
  carina.play('carina-parada');
  carina.on('animationcomplete-carina-aceno', () => carina.play('carina-parada'));
  return carina;
}
