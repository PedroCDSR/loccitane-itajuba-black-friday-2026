import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { linkCupomWhatsApp } from '../src/services/cupom.js';
test('resgate abre o número da loja com código e link público para prévia',()=>{
 const link=new URL(linkCupomWhatsApp('553598137549','https://dev--loccitane-itajuba.netlify.app/recompensas/jogo10/'));
 assert.equal(link.origin,'https://wa.me');assert.equal(link.pathname,'/553598137549');
 const texto=link.searchParams.get('text');assert.match(texto,/JOGO10/);assert.match(texto,/10%/);assert.match(texto,/https:\/\/dev--loccitane-itajuba.netlify.app\/recompensas\/jogo10\//);
 assert.throws(()=>linkCupomWhatsApp('','https://example.com'));
 assert.throws(()=>linkCupomWhatsApp('553598137549','javascript:alert(1)'));
});
test('prévia tem metadados estáticos acessíveis ao WhatsApp e imagem PNG existente',()=>{
 const html=readFileSync('public/recompensas/jogo10/index.html','utf8');
 assert.match(html,/<meta property="og:image" content="https:\/\/dev--loccitane-itajuba.netlify.app\/assets\/recompensas\/cupom-jogo10.png">/);
 const png=readFileSync('public/assets/recompensas/cupom-jogo10.png');
 assert.equal(png.readUInt32BE(16),1536);assert.equal(png.readUInt32BE(20),1136);
});
