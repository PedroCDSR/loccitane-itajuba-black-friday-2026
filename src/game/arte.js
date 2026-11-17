// Animações a partir das folhas desenhadas: nenhuma personagem procedural sobreposta.
export function criarArte(scene) {
  const anim = (key, texture, numeros, frameRate, repeat = -1) => {
    if (!scene.anims.exists(key)) scene.anims.create({ key, frames: numeros.map(frame => ({ key: texture, frame })), frameRate, repeat });
  };
  anim('parado', 'jogador', [0, 1, 2, 3], 3);
  anim('correndo', 'exploradora-corrida', [0, 1, 2, 3, 4, 5, 6, 7], 12);
  anim('pulando', 'exploradora-salto', [0, 1], 8, 0);
  anim('caindo', 'exploradora-salto', [2, 3], 6, 0);
  anim('aterrissando', 'exploradora-salto', [4, 5], 14, 0);
  anim('arremessando', 'exploradora-fruta', [0, 1, 2], 12, 0);
  anim('dano', 'exploradora-susto', [0], 1, 0);
  anim('capivara-andar', 'capivara', [0, 1, 2, 3], 5);
  anim('capivara-comer', 'capivara-comendo', [0, 1, 2, 3], 4);
  // dormindo: só os quadros de olhos fechados, bem devagar (a respiração é uma escala leve na cena)
  anim('capivara-dormir', 'capivara-comendo', [1, 2], 1.2);
}
