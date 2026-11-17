import test from 'node:test';
import assert from 'node:assert/strict';
import { desempenho } from '../src/data/recompensas.js';
test('kits obrigatórios não inflacionam pontuação; pouca vida e poucos produtos liberam5%',()=>{
 const p=desempenho({caju:3,roma:3,kits:3,vida:2,vidaMinima:2});assert.equal(p.total,60);assert.equal(p.pontosKits,0);assert.equal(p.chave,'roma');
 assert.equal(desempenho({caju:29,vida:2,vidaMinima:2,brindesShowroom:2}).chave,'roma');
});
test('10% exige pontuação, manter4vidas e pegar os dois produtos externos',()=>{
 const base={caju:9,roma:9,capim:9,kits:3,vida:4,vidaMinima:4,brindesShowroom:2};
 assert.equal(desempenho(base).chave,'bresil');
 for(const mudanca of [{vida:3,vidaMinima:3},{vidaMinima:3},{brindesShowroom:1},{brindesShowroom:0},{caju:3,roma:3,capim:3}])assert.notEqual(desempenho({...base,...mudanca}).chave,'bresil');
});
test('limites das faixas e valores inválidos',()=>{
 assert.equal(desempenho({caju:14,vida:5}).chave,'roma');
 assert.equal(desempenho({caju:15,vida:3}).chave,'caju');
 assert.equal(desempenho({caju:24,vida:4,brindesShowroom:2}).chave,'caju');
 assert.equal(desempenho({caju:25,vida:4,brindesShowroom:2}).chave,'bresil');
 assert.equal(desempenho({caju:-10,roma:NaN,kits:Infinity}).total,0);
});
