import * as Phaser from 'phaser';
import './style.css';
import { CAMPANHA } from './data/campanha.js';
import { Aventura } from './game/Aventura.js';
import { LARGURA, ALTURA, JOGADOR } from './game/config.js';
import { percentualSeguro, podeResgatar, linkResgate, linkCompartilhar } from './services/oferta.js';
import { registrar } from './services/metricas.js';
import { alternarSom } from './services/som.js';
const $=id=>document.getElementById(id);
let jogo, total=0, emPartida=false, pausado=false;
$('despedida').textContent=CAMPANHA.despedida;
$('som').onclick=()=>{const ligado=alternarSom();$('som').textContent=`Som: ${ligado?'ligado':'desligado'}`;$('som').setAttribute('aria-pressed',String(ligado));};
function pausar(){if(!emPartida||pausado||!jogo)return;const cena=jogo.scene.getScene('Aventura');if(!cena?.entrada)return;pausado=true;cena.entrada.limpar();jogo.scene.pause('Aventura');$('pausa').hidden=false;}
$('pausar').onclick=pausar;
$('continuar').onclick=()=>{if(!emPartida)return;$('pausa').hidden=true;pausado=false;jogo.scene.resume('Aventura');};
document.addEventListener('visibilitychange',()=>{if(document.hidden)pausar();});
window.addEventListener('blur',pausar);
window.addEventListener('keydown',e=>{if(e.code==='Escape'&&emPartida)pausar();});
function concluir({presentes}){
  total=presentes;emPartida=false;document.body.classList.remove('jogando');$('partida').hidden=true;$('pausar').hidden=true;$('final').hidden=false;
  $('resultado').textContent=`Você reuniu ${presentes} presentes e fez parte da nossa última aventura.`;
  $('beneficio').textContent=podeResgatar(CAMPANHA)?`Seu benefício: ${percentualSeguro(CAMPANHA.oferta.descontoPercentual)}% de desconto.`:'Prévia do benefício: até 10% de desconto. Resgate em preparação.';
  $('condicoes').textContent=podeResgatar(CAMPANHA)?`Validade: ${CAMPANHA.oferta.validade}. ${CAMPANHA.oferta.condicoes}`:'A oferta será ativada após a definição de validade e condições pela loja.';
}
async function iniciar(){
  $('inicio').hidden=true;$('final').hidden=true;$('resgate').hidden=true;$('resgate').reset();$('partida').hidden=false;$('controles').hidden=false;$('pausar').hidden=false;document.body.classList.add('jogando');emPartida=true;pausado=false;
  registrar('inicio');
  if(jogo){jogo.scene.start('Aventura');return;}
  jogo=new Phaser.Game({type:Phaser.AUTO,parent:'jogo',width:LARGURA,height:ALTURA,pixelArt:true,roundPixels:true,backgroundColor:'#cdd7b0',scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH},input:{activePointers:4},audio:{noAudio:true},physics:{default:'arcade',arcade:{gravity:{x:0,y:JOGADOR.gravidade},debug:false}},scene:[Aventura]});
  jogo.events.on('conclusao',concluir);
  if(import.meta.env.DEV)window.jogo=jogo;
}
$('jogar').onclick=iniciar;$('novamente').onclick=iniciar;
$('ver-oferta').onclick=()=>{
  registrar('clique_oferta',{presentes:total});$('resgate').hidden=false;
  const pronto=podeResgatar(CAMPANHA);$('enviar').disabled=!pronto;$('nome').disabled=!pronto;$('atendimento').disabled=!pronto;$('marketing').disabled=!pronto;
  $('pendencia').textContent=pronto?'':'Resgate ainda indisponível: a loja precisa configurar WhatsApp, validade, condições e informações de privacidade.';
  $('privacidade').textContent=pronto?`Atendimento por ${CAMPANHA.privacidade.responsavel}. Contato: ${CAMPANHA.privacidade.contato}. Retenção: ${CAMPANHA.privacidade.retencao}. Este site não armazena seu nome. Os dados seguem no texto da mensagem ao WhatsApp, sujeito à política desse serviço. O envio será confirmado por você no aplicativo.`:'Nenhum dado é coletado nesta prévia.';
};
$('resgate').onsubmit=e=>{
  e.preventDefault();if(!$('resgate').reportValidity()||!podeResgatar(CAMPANHA))return;
  const url=linkResgate(CAMPANHA,$('nome').value,total,$('marketing').checked);registrar('encaminhamento_whatsapp',{presentes:total});window.location.assign(url);
};
$('compartilhar').href=linkCompartilhar(window.location.href);$('compartilhar').onclick=()=>registrar('clique_compartilhar');
