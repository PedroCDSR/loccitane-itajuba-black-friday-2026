import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { CIDADE, FOLHAS, OBJETOS } from '../src/game/assets.js';
const root = new URL('../public/assets/', import.meta.url);
function png(path) { const b = readFileSync(new URL(path, root)); assert.equal(b.subarray(0,8).toString('hex'), '89504e470d0a1a0a'); return [b.readUInt32BE(16), b.readUInt32BE(20)]; }
test('cada textura nova da cena tem arquivo real e folhas têm células completas', () => {
  for (const nome of Object.values(CIDADE)) png(`cidade-entardecer/${nome}.png`);
  for (const [nome, w, h] of Object.values(FOLHAS)) { const [pw, ph] = png(`sprites-nativos/${nome}.png`); assert.equal(ph, h); assert.equal(pw % w, 0); }
  for (const nome of Object.values(OBJETOS)) png(`sprites-nativos/${nome}.png`);
});
test('intro, HUD, diálogo e interações têm IDs únicos presentes na página', () => {
  const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
  assert.equal(new Set(ids).size, ids.length);
  for (const id of ['intro','intro-titulo','intro-proximo','objetivo','kits','interagir','dialogo','dialogo-texto','fechar-dialogo']) assert.ok(ids.includes(id), id);
});
function dimensoesWebp(path) {
  const b = readFileSync(new URL(path, root));
  assert.equal(b.toString('ascii',0,4), 'RIFF'); assert.equal(b.toString('ascii',8,12), 'WEBP');
  for (let at=12; at+8<=b.length;) {
    const tag=b.toString('ascii',at,at+4), size=b.readUInt32LE(at+4), start=at+8;
    if(tag==='VP8X')return [1+b.readUIntLE(start+4,3),1+b.readUIntLE(start+7,3)];
    if(tag==='VP8L'){assert.equal(b[start],0x2f);const bits=b.readUInt32LE(start+1);return [(bits&0x3fff)+1,((bits>>>14)&0x3fff)+1];}
    at=start+size+(size%2);
  }
  throw new Error('WebP sem cabeçalho de dimensões: '+path);
}
test('versões runtime mantêm as dimensões dos 25 PNGs entregues',()=>{
  const manifest=JSON.parse(readFileSync(new URL('../docs/pacotes/runtime.json',import.meta.url),'utf8'));
  assert.equal(manifest.files.length,25);
  for(const f of manifest.files)assert.deepEqual(dimensoesWebp(f.runtime),png(f.source));
});
