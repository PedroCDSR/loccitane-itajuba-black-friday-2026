import test from 'node:test';
import assert from 'node:assert/strict';
import { desempenho } from '../src/data/recompensas.js';
test('placar usa produtos coletados e kits, sem contar caixas, tempo ou dano',()=>{
 assert.deepEqual(desempenho({caju:3,roma:3,capim:0,kits:3,caixa:3,tempo:1000}),{produtos:6,kits:3,pontosProdutos:60,pontosKits:150,total:210,chave:'roma'});
});
test('maior faixa atingida libera exatamente um cupom, inclusive nos limites',()=>{
 for(const [produtos,chave] of [[29,'roma'],[30,'caju'],[39,'caju'],[40,'bresil']])assert.equal(desempenho({caju:produtos}).chave,chave);
 assert.equal(desempenho({caju:9,roma:9,capim:9,kits:3}).chave,'bresil');
 assert.equal(desempenho({caju:-10,roma:NaN,kits:Infinity}).total,0);
});
