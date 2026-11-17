import test from 'node:test';
import assert from 'node:assert/strict';
import { percentualSeguro, podeResgatar, linkResgate, linkCompartilhar } from '../src/services/oferta.js';
import { CAMPANHA } from '../src/data/campanha.js';
const campanhaTeste = () => ({ oferta: { ativa: true, descontoPercentual: 10, validade: 'EXEMPLO DE TESTE', condicoes: 'SOMENTE TESTE' }, whatsapp: '5500000000000', privacidade: { responsavel: 'TESTE', contato: 'TESTE', retencao: 'TESTE' } });
test('teto de 10% e valores inválidos nunca geram benefício maior',()=>{
  assert.equal(percentualSeguro(90),10);assert.equal(percentualSeguro(-1),0);
  for(const valor of [NaN,Infinity,'10',null,undefined])assert.equal(percentualSeguro(valor),0);
});
test('configuração entregue não permite coleta nem resgate',()=>{
  assert.equal(podeResgatar(CAMPANHA),false);assert.throws(()=>linkResgate(CAMPANHA,'Teste',3));
});
test('resgate exige destino, condições, validade e privacidade',()=>{
  assert.equal(podeResgatar(campanhaTeste()),true);
  for(const campo of ['whatsapp']){const c=campanhaTeste();c[campo]='';assert.equal(podeResgatar(c),false);}
  for(const campo of ['validade','condicoes']){const c=campanhaTeste();c.oferta[campo]='';assert.equal(podeResgatar(c),false);}
  for(const campo of ['responsavel','contato','retencao']){const c=campanhaTeste();c.privacidade[campo]='';assert.equal(podeResgatar(c),false);}
  const c=campanhaTeste();c.oferta.descontoPercentual=11;assert.equal(podeResgatar(c),false);
});
test('mensagem codifica caracteres e marketing depende de opção explícita',()=>{
  const u=new URL(linkResgate(campanhaTeste(),'Ana & Bia',4));
  assert.match(u.searchParams.get('text'),/Ana & Bia/);assert.doesNotMatch(u.searchParams.get('text'),/novidades/);
  assert.match(new URL(linkResgate(campanhaTeste(),'Ana',4,true)).searchParams.get('text'),/novidades/);
});
test('compartilhamento remove parâmetros e fragmentos de contexto',()=>{
  const u=new URL(linkCompartilhar('https://example.com/jogo/?nome=segredo#teste'));
  assert.equal(u.hostname,'wa.me');assert.doesNotMatch(u.searchParams.get('text'),/segredo|teste|nome=/);
});
