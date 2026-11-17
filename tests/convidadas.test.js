import test from 'node:test';
import assert from 'node:assert/strict';
import { atualizarConvidadas, despedirConvidada } from '../src/game/convidadas.js';
test('convidada acena por aproximação, abre conversa perto e não repete após despedida',()=>{
 const anim=[],falas=[];
 const npc={nome:'mariana',x:1530,perto:false,conversou:false,fim:4,sprite:{play:a=>anim.push(a),stop(){},setFrame(f){assert.equal(f,4);},disableInteractive(){}}};
 const scene={jogador:{x:1490},convidadas:[npc],abrirDialogo:n=>falas.push(n)};
 assert.equal(atualizarConvidadas(scene),false);assert.deepEqual(anim,['mariana-aceno']);
 scene.jogador.x=1510;assert.equal(atualizarConvidadas(scene),true);assert.deepEqual(falas,['mariana']);
 assert.equal(despedirConvidada(scene,'mariana'),true);
 assert.equal(atualizarConvidadas(scene),false);assert.equal(falas.length,1);
});
