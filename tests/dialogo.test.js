import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { SHOWROOM } from '../src/game/config.js';
import { CAMPANHA } from '../src/data/campanha.js';
import { criarArte } from '../src/game/arte.js';
import { FOLHAS } from '../src/game/assets.js';

test('conversa interrompe física/cronômetro e retoma uma vez descartando o input anterior',()=>{
  const elements={dialogo:{hidden:true},'dialogo-texto':{},'dialogo-titulo':{},'fechar-dialogo':{focus(){}},controles:{hidden:false},interagir:{hidden:false}};
  const source=readFileSync(new URL('../src/game/Aventura.js',import.meta.url),'utf8').replace(/^import[^\n]*\n/gm,'').replace('export class Aventura','class Aventura');
  const Klass=vm.runInNewContext(source+'\nAventura;',{Phaser:{Scene:class{}},CAMPANHA,SHOWROOM,document:{getElementById:id=>elements[id]}});
  const s=new Klass();let pauses=0,resumes=0,discard=0,velocity;
  let entrou=0;Object.assign(s,{tempo:22,fim:false,tweens:{add(){entrou++;}},pedroBancada:{},entrada:{limpar(){},ignorarAteSoltar(){discard++;},atualizar(){},interagirApertou:false},jogador:{body:{setVelocity(...v){velocity=v;}},play(){}},pedro:{play(){},disableInteractive(){}},physics:{world:{pause(){pauses++;},resume(){resumes++;}}}});
  s.abrirDialogo();assert.equal(elements.controles.hidden,false,'os botões ficam: esconder mudaria o tamanho da tela do jogo');assert.deepEqual(velocity,[0,0]);assert.equal(pauses,1);assert.equal(elements.dialogo.hidden,false);
  s.update(999999,2000);assert.equal(s.tempo,22);
  s.fecharDialogo();s.fecharDialogo();assert.equal(resumes,1);assert.equal(entrou,2,'Pedro sai da porta e aparece na bancada uma vez só');assert.equal(elements.dialogo.hidden,true);assert.equal(discard,2);
});
test('animações usam somente quadros disponíveis nas folhas novas e não são duplicadas no reinício',()=>{
  const anims=new Map();const scene={anims:{exists:key=>anims.has(key),create:a=>anims.set(a.key,a)}};
  criarArte(scene);const quantidade=anims.size;criarArte(scene);assert.equal(anims.size,quantidade);
  const counts={'jogador':4,'exploradora-corrida':8,'exploradora-salto':6,'exploradora-fruta':3,'exploradora-susto':1,capivara:4,'capivara-comendo':4};
  for(const a of anims.values())for(const f of a.frames){assert.ok(FOLHAS[f.key]);assert.ok(f.frame>=0&&f.frame<counts[f.key]);}
  assert.equal(anims.get('correndo').frames.length,8);assert.equal(anims.get('arremessando').repeat,0);
});
