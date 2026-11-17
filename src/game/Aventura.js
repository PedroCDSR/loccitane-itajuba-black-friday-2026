import * as Phaser from 'phaser';
import { Jogador } from './Jogador.js';
import { Entrada } from './Entrada.js';
import { criarArte } from './arte.js';
import { ALTURA, LARGURA, JOGADOR, MUNDO, DURACAO_SEGUNDOS } from './config.js';
import { registrar } from '../services/metricas.js';
import { tocar } from '../services/som.js';
const CIDADE = ['ceu','morros','casas','clube','fonte','cafe','igreja','posto','estatua','helicoptero','arvore','arvore2'];
export class Aventura extends Phaser.Scene {
  constructor(){ super('Aventura'); }
  preload(){ for(const n of CIDADE) this.load.image(n,`assets/cidade/${n}.png`); }
  create(){
    if(!this.textures.exists('jogador')) criarArte(this);
    this.fim=false; this.presentes=0; this.tempo=0; this.checkpoint=80; this.proximoArremesso=0;
    this.add.image(0,0,'ceu').setOrigin(0).setScrollFactor(0);
    this.morros=this.add.tileSprite(0,0,LARGURA,ALTURA,'morros').setOrigin(0).setScrollFactor(0);
    this.casas=this.add.tileSprite(0,0,LARGURA,ALTURA,'casas').setOrigin(0).setScrollFactor(0);
    for(const [n,x] of [['clube',450],['fonte',1550],['cafe',2650],['igreja',3700],['posto',4700],['estatua',5800],['helicoptero',6400]]) this.add.image(x,238,n).setOrigin(.5,1);
    for(let x=150;x<7700;x+=520) this.add.image(x,240,x%3?'arvore':'arvore2').setOrigin(.5,1);
    // Fachada baseada nas observações das seis fotos, sem copiar screenshot do Google.
    const g=this.add.graphics();g.fillStyle(0xb8a68f).fillRect(7690,68,380,172);g.fillStyle(0xd6c6a7).fillRect(7700,133,360,107);
    for(let y=137;y<235;y+=12)for(let x=7703;x<8060;x+=18){g.fillStyle([0xb7a17d,0xdbc8a4,0x9b896e][(x+y)%3]).fillRoundedRect(x,y,16,10,4);}
    g.fillStyle(0xa2333e).fillRect(7720,118,320,26);g.fillStyle(0xe3dccd).fillRect(7740,80,280,23);g.fillStyle(0x6d8079).fillRect(7750,83,260,17);
    this.add.text(7880,123,'L’OCCITANE AU BRÉSIL',{fontSize:'11px',color:'#fff3d5',fontFamily:'serif'}).setOrigin(.5,0);
    this.add.image(8070,0,'showroom',0).setOrigin(0);
    this.add.text(8420,10,'SHOWROOM • ITAJUBÁ',{fontSize:'11px',color:'#fff0d4'}).setOrigin(.5,0);
    this.solidos=this.physics.add.staticGroup();
    for(let x=16;x<MUNDO;x+=32)this.solidos.create(x,256,'chao');
    for(let x=650;x<7500;x+=600){this.solidos.create(x,224,'caixa'); this.solidos.create(x+32,224,'caixa'); if(x%4===2)this.solidos.create(x+32,192,'caixa');}
    this.jogador=new Jogador(this,80,240);this.physics.add.collider(this.jogador,this.solidos);
    this.itens=this.physics.add.staticGroup();
    for(let x=240,i=0;x<MUNDO-240;x+=160,i++) this.itens.create(x,i%5===0?146:207,i%3===0?'frasco':'presente').setData('coletado',false);
    this.physics.add.overlap(this.jogador,this.itens,(_,item)=>{if(item.getData('coletado'))return;item.setData('coletado',true);item.destroy();this.presentes++;tocar('coleta');this.atualizarHUD();});
    this.capivaras=this.physics.add.group();
    for(let x=1150;x<7400;x+=1050){const c=this.capivaras.create(x,240,'capivara',0).setOrigin(.5,1);c.body.setSize(24,16).setOffset(4,7);c.setData('origem',x);c.play('capivara-andar');}
    this.physics.add.collider(this.capivaras,this.solidos);
    this.physics.add.overlap(this.jogador,this.capivaras,(j,c)=>{if(c.getData('alimentada'))return;const vida=j.levarDano(c.x,this.time.now);if(vida===0)j.reposicionar(this.checkpoint,200,this.time.now);this.atualizarHUD();});
    this.frutas=this.physics.add.group();
    this.physics.add.overlap(this.frutas,this.capivaras,(f,c)=>{if(c.getData('alimentada'))return;f.destroy();c.setData('alimentada',true);c.setVelocityX(0);c.play('capivara-comer');});
    this.physics.world.setBounds(0,0,MUNDO,ALTURA);
    this.cameras.main.setBounds(0,0,MUNDO,ALTURA);this.cameras.main.startFollow(this.jogador,true,.15,.15);this.cameras.main.setDeadzone(64,56);
    this.entrada=new Entrada(this); this.atualizarHUD();
    document.getElementById('local').textContent='Pelas ruas de Itajubá';
    this.events.once('shutdown',()=>{document.getElementById('controles').hidden=true;});
  }
  atualizarHUD(){document.getElementById('presentes').textContent=`${this.presentes} presentes`;document.getElementById('vida').textContent=`${this.jogador.vida} ♥`;document.getElementById('tempo').textContent=`${Math.max(0,Math.ceil(DURACAO_SEGUNDOS-this.tempo))}s`;}
  concluir(){if(this.fim)return;this.fim=true;registrar('conclusao',{presentes:this.presentes});this.game.events.emit('conclusao',{presentes:this.presentes,tempo:Math.round(this.tempo)});this.scene.stop();}
  update(agora,delta){
    if(this.fim||!this.entrada)return;
    this.tempo+=delta/1000;this.entrada.atualizar();
    const soltou=this.jogador.atualizar(this.entrada,agora,delta,true);
    if(this.entrada.pularApertou)tocar('pulo');
    if(soltou&&agora>=this.proximoArremesso){this.proximoArremesso=agora+350;const dir=this.jogador.olhandoDireita?1:-1;const f=this.frutas.create(this.jogador.x+dir*22,this.jogador.y-20,'caju');f.body.setAllowGravity(false);f.setVelocityX(dir*260);this.time.delayedCall(1500,()=>{if(f.active)f.destroy();});}
    for(const c of this.capivaras.getChildren())if(!c.getData('alimentada')){const dir=Math.sin(agora/1800+c.getData('origem'))>0?1:-1;c.setVelocityX(dir*16);c.setFlipX(dir<0);}
    const cam=this.cameras.main;cam.setFollowOffset(this.jogador.olhandoDireita?-40:40,0);this.morros.tilePositionX=cam.scrollX*.15;this.casas.tilePositionX=cam.scrollX*.4;
    if(this.jogador.x>this.checkpoint+1000)this.checkpoint=this.jogador.x;
    document.getElementById('local').textContent=this.jogador.x>7850?'Bem-vinda ao showroom':'Pelas ruas de Itajubá';
    this.atualizarHUD();if(this.tempo>=DURACAO_SEGUNDOS||this.jogador.x>MUNDO-110)this.concluir();
  }
}
