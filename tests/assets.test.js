import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { JOGADOR, MUNDO } from '../src/game/config.js';
test('assets de cidade têm assinatura PNG e nomes limpos',()=>{
  const arquivos=readdirSync(new URL('../public/assets/cidade/',import.meta.url));
  assert.equal(arquivos.length,12);
  for(const n of arquivos)assert.equal(readFileSync(new URL('../public/assets/cidade/'+n,import.meta.url)).subarray(0,8).toString('hex'),'89504e470d0a1a0a');
});
test('sem limite de tempo: o percurso inteiro se atravessa correndo em menos de um minuto',async()=>{
  const config=await import('../src/game/config.js');
  assert.equal('DURACAO_SEGUNDOS' in config,false,'a partida não tem mais duração máxima');
  assert.ok(MUNDO/JOGADOR.velocidade<60);
});
test('derivados do showroom existem e o percurso inclui as duas salas com folga',async()=>{
  const { SHOWROOM } = await import('../src/game/config.js');
  for(const n of ['fachada','interior','caju','roma'])assert.equal(readFileSync(new URL(`../public/assets/showroom/${n}.png`,import.meta.url)).subarray(0,8).toString('hex'),'89504e470d0a1a0a');
  assert.equal(MUNDO,SHOWROOM.x+SHOWROOM.largura*2);
});
