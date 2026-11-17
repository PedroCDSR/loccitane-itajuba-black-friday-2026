import * as Phaser from 'phaser';
import { Jogador } from './Jogador.js';
import { Entrada } from './Entrada.js';
import { criarArte } from './arte.js';
import { carregarPedro, criarPedro } from './pedro-animacoes.js';
import { ALTURA, MUNDO, DURACAO_SEGUNDOS, SHOWROOM, ZOOM_CIDADE, ZOOM_SHOWROOM } from './config.js';
import { CAMPANHA } from '../data/campanha.js';
import { registrar } from '../services/metricas.js';
import { tocar } from '../services/som.js';

const CIDADE = ['ceu','morros','casas','clube','fonte','cafe','igreja','posto','estatua','helicoptero','arvore','arvore2'];
const LUGARES = [['clube',450],['fonte',1250],['cafe',2000],['igreja',2750],['posto',3450],['estatua',4100],['helicoptero',4550]];
const CHAO = 240;                       // linha dos pés em todo o percurso
const FIM_CIDADE = SHOWROOM.x - 620;    // depois daqui a rua fica livre: a câmera aproxima para o showroom
const FACHADA = SHOWROOM.x, INTERIOR = SHOWROOM.x + SHOWROOM.largura;
const ESCALA = SHOWROOM.largura / 1672; // as artes originais têm 1672x941
// Converte um ponto medido na arte original (pixels) para o mundo do jogo.
const px = (base, x) => base + x * ESCALA, py = (y) => SHOWROOM.topo + y * ESCALA;

export class Aventura extends Phaser.Scene {
  constructor(){ super('Aventura'); }
  preload(){
    for(const n of CIDADE) this.load.image(n,`assets/cidade/${n}.png`);
    for(const n of ['fachada','interior','caju','roma']) this.load.image(n,`assets/showroom/${n}.png`);
    carregarPedro(this);
  }
  create(){
    if(!this.textures.exists('jogador')) criarArte(this);
    for(const n of ['fachada','interior','caju','roma','pedro-npc']) this.textures.get(n).setFilter(Phaser.Textures.FilterMode.LINEAR);
    this.fim=false; this.presentes=0; this.tempo=0; this.checkpoint=80; this.proximoArremesso=0;
    // Camadas de fundo: presas à tela na horizontal (parallax) e ao mundo na vertical, para acompanhar o zoom.
    this.add.image(240,0,'ceu').setOrigin(0).setScrollFactor(0,1);
    this.morros=this.add.tileSprite(240,0,480,ALTURA,'morros').setOrigin(0).setScrollFactor(0,1);
    this.casas=this.add.tileSprite(240,0,480,ALTURA,'casas').setOrigin(0).setScrollFactor(0,1);
    for(const [n,x] of LUGARES) this.add.image(x,238,n).setOrigin(.5,1);
    for(let x=150;x<FIM_CIDADE;x+=520) this.add.image(x,240,x%3?'arvore':'arvore2').setOrigin(.5,1);

    this.solidos=this.physics.add.staticGroup();
    for(let x=16;x<FACHADA;x+=32)this.solidos.create(x,256,'chao');
    for(let x=650;x<FIM_CIDADE;x+=600){this.solidos.create(x,224,'caixa'); this.solidos.create(x+32,224,'caixa');}
    this.criarShowroom();

    this.jogador=new Jogador(this,80,CHAO).setDepth(5);
    this.physics.add.collider(this.jogador,this.solidos);
    this.physics.add.collider(this.jogador,this.plataformas);

    this.itens=this.physics.add.staticGroup();
    for(let x=240,i=0;x<FIM_CIDADE+300;x+=160,i++) this.itens.create(x,i%5===0?146:207,i%3===0?'frasco':'presente');
    for(const [tipo,x,y] of this.itensShowroom){
      // halo claro atrás do produto: sem ele o frasco some no meio das prateleiras
      const halo=this.add.image(x,y,'halo').setScale(1/3).setDepth(3);
      const item=this.itens.create(x,y,tipo).setScale(1/3).setDepth(4).setData('halo',halo); item.refreshBody();
      this.tweens.add({targets:[item,halo],y:y-3,duration:900+((x*7)%400),yoyo:true,repeat:-1,ease:'Sine.inOut'});
    }
    this.physics.add.overlap(this.jogador,this.itens,(_,item)=>{item.getData('halo')?.destroy();item.destroy();this.presentes++;tocar('coleta');this.atualizarHUD();});

    this.capivaras=this.physics.add.group();
    for(let x=950;x<FIM_CIDADE;x+=1200){const c=this.capivaras.create(x,240,'capivara',0).setOrigin(.5,1);c.body.setSize(24,16).setOffset(4,7);c.setData('origem',x);c.play('capivara-andar');}
    this.physics.add.collider(this.capivaras,this.solidos);
    this.physics.add.overlap(this.jogador,this.capivaras,(j,c)=>{if(c.getData('alimentada'))return;const vida=j.levarDano(c.x,this.time.now);if(vida===0)j.reposicionar(this.checkpoint,200,this.time.now);this.atualizarHUD();});
    this.frutas=this.physics.add.group();
    this.physics.add.overlap(this.frutas,this.capivaras,(f,c)=>{if(c.getData('alimentada'))return;f.destroy();c.setData('alimentada',true);c.setVelocityX(0);c.play('capivara-comer');});

    this.physics.world.setBounds(0,0,MUNDO,ALTURA);
    const cam=this.cameras.main;
    cam.setZoom(ZOOM_CIDADE);cam.setBounds(0,0,MUNDO,ALTURA);cam.startFollow(this.jogador,true,.15,.15);cam.setDeadzone(64,56);
    this.entrada=new Entrada(this); this.atualizarHUD();
    this.events.once('shutdown',()=>{document.getElementById('controles').hidden=true;});
  }

