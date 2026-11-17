import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { EventEmitter } from 'node:events';
import { CAMPANHA } from '../src/data/campanha.js';
import { LARGURA, ALTURA, JOGADOR } from '../src/game/config.js';
import { percentualSeguro, podeResgatar, linkResgate, linkCompartilhar } from '../src/services/oferta.js';

function executarUI() {
  const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
  const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
  const elements=Object.fromEntries(ids.map(id=>[id,{hidden:true,textContent:'',disabled:false,checked:false,value:'',classList:{add(){},remove(){},toggle(){}},focus(){},setAttribute(){},reset(){},reportValidity(){return true;}}]));
  const games=[], events=[];
  class Game {
    constructor(config){this.config=config;this.events=new EventEmitter();this.starts=0;this.cleans=0;this.pauses=0;this.resumes=0;this.destroyed=false;
      this.registry=new Map();this.scene={start:()=>this.starts++,pause:()=>this.pauses++,resume:()=>this.resumes++,getScene:()=>({entrada:{limpar:()=>this.cleans++}})};games.push(this);}
    destroy(){this.destroyed=true;}
  }
  const context={document:{getElementById:id=>{assert.ok(elements[id],id);return elements[id];},body:{classList:{add(){},remove(){}}},addEventListener(){}},
    window:{addEventListener(){},location:{href:'https://example.com/jogo/',assign(){throw new Error('Contato externo indevido');}}},
    Phaser:{AUTO:0,Scale:{FIT:0,CENTER_BOTH:0},Game},Aventura:class{},CAMPANHA,LARGURA,ALTURA,JOGADOR,
    percentualSeguro,podeResgatar,linkResgate,linkCompartilhar,registrar:n=>events.push(n),alternarSom:()=>false};
  const source=readFileSync(new URL('../src/main.js',import.meta.url),'utf8').replace(/^import[^\n]*\n/gm,'').replaceAll('import.meta.env.DEV','false');
  vm.runInNewContext(source,context);
  return {elements,games,events};
}
test('começar abre a partida com a abertura encenada; jogar de novo reaproveita a instância sem abertura',async()=>{
  const {elements:e,games,events}=executarUI();
  await e.jogar.onclick();assert.equal(games.length,1);assert.equal(games[0].registry.get('comIntro'),true);
  assert.equal(e.inicio.hidden,true);assert.equal(e.partida.hidden,false);
  assert.equal(events.filter(n=>n==='inicio').length,1);
  games[0].events.emit('conclusao',{presentes:12,caju:6,roma:6,kits:3,motivo:'vitrine'});
  assert.match(e.resultado.textContent,/Vitrine pronta/);assert.equal(e.final.hidden,false);
  await e.novamente.onclick();assert.equal(games.length,1);assert.equal(games[0].starts,1);assert.equal(games[0].registry.get('comIntro'),false);assert.equal(e.final.hidden,true);
});
test('tempo parcial não apresenta vitrine completa e a configuração entregue bloqueia o resgate',async()=>{
  const {elements:e,games}=executarUI();await e.jogar.onclick();
  games[0].events.emit('conclusao',{presentes:2,caju:1,roma:1,kits:0,motivo:'tempo'});
  assert.match(e.resultado.textContent,/O tempo terminou/);assert.doesNotMatch(e.resultado.textContent,/Vitrine pronta/);
  e['ver-oferta'].onclick();assert.equal(e.nome.disabled,true);assert.equal(e.enviar.disabled,true);assert.equal(e.marketing.disabled,true);
  e.resgate.onsubmit({preventDefault(){}});
});
test('pausa e retomada são idempotentes e erro de assets permite nova tentativa',async()=>{
  const {elements:e,games}=executarUI();await e.jogar.onclick();
  e.pausar.onclick();e.pausar.onclick();assert.equal(games[0].pauses,1);assert.equal(e.pausa.hidden,false);
  e.continuar.onclick();assert.equal(games[0].resumes,1);assert.equal(e.pausa.hidden,true);
  games[0].events.emit('falha-assets');assert.equal(e['tentar-carga'].hidden,false);
  await e['tentar-carga'].onclick();assert.equal(games[0].destroyed,true);assert.equal(games.length,2);
});
