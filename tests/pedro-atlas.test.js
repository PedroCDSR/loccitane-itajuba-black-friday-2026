import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
const path = new URL('../public/assets/personagens/',import.meta.url);
const atlas = JSON.parse(readFileSync(new URL('pedro-atlas.json',path),'utf8'));
const config = JSON.parse(readFileSync(new URL('pedro-animacoes.json',path),'utf8'));
const png = readFileSync(new URL('pedro-spritesheet.png',path));
test('atlas de Pedro corresponde ao PNG e contém os 14 recortes dentro dos limites',()=>{
  assert.equal(png.subarray(0,8).toString('hex'),'89504e470d0a1a0a');
  assert.equal(png.readUInt32BE(16),atlas.meta.size.w);assert.equal(png.readUInt32BE(20),atlas.meta.size.h);
  assert.equal(Object.keys(atlas.frames).length,14);
  assert.equal(createHash('sha256').update(png).digest('hex'),config.sha256);
  for(const f of Object.values(atlas.frames)){
    assert.ok(f.frame.x>=0&&f.frame.y>=0&&f.frame.x+f.frame.w<=atlas.meta.size.w&&f.frame.y+f.frame.h<=atlas.meta.size.h);
    assert.ok(f.spriteSourceSize.x>=0&&f.spriteSourceSize.y>=0);
    assert.ok(f.spriteSourceSize.x+f.spriteSourceSize.w<=f.sourceSize.w&&f.spriteSourceSize.y+f.spriteSourceSize.h<=f.sourceSize.h);
  }
});
test('sequências usam exatamente os 14 quadros existentes sem referências quebradas',()=>{
  assert.deepEqual(config.animations.map(a=>a.frames.length),[4,6,4]);
  const names=config.animations.flatMap(a=>a.frames);assert.equal(new Set(names).size,14);
  for(const a of config.animations){assert.ok(a.frameRate>0);for(const n of a.frames)assert.ok(atlas.frames[n]);}
  assert.equal(config.animations.find(a=>a.key==='pedro-aceno').repeat,0);
});