  // Showroom: dois fundos prontos (fachada com jardim e interior), sem física própria.
  // A colisão é só o piso invisível e três tampos que se atravessam por baixo.
  criarShowroom(){
    const {topo}=SHOWROOM;
    // A borda esquerda da fachada entra em faixas cada vez mais opacas, para não cortar a cidade em linha reta.
    const FAIXAS=10, LF=2;
    for(let i=0;i<FAIXAS;i++) this.add.image(FACHADA,topo,'fachada').setOrigin(0).setScale(1/3).setCrop(i*LF*3,0,LF*3,540).setAlpha((i+1)/(FAIXAS+1));
    this.add.image(FACHADA,topo,'fachada').setOrigin(0).setScale(1/3).setCrop(FAIXAS*LF*3,0,960-FAIXAS*LF*3,540);
    this.add.image(INTERIOR,topo,'interior').setOrigin(0).setScale(1/3);
    this.add.image(FACHADA-4,240,'arvore2').setOrigin(.5,1);                      // suaviza a emenda com a cidade
    const g=this.add.graphics();                                                  // batente entre as duas salas
    g.fillStyle(0x4a2c1c).fillRect(INTERIOR-3,topo,6,150);g.fillStyle(0xd9a765).fillRect(INTERIOR-2,topo,2,150);
    const piso=this.add.zone(FACHADA+SHOWROOM.largura,255,SHOWROOM.largura*2,30);this.physics.add.existing(piso,true);this.solidos.add(piso);

    this.plataformas=this.physics.add.staticGroup();
    const tampo=(x1,x2,y)=>{const z=this.add.zone((x1+x2)/2,y+3,x2-x1,6);this.physics.add.existing(z,true);const c=z.body.checkCollision;c.down=c.left=c.right=false;this.plataformas.add(z);};
    tampo(px(FACHADA,846),px(FACHADA,1082),py(657));     // mesa de presentes da fachada
    tampo(px(FACHADA,1040),px(FACHADA,1640),py(432));    // topo das estantes da fachada
    tampo(px(INTERIOR,745),px(INTERIOR,1132),py(646));   // mesa de presentes do interior

    this.itensShowroom=[
      ['roma',px(FACHADA,330),200],['caju',px(FACHADA,520),196],
      ['roma',px(FACHADA,960),py(657)-22],['roma',px(FACHADA,1200),py(432)-18],['caju',px(FACHADA,1420),py(432)-18],
      ['roma',px(INTERIOR,300),198],['caju',px(INTERIOR,612),200],
      ['caju',px(INTERIOR,860),py(646)-58],['roma',px(INTERIOR,1010),py(646)-64],
      ['caju',px(INTERIOR,1330),200],['roma',px(INTERIOR,1520),182],
    ];

    // Pedro recebe na porta: parado, acena quando a exploradora chega e conversa enquanto o balão está aberto.
    // Os quadros têm 400 de altura lógica com os pés em 380; 0.158 dá cerca de 60 unidades de altura.
    const pedroX=px(FACHADA,694);
    this.pedro=criarPedro(this,pedroX,py(792)+3,.158).setDepth(2);
    this.pedro.off('animationcomplete-pedro-aceno');
    this.pedro.on('animationcomplete-pedro-aceno',()=>this.pedro.play(this.pedroPerto?'pedro-conversa':'pedro-parado'));
    const fala=this.add.text(0,0,CAMPANHA.boasVindasPedro,{fontFamily:'Georgia,serif',fontSize:'7px',color:'#3a2a22',align:'center',resolution:6,lineSpacing:1}).setOrigin(.5);
    const fx=pedroX+34, fy=py(792)-78, w=fala.width+10, h=fala.height+7;
    const balao=this.add.graphics();balao.fillStyle(0x3a2a22).fillRoundedRect(fx-w/2-1,fy-h/2-1,w+2,h+2,4);balao.fillStyle(0xfbf1dc).fillRoundedRect(fx-w/2,fy-h/2,w,h,3.5);
    balao.fillStyle(0xfbf1dc).fillTriangle(fx-22,fy+h/2-1,fx-14,fy+h/2-1,fx-24,fy+h/2+6);
    fala.setPosition(fx,fy);
    this.balao=this.add.container(0,0,[balao,fala]).setDepth(6).setAlpha(0);
    this.pedroX=pedroX;
  }

