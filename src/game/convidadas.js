export const CONVIDADAS = [
  { nome: 'mariana', altura: 57, x: 1530, espera: [0,0,3,0], aceno: [0,1,1,6,1], conversa: [2,3,2,5], fim: 4 },
  { nome: 'marcela', altura: 64, x: 4200, espera: [0,1,2,3], aceno: [4,5,6,7], conversa: [8,9,8,9], fim: 10 },
];
export function carregarConvidadas(scene) {
  for (const {nome} of CONVIDADAS) scene.load.spritesheet(`${nome}-npc`, `assets/personagens/${nome}/${nome}-spritesheet.png`, {frameWidth:110,frameHeight:180});
}
export function criarConvidadas(scene, chao) {
  scene.convidadas = CONVIDADAS.map(config => {
    const {nome,x} = config;
    for(const [estado,frames,repeat] of [['parado',config.espera,-1],['aceno',config.aceno,0],['conversa',config.conversa,-1]]){
      if(!scene.anims.exists(`${nome}-${estado}`)) scene.anims.create({key:`${nome}-${estado}`,frames:frames.map(frame=>({key:`${nome}-npc`,frame})),frameRate:estado==='parado'?2:4,repeat});
    }
    const sprite=scene.add.sprite(x,chao,`${nome}-npc`,0).setOrigin(.5,1).setScale(config.altura / 170).setDepth(3).setInteractive({useHandCursor:true});
    scene[nome]=sprite;
    const estado={...config,sprite,perto:false,conversou:false};
    sprite.play(`${nome}-parado`);
    sprite.on(`animationcomplete-${nome}-aceno`,()=>sprite.play(`${nome}-parado`));
    sprite.on('pointerup',()=>{if(estado.perto&&!estado.conversou&&!scene.dialogoAberto)scene.abrirDialogo(nome);});
    return estado;
  });
}
export function atualizarConvidadas(scene) {
  for(const npc of scene.convidadas||[]){
    const distancia=Math.abs(scene.jogador.x-npc.x),perto=distancia<50;
    if(perto&&!npc.perto&&!npc.conversou)npc.sprite.play(`${npc.nome}-aceno`);
    npc.perto=perto;
    if(perto&&distancia<28&&!npc.conversou){scene.abrirDialogo(npc.nome);return true;}
  }
  return false;
}
export function despedirConvidada(scene,nome){
  const npc=scene.convidadas?.find(n=>n.nome===nome);
  if(!npc)return false;
  npc.conversou=true;npc.sprite.stop();npc.sprite.setFrame(npc.fim);npc.sprite.disableInteractive();
  return true;
}
