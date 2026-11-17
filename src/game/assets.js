// Texturas em resolução nativa: nomes estáveis para preservar a física e a cena.
export const CIDADE = {
  ceu: '01-ceu', morros: '02-serra-mantiqueira', casas: '03-casario',
  clube: '04-clube-itajubense', fonte: '05-fonte-praca', cafe: '06-cafe-vadinho',
  igreja: '07-igreja-matriz', posto: '08-posto-esso', estatua: '09-monumento-soldado',
  helicoptero: '10-helicoptero', arvore: '11-arvore-praca', arvore2: '12-ipe-amarelo', chao: '13-calcamento',
};
export const FOLHAS = {
  jogador: ['exploradora-parada', 144, 192],
  'exploradora-corrida': ['exploradora-corrida', 144, 192],
  'exploradora-salto': ['exploradora-salto', 144, 192],
  'exploradora-fruta': ['exploradora-fruta', 144, 192],
  'exploradora-susto': ['exploradora-susto', 144, 192],
  capivara: ['capivara-andando', 96, 72],
  'capivara-comendo': ['capivara-comendo', 96, 72],
};
export const OBJETOS = { presente: 'kit-presente', sacola: 'sacola-vermelha', embalagem: 'caixa-presente', 'caju-fruta': 'caju-fruta', caixa: 'cesto-palha' };
export function carregarArte(scene) {
  for (const [key, nome] of Object.entries(CIDADE)) scene.load.image(key, `assets/runtime-cidade/${nome}.webp`);
  for (const [key, [nome, frameWidth, frameHeight]] of Object.entries(FOLHAS)) scene.load.spritesheet(key, `assets/runtime-sprites/${nome}.webp`, { frameWidth, frameHeight });
  for (const [key, nome] of Object.entries(OBJETOS)) scene.load.image(key, `assets/runtime-sprites/${nome}.webp`);
}
