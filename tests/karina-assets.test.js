import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { carregarKarina, criarKarina } from '../src/game/karina-animacoes.js';
const base=new URL('../public/assets/personagens/karina/',import.meta.url);
const config=JSON.parse(readFileSync(new URL('karina-animacoes.json',base),'utf8'));
test('Karina possui14 quadros e arquivos de tamanho exato com hashes válidos',()=>{
  assert.deepEqual(config.files.map(f=>f.frames),[4,6,4]);
  for(const f of [...config.files,config.combined]){
    const png=readFileSync(new URL(f.file,base));assert.equal(png.subarray(0,8).toString('hex'),'89504e470d0a1a0a');
    assert.equal(png.readUInt32BE(16),f.width);assert.equal(png.readUInt32BE(20),180);assert.equal(f.width,f.frames*90);
    if(f.sha256)assert.equal(createHash('sha256').update(png).digest('hex'),f.sha256);
  }
  for(const path of config.approvedFaces)assert.ok(readFileSync(new URL('../'+path,import.meta.url)).length>0);
});
test('helper carrega três folhas e aceno retorna à parada sem duplicar animações',()=>{
  const loaded=[],anims=new Map(),callbacks=new Map(),played=[];
  const sprite={setOrigin(){return this;},setScale(){return this;},play(key){played.push(key);return this;},on(key,fn){callbacks.set(key,fn);return this;}};
  const scene={load:{spritesheet:(...a)=>loaded.push(a),json(){}},cache:{json:{get:()=>config}},textures:{exists:()=>true},anims:{exists:key=>anims.has(key),create:a=>anims.set(a.key,a),generateFrameNumbers:(texture,range)=>Array.from({length:range.end-range.start+1},(_,i)=>({key:texture,frame:range.start+i}))},add:{sprite:()=>sprite}};
  carregarKarina(scene);assert.equal(loaded.length,3);for(const [, , opts] of loaded)assert.deepEqual(opts,{frameWidth:90,frameHeight:180});
  criarKarina(scene,0,0);criarKarina(scene,0,0);assert.equal(anims.size,3);
  assert.equal(anims.get('karina-aceno').repeat,0);callbacks.get('animationcomplete-karina-aceno')();assert.equal(played.at(-1),'karina-parada');
});
