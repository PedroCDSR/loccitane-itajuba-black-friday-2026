import { texturaDeQuadros } from './matriz.js';
import * as Phaser from 'phaser';
import { PALETA, CAPIVARA } from './capivara-arte.js';
import { ARTE_JOGADOR } from './config.js';
// Arte provisória ORIGINAL. Trocar as texturas pelos sprites finais sem alterar a física.
// k = pixels de textura por unidade: com k > 1 o desenho aceita frações e ganha detalhe.
function textura(scene, key, w, h, pintar, frames = 1, k = 1) {
  const t = scene.textures.createCanvas(key, w * frames * k, h * k), ctx = t.getContext();
  for (let f = 0; f < frames; f++) {
    ctx.save(); ctx.translate(f * w * k, 0); ctx.beginPath(); ctx.rect(0, 0, w * k, h * k); ctx.clip();
    const r = (x,y,a,b,c) => { ctx.fillStyle=c; ctx.fillRect(Math.round(x*k),Math.round(y*k),Math.max(1,Math.round(a*k)),Math.max(1,Math.round(b*k))); };
    pintar(r, f); ctx.restore(); t.add(f, 0, f*w*k, 0, w*k, h*k);
  } t.refresh();
  if (k > 1) t.setFilter(Phaser.Textures.FilterMode.LINEAR);
}
export function criarArte(scene) {
  texturaDeQuadros(scene, 'capivara', CAPIVARA.quadros, PALETA, CAPIVARA.largura, CAPIVARA.altura);
  // Exploradora original, alinhada à proposta: chapéu de palha com fita vermelha, cabelo cacheado,
  // jaqueta verde-oliva bordada, calça creme larga, botas e bolsa vermelha a tiracolo.
  // Quadros: 0-7 corrida, 8 pulo, 9 queda/aterrissagem, 10 arremesso, 11 dano, 12-13 parada.
  textura(scene,'jogador',48,64,(r,f) => {
    const corre = f < 8, a = f * Math.PI / 4;
    const s = corre ? Math.sin(a) : f === 8 ? .9 : f === 9 ? -.6 : 0;
    const y = corre ? -Math.abs(Math.cos(a)) * 1.3 : f === 8 ? -2 : f === 13 ? .7 : 0;
    const SK='#d9996b',SK2='#b8774f',CA='#3a2418',CA2='#5a3826',PA='#e9c98a',PA2='#c9a25e',FI='#a8323d',JA='#5f6b34',JA2='#47522a',JA3='#7d8a45',CR='#efe2c4',CR2='#cdbd9c',BO='#6b4426',BO2='#4a2e1a',BG='#a52f36',BG2='#7d2029',OU='#e6b84a';
    const perna = (d, tras) => {
      for (let i = 0; i < 4; i++) r(20.5 + d * (i / 4) * .8, 44 + y + i * 3, 9, 3.4, tras ? CR2 : CR);
      if (!tras) r(20.5 + d * .2, 44 + y, 2, 9, CR2);
      r(23.5 + d * .8, 55.6 + y * .4, 3, 3, tras ? SK2 : SK);
      r(21.5 + d, 58, 7, 5, tras ? BO2 : BO); r(26 + d, 60, 4, 3, tras ? BO2 : BO); r(21.5 + d, 62, 8.6, 1, BO2);
      if (!tras) r(23 + d, 58.6, 3, 1, '#8a5a34');
    };
    perna(-s * 6, true);
    r(20.6 - s * 3, 33 + y, 4, 9, JA2); r(21 - s * 4.5, 41.6 + y, 3, 3, SK2);          // braço de trás
    perna(s * 6, false);
    r(15.6,15+y,10,15,CA); r(14.4,19+y,2.4,4,CA); r(14.8,25+y,2.4,4,CA); r(17,29+y,5,2,CA); // cabelo cacheado
    for (const [hx,hy] of [[17,19],[19.4,23],[16.4,26],[20,28],[18,16.4]]) r(hx,hy+y,1.4,1.4,CA2);
    r(24,28+y,4,3.4,SK2);                                                               // pescoço
    r(19,31+y,12,14,JA); r(19,31+y,3,14,JA2); r(27,32+y,3,9,JA3); r(28.4,32+y,2.6,11,CR); r(19,44+y,12,1.3,JA2);
    for (const [fx,fy] of [[21.4,35],[24,38.4],[22,41],[25.4,34]]) r(fx,fy+y,1,1,OU);     // bordado
    for (let i = 0; i < 7; i++) r(21 + i * 1.2, 31 + y + i * 1.9, 1.4, 2.2, BG2);        // alça
    r(26.6,43+y,8,7,BG); r(26.6,43+y,8,2.4,BG2); r(30,46+y,1.4,1.4,OU);                  // bolsa
    r(21,16+y,11,12,SK); r(21,26+y,8,2,SK2); r(32,21+y,1.4,2.4,SK); r(20,16.4+y,3,9,CA);
    if (f === 11) r(27.6,20.4+y,2.6,.8,'#2a1a12'); else { r(28.3,19.6+y,1.4,2.4,'#2a1a12'); r(28.3,19.6+y,.7,.7,'#fff'); }
    r(27.4,18+y,2.8,.8,CA); r(28.6,24.6+y,2.6,.8,'#8f4a36'); r(25.6,22.6+y,2,1.4,'#e0876a');
    r(11,13.4+y,27,2.4,PA); r(11,15.4+y,27,1,PA2); r(17,7+y,14,6.6,PA); r(18.4,6+y,11,1.4,PA); // chapéu
    r(17,7+y,3,4,PA2); r(25,7.6+y,4,1.4,'#f6e0a8'); r(17,11+y,14,2.4,FI); r(17,11+y,3,2.4,BG2);
    if (f === 10) { r(27,33+y,10,4,JA); r(37,33.4+y,3,3,SK); }                           // braço estendido
    else if (f === 11) { r(26,27+y,4,8,JA); r(26.4,24.6+y,3,3,SK); }
    else { r(24 + s * 3, 33 + y, 4.4, 9, JA); r(24.4 + s * 3, 33 + y, 1.4, 9, JA3); r(24.6 + s * 4.5, 41.6 + y, 3, 3, SK); }
  },14,ARTE_JOGADOR);
  const frames = ns => ns.map(frame=>({key:'jogador',frame}));
  for (const [key,ns,fps] of [['parado',[12,13],2],['correndo',[0,1,2,3,4,5,6,7],12],['pulando',[8],1],['caindo',[9],1],['arremessando',[10],1],['dano',[11],1],['aterrissando',[9],1]]) scene.anims.create({key,frames:frames(ns),frameRate:fps,repeat:key==='correndo'||key==='parado'?-1:0});
  for(const [key,ns] of [['capivara-andar',[0,1]],['capivara-comer',[2,3]]]) scene.anims.create({key,frames:ns.map(frame=>({key:'capivara',frame})),frameRate:4,repeat:-1});
  textura(scene,'presente',20,24,r=>{r(2,6,16,17,'#8d2936');r(3,7,13,3,'#cf5558');r(8,5,3,18,'#dcb66e');r(4,1,5,5,'#edce8f');r(11,1,5,5,'#c39a52');r(2,22,16,2,'#5b2429');});
  textura(scene,'caju-fruta',16,18,r=>{r(5,1,5,5,'#76894c');r(6,5,6,4,'#f3be54');r(4,9,10,6,'#df763f');r(6,14,7,3,'#b4452c');r(4,10,3,3,'#ffc971');});
  textura(scene,'frasco',14,22,r=>{r(4,1,6,4,'#bcac83');r(2,6,10,15,'#647b48');r(3,7,3,12,'#b2be77');r(3,11,8,6,'#f1e4c2');r(5,13,4,2,'#a33840');});
  { // halo dos coletáveis do showroom
    const t=scene.textures.createCanvas('halo',132,132),c=t.getContext(),g=c.createRadialGradient(66,66,8,66,66,66);
    g.addColorStop(0,'rgba(255,244,214,.95)');g.addColorStop(.45,'rgba(255,226,160,.55)');g.addColorStop(1,'rgba(255,226,160,0)');
    c.fillStyle=g;c.fillRect(0,0,132,132);t.refresh();t.setFilter(Phaser.Textures.FilterMode.LINEAR);
  }
  textura(scene,'chao',32,32,r=>{r(0,0,32,32,'#8a7760');for(let y=0;y<32;y+=8)for(let x=0;x<32;x+=12){r(x+(y%16?4:0),y,10,7,'#ad9d81');r(x+(y%16?4:0),y,9,2,'#c7b69b');}r(0,0,32,2,'#dbccae');});
  textura(scene,'caixa',32,32,r=>{r(0,0,32,32,'#806044');r(2,2,28,27,'#b38b5a');r(5,4,3,24,'#d4b280');r(25,4,3,24,'#6f5238');r(0,0,32,3,'#e4c58d');r(1,26,30,3,'#805d3d');});
}
