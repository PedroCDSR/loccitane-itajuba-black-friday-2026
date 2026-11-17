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
}

// Capivara dormindo: o primeiro quadro da folha "capivara-andando" com o olho redesenhado fechado
// (um risquinho curvo), sem arte nova. Coordenadas em pixels da folha (96×72 por quadro).
const OLHO = { x: 69, y: 16, w: 9, h: 7 }; // retângulo do olho aberto no quadro 0
export function criarCapivaraDormindo(scene) {
  if (scene.textures.exists('capivara-dormindo')) return;
  const origem = scene.textures.get('capivara').getSourceImage();
  const tela = scene.textures.createCanvas('capivara-dormindo', 96, 72), ctx = tela.getContext();
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(origem, 0, 0, 96, 72, 0, 0, 96, 72);
  // cobre o olho com o pelo logo abaixo dele e desenha a pálpebra fechada
  ctx.drawImage(origem, OLHO.x, OLHO.y + OLHO.h, OLHO.w, OLHO.h, OLHO.x, OLHO.y, OLHO.w, OLHO.h);
  ctx.fillStyle = '#4b2613';
  for (const [x, y] of [[70, 19], [71, 20], [72, 21], [73, 21], [74, 21], [75, 20], [76, 19]]) ctx.fillRect(x, y, 1, 1);
  tela.refresh();
}

// "Z" do sono em pixel art, desenhado em código (7×7 com contorno escuro).
export function criarZ(scene) {
  if (scene.textures.exists('zzz')) return;
  const g = scene.make.graphics({ x: 0, y: 0 }, false);
  const z = ['#######', '.....#.', '....#..', '...#...', '..#....', '.#.....', '#######'];
  g.fillStyle(0x2e1a33);
  z.forEach((linha, y) => [...linha].forEach((c, x) => { if (c === '#') g.fillRect(x, y, 3, 3); }));
  g.fillStyle(0xfff4df);
  z.forEach((linha, y) => [...linha].forEach((c, x) => { if (c === '#') g.fillRect(x + 1, y + 1, 1, 1); }));
  g.generateTexture('zzz', 9, 9); g.destroy();
}
