import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
function criarEntrada() {
  const source=readFileSync(new URL('../src/game/Entrada.js',import.meta.url),'utf8').replace('export class Entrada','class Entrada');
  const C=vm.runInNewContext(source+'\nEntrada;',{window:new EventTarget(),document:{querySelectorAll:()=>[]},AbortController});
  const keys=Object.fromEntries(['esquerda','direita','pular','fruta','a','d','w','cima','j','interagir','confirmar'].map(k=>[k,{isDown:false}]));
  const scene={input:{keyboard:{addKeys:()=>keys,resetKeys:()=>Object.values(keys).forEach(k=>k.isDown=false)}},events:{once(){}}};
  return {e:new C(scene),keys};
}
test('fechar diálogo não transforma uma tecla ainda segurada em nova ação',()=>{
  for(const [key,action] of [['pular','pular'],['fruta','fruta'],['confirmar','interagir']]){
    const {e,keys}=criarEntrada();keys[key].isDown=true;e.atualizar();assert.equal(e[action+'Apertou'],true);
    e.ignorarAteSoltar();e.atualizar();assert.equal(e[action+'Apertou'],false);assert.equal(e[action],false);
    e.atualizar();assert.equal(e[action+'Apertou'],false);
    keys[key].isDown=false;e.atualizar();keys[key].isDown=true;e.atualizar();assert.equal(e[action+'Apertou'],true);
  }
});
test('dois toques combinam andar e saltar; ações opostas cancelam direção',()=>{
  const {e}=criarEntrada();e.toques.set(1,'direita');e.toques.set(2,'pular');e.atualizar();
  assert.equal(e.direita,true);assert.equal(e.pularApertou,true);
  e.toques.set(3,'esquerda');e.atualizar();assert.equal(e.direita,false);assert.equal(e.esquerda,false);assert.equal(e.pularApertou,false);
});
test('toque curto, iniciado e solto entre dois quadros, ainda dispara a ação uma vez',()=>{
  const {e}=criarEntrada();
  for(const acao of ['interagir','pular','fruta']){
    e.toques.set(9,acao);e.tocouAgora.add(acao);e.toques.delete(9);
    e.atualizar();assert.equal(e[acao+'Apertou'],true);
    e.atualizar();assert.equal(e[acao+'Apertou'],false);assert.equal(e[acao],false);
  }
});
