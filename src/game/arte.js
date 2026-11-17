import { texturaDeQuadros } from './matriz.js';
import { PALETA, CAPIVARA } from './capivara-arte.js';
// Arte provisória ORIGINAL. Trocar as texturas pelos sprites finais sem alterar a física.
function textura(scene, key, w, h, pintar, frames = 1) {
  const t = scene.textures.createCanvas(key, w * frames, h), ctx = t.getContext();
  for (let f = 0; f < frames; f++) {
    ctx.save(); ctx.translate(f * w, 0);
    const r = (x,y,a,b,c) => { ctx.fillStyle=c; ctx.fillRect(Math.round(x),Math.round(y),a,b); };
    pintar(r, f); ctx.restore(); t.add(f, 0, f*w, 0, w, h);
  } t.refresh();
}
export function criarArte(scene) {
  texturaDeQuadros(scene, 'capivara', CAPIVARA.quadros, PALETA, CAPIVARA.largura, CAPIVARA.altura);
  textura(scene,'jogador',48,64,(r,f) => {
    const passo = f < 8 ? Math.round(Math.sin(f*Math.PI/4)*5) : 0;
    const y = f < 8 ? Math.abs(passo)>3 ? -1 : 0 : f === 8 ? -3 : 0;
    r(17,17+y,19,22,'#312c24'); // cabelo
    r(20,15+y,14,17,'#aa6547'); r(22,17+y,12,13,'#e0a373');
    r(20,13+y,15,5,'#674729'); r(19,8+y,16,7,'#d7b573'); r(13,14+y,27,3,'#edce8f');
    r(30,20+y,2,2,'#342b21'); r(31,26+y,4,1,'#ad5c46');
    r(18,32+y,17,15,'#254e3c'); r(20,32+y,4,15,'#4d7960'); r(24,32+y,5,13,'#f0e1bd');
    r(17,34+y,5,13,'#365b43'); r(17+passo/2,44+y,5,6,'#dda079');
    r(30,34+y,5,12,'#365b43'); r(30-passo/2,44+y,5,5,'#dda079');
    r(23,33+y,2,17,'#a5643c'); r(28,42+y,10,10,'#a52f36'); r(29,43+y,7,2,'#df7b64');
    r(20,47+y,7,12+Math.min(0,passo),'#d8c8a4'); r(28,47+y,7,12-Math.max(0,passo),'#b6a68a');
    r(18+passo,57+y,10,5,'#48352c'); r(27-passo,57+y,10,5,'#614632');
    if(f===10) {r(33,33,10,4,'#e0a373');r(40,31,4,6,'#e0a373');}
  },12);
  const frames = ns => ns.map(frame=>({key:'jogador',frame}));
  for (const [key,ns,fps] of [['parado',[0,1],2],['correndo',[0,1,2,3,4,5,6,7],12],['pulando',[8],1],['caindo',[9],1],['arremessando',[10],1],['dano',[11],1],['aterrissando',[9],1]]) scene.anims.create({key,frames:frames(ns),frameRate:fps,repeat:key==='correndo'||key==='parado'?-1:0});
  for(const [key,ns] of [['capivara-andar',[0,1]],['capivara-comer',[2,3]]]) scene.anims.create({key,frames:ns.map(frame=>({key:'capivara',frame})),frameRate:4,repeat:-1});
  textura(scene,'presente',20,24,r=>{r(2,6,16,17,'#8d2936');r(3,7,13,3,'#cf5558');r(8,5,3,18,'#dcb66e');r(4,1,5,5,'#edce8f');r(11,1,5,5,'#c39a52');r(2,22,16,2,'#5b2429');});
  textura(scene,'caju',16,18,r=>{r(5,1,5,5,'#76894c');r(6,5,6,4,'#f3be54');r(4,9,10,6,'#df763f');r(6,14,7,3,'#b4452c');r(4,10,3,3,'#ffc971');});
  textura(scene,'frasco',14,22,r=>{r(4,1,6,4,'#bcac83');r(2,6,10,15,'#647b48');r(3,7,3,12,'#b2be77');r(3,11,8,6,'#f1e4c2');r(5,13,4,2,'#a33840');});
  textura(scene,'chao',32,32,r=>{r(0,0,32,32,'#8a7760');for(let y=0;y<32;y+=8)for(let x=0;x<32;x+=12){r(x+(y%16?4:0),y,10,7,'#ad9d81');r(x+(y%16?4:0),y,9,2,'#c7b69b');}r(0,0,32,2,'#dbccae');});
  textura(scene,'caixa',32,32,r=>{r(0,0,32,32,'#806044');r(2,2,28,27,'#b38b5a');r(5,4,3,24,'#d4b280');r(25,4,3,24,'#6f5238');r(0,0,32,3,'#e4c58d');r(1,26,30,3,'#805d3d');});
  textura(scene,'showroom',720,270,r=>{
    r(0,0,720,270,'#eee4cb');r(0,0,720,30,'#a8323d'); r(0,30,720,5,'#d0a358');r(0,225,720,45,'#a97848');
    for(let x=0;x<720;x+=120){r(x,44,8,182,'#d0b184');r(x+8,48,105,176,'#765036'); for(let y=63;y<225;y+=45){r(x+8,y,105,5,'#d6b888');for(let a=17;a<100;a+=19){const c=['#a5b67a','#bf7181','#e8ce94','#669d89'][(a+y)%4];r(x+a,y-24,10,23,c);r(x+a+2,y-28,6,5,'#cfccbc');r(x+a+1,y-16,8,8,'#f3e9ce');}}}
    r(308,122,104,104,'#f2e4c8');r(300,109,120,17,'#a52e39');r(340,142,40,44,'#c8ad72');r(344,146,32,36,'#e9dfbb');r(357,152,5,24,'#638052');
  });
}
