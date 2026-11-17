import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { SHOWROOM } from '../src/game/config.js';
import { CAMPANHA } from '../src/data/campanha.js';
import { criarArte } from '../src/game/arte.js';
import { FOLHAS } from '../src/game/assets.js';
import { paginar } from '../src/game/falas.js';

test('conversa interrompe física/cronômetro e retoma uma vez descartando o input anterior',()=>{
  const elements={dialogo:{hidden:true},'dialogo-texto':{},'dialogo-titulo':{},'fechar-dialogo':{hidden:true,focus(){}},controles:{hidden:false},interagir:{hidden:false}};
  const source=readFileSync(new URL('../src/game/Aventura.js',import.meta.url),'utf8').replace(/^import[^\n]*\n/gm,'').replace('export class Aventura','class Aventura');
  const Klass=vm.runInNewContext(source+'\nAventura;',{Phaser:{Scene:class{}},CAMPANHA,SHOWROOM,paginar,tocar(){},document:{getElementById:id=>elements[id]}});
  const s=new Klass();let pauses=0,resumes=0,discard=0,velocity;
  let entrou=0;Object.assign(s,{tempo:22,fim:false,missao:{conversouKarina:false},tweens:{add(){entrou++;}},karinaBancada:{},entrada:{limpar(){},ignorarAteSoltar(){discard++;},atualizar(){},interagirApertou:false},jogador:{body:{setVelocity(...v){velocity=v;}},play(){}},karina:{play(){},disableInteractive(){}},physics:{world:{pause(){pauses++;},resume(){resumes++;}}}});
  s.abrirDialogo();assert.equal(elements.controles.hidden,false,'os botões ficam: esconder mudaria o tamanho da tela do jogo');assert.deepEqual(velocity,[0,0]);assert.equal(pauses,1);assert.equal(elements.dialogo.hidden,false);
  s.update(999999,2000);assert.equal(s.tempo,22);
  s.fecharDialogo();s.fecharDialogo();assert.equal(resumes,1);assert.equal(entrou,2,'Karina sai da porta e aparece na bancada uma vez só');assert.equal(s.missao.conversouKarina,true);assert.equal(elements.dialogo.hidden,true);assert.equal(discard,2);
});
test('Pedro na praça: conta a chegada da L’Occitane a Itajubá e não mexe na missão do showroom',()=>{
  const elements={dialogo:{hidden:true},'dialogo-texto':{},'dialogo-titulo':{},'fechar-dialogo':{hidden:true,focus(){}},controles:{hidden:false},interagir:{hidden:false}};
  const source=readFileSync(new URL('../src/game/Aventura.js',import.meta.url),'utf8').replace(/^import[^\n]*\n/gm,'').replace('export class Aventura','class Aventura');
  const Klass=vm.runInNewContext(source+'\nAventura;',{Phaser:{Scene:class{}},CAMPANHA,SHOWROOM,paginar,tocar(){},document:{getElementById:id=>elements[id]}});
  const s=new Klass();const tocadas=[];let entrou=0;
  Object.assign(s,{tempo:5,fim:false,missao:{conversouKarina:false},tweens:{add(){entrou++;}},entrada:{ignorarAteSoltar(){}},jogador:{body:{setVelocity(){}},play(){}},pedro:{play:a=>tocadas.push(a),disableInteractive(){}},karina:{play(){}},physics:{world:{pause(){},resume(){}}}});
  s.abrirDialogo('pedro');
  assert.match(elements['dialogo-titulo'].textContent,/Pedro/);
  assert.match(elements['dialogo-texto'].textContent,/janeiro de 2023/);
  s.avancarDialogo();assert.match(elements['dialogo-texto'].textContent,/autocuidado/,'segunda página');assert.equal(s.dialogoAberto,'pedro','avançar a página não fecha a conversa');
  s.avancarDialogo();assert.equal(s.dialogoAberto,false,'depois da última página, avançar fecha');
  assert.equal(s.pedroConversou,true);assert.equal(s.missao.conversouKarina,false);assert.equal(entrou,0,'a Karina continua na porta do showroom');
  assert.deepEqual(tocadas,['pedro-conversa','pedro-parado']);
});
test('animações usam somente quadros disponíveis nas folhas novas e não são duplicadas no reinício',()=>{
  const anims=new Map();const scene={anims:{exists:key=>anims.has(key),create:a=>anims.set(a.key,a)}};
  criarArte(scene);const quantidade=anims.size;criarArte(scene);assert.equal(anims.size,quantidade);
  const counts={'jogador':4,'exploradora-corrida':8,'exploradora-salto':6,'exploradora-fruta':3,'exploradora-susto':1,capivara:4,'capivara-comendo':4};
  for(const a of anims.values())for(const f of a.frames){assert.ok(FOLHAS[f.key]);assert.ok(f.frame>=0&&f.frame<counts[f.key]);}
  assert.equal(anims.get('correndo').frames.length,8);assert.equal(anims.get('arremessando').repeat,0);
});
test('abertura: a caixa some na cena da capivara, o toque não avança durante a cena e a fala continua depois',()=>{
  const el=()=>({hidden:true,textContent:'',classList:{add(){},remove(){}},setAttribute(){}});
  const elements={dialogo:el(),'dialogo-texto':el(),'dialogo-titulo':el(),'fechar-dialogo':el(),'pular-intro':el()};
  const source=readFileSync(new URL('../src/game/Aventura.js',import.meta.url),'utf8').replace(/^import[^\n]*\n/gm,'').replace('export class Aventura','class Aventura');
  const Klass=vm.runInNewContext(source+'\nAventura;',{Phaser:{Scene:class{}},CAMPANHA,SHOWROOM,paginar,tocar(){},document:{getElementById:id=>elements[id]}});
  const s=new Klass();let fimDaCena=null;
  Object.assign(s,{estado:'intro',passoIntro:-1,entrada:{ignorarAteSoltar(){}},jogador:{setFlipX(){}},derrubarEntrega(f){fimDaCena=f;}});
  const fala=CAMPANHA.introCena.findIndex(l=>l.acao==='derrubar');assert.ok(fala>0,'uma fala da abertura tem a cena da capivara');
  s.avancarDialogo();assert.equal(elements.dialogo.hidden,false);assert.equal(elements['dialogo-titulo'].textContent,CAMPANHA.introCena[0].titulo);
  while(s.passoIntro<fala)s.avancarDialogo();
  assert.equal(elements.dialogo.hidden,true,'a caixa some durante a cena');assert.equal(elements['fechar-dialogo'].hidden,true);
  s.avancarDialogo();s.avancarDialogo();assert.equal(s.passoIntro,fala,'tocar durante a cena não pula falas');
  fimDaCena();assert.equal(elements.dialogo.hidden,false);assert.equal(elements['dialogo-titulo'].textContent,CAMPANHA.introCena[fala].titulo);
  let terminou=false;s.comecarJogo=()=>{terminou=true;};s.tweens={killTweensOf(){}};s.capivaraIntro={destroy(){}};s.entregaIntro=[];s.frascosIntro=[];
  s.terminarIntro();assert.equal(terminou,true,'Pular abertura funciona');assert.equal(elements.dialogo.hidden,true);
});