  atualizarHUD(){document.getElementById('presentes').textContent=`${this.presentes} presentes`;document.getElementById('vida').textContent=`${this.jogador.vida} ♥`;document.getElementById('tempo').textContent=`${Math.max(0,Math.ceil(DURACAO_SEGUNDOS-this.tempo))}s`;}
  concluir(){if(this.fim)return;this.fim=true;registrar('conclusao',{presentes:this.presentes});this.game.events.emit('conclusao',{presentes:this.presentes,tempo:Math.round(this.tempo)});this.scene.stop();}

  // Aproxima a câmera antes de o showroom aparecer e trava a vista na altura dos fundos (180 unidades).
  atualizarCamera(delta){
    const cam=this.cameras.main, x=this.jogador.x;
    const alvo=x>SHOWROOM.x-430?ZOOM_SHOWROOM:ZOOM_CIDADE;
    let z=cam.zoom+(alvo-cam.zoom)*Math.min(1,delta/260); if(Math.abs(z-alvo)<.01)z=alvo;
    if(z!==cam.zoom)cam.setZoom(z);
    const travada=z===ZOOM_SHOWROOM;
    if(travada!==this.vistaTravada){this.vistaTravada=travada;cam.setBounds(0,travada?SHOWROOM.topo:0,MUNDO,travada?SHOWROOM.altura:ALTURA);}
    cam.setFollowOffset(this.jogador.olhandoDireita?-40:40,0);
    this.morros.tilePositionX=cam.scrollX*.15;this.casas.tilePositionX=cam.scrollX*.4;
  }

  update(agora,delta){
    if(this.fim||!this.entrada)return;
    this.tempo+=delta/1000;this.entrada.atualizar();
    const soltou=this.jogador.atualizar(this.entrada,agora,delta,true);
    if(this.entrada.pularApertou)tocar('pulo');
    if(soltou&&agora>=this.proximoArremesso){this.proximoArremesso=agora+350;const dir=this.jogador.olhandoDireita?1:-1;const f=this.frutas.create(this.jogador.x+dir*22,this.jogador.y-20,'caju-fruta');f.body.setAllowGravity(false);f.setVelocityX(dir*260);this.time.delayedCall(1500,()=>{if(f.active)f.destroy();});}
    for(const c of this.capivaras.getChildren())if(!c.getData('alimentada')){const dir=Math.sin(agora/1800+c.getData('origem'))>0?1:-1;c.setVelocityX(dir*16);c.setFlipX(dir<0);}
    this.atualizarCamera(delta);
    const x=this.jogador.x;
    const perto=Math.abs(x-this.pedroX)<62;
    if(perto!==this.pedroPerto){this.pedroPerto=perto;this.pedro.play(perto?'pedro-aceno':'pedro-parado');}
    this.balao.setAlpha(Phaser.Math.Clamp(this.balao.alpha+(perto?1:-1)*delta/200,0,1));
    if(x>this.checkpoint+1000||(x>FACHADA+20&&this.checkpoint<FACHADA))this.checkpoint=Math.max(x,FACHADA+20);
    document.getElementById('local').textContent=x>INTERIOR?'Showroom · a saída fica à direita →':x>FACHADA+60?'Bem-vinda ao showroom':'Pelas ruas de Itajubá';
    this.atualizarHUD();if(this.tempo>=DURACAO_SEGUNDOS||x>MUNDO-14)this.concluir();
  }
}
