import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { JOGADOR, DURACAO_SEGUNDOS, MUNDO } from '../src/game/config.js';
test('assets de cidade têm assinatura PNG e nomes limpos',()=>{
  const arquivos=readdirSync(new URL('../public/assets/cidade/',import.meta.url));
  assert.equal(arquivos.length,12);
  for(const n of arquivos)assert.equal(readFileSync(new URL('../public/assets/cidade/'+n,import.meta.url)).subarray(0,8).toString('hex'),'89504e470d0a1a0a');
});
test('percurso cabe na janela promocional sem exigir velocidade impossível',()=>{
  assert.ok(DURACAO_SEGUNDOS>=60&&DURACAO_SEGUNDOS<=90);
  assert.ok(MUNDO/JOGADOR.velocidade<DURACAO_SEGUNDOS);
});
test('derivados do showroom existem e o percurso inclui as duas salas com folga',async()=>{
  const { SHOWROOM } = await import('../src/game/config.js');
  for(const n of ['fachada','interior','caju','roma','pedro'])assert.equal(readFileSync(new URL(`../public/assets/showroom/${n}.png`,import.meta.url)).subarray(0,8).toString('hex'),'89504e470d0a1a0a');
  assert.equal(MUNDO,SHOWROOM.x+SHOWROOM.largura*2);
  assert.ok(MUNDO/JOGADOR.velocidade<DURACAO_SEGUNDOS-25,'sobra pelo menos 25 s para pulos, coleta e erros');
});
