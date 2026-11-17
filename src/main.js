import * as Phaser from 'phaser';
import './style.css';
import { CAMPANHA } from './data/campanha.js';
import { Aventura } from './game/Aventura.js';
import { LARGURA, ALTURA, JOGADOR, TELA } from './game/config.js';
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
function concluir({presentes, caju=0, roma=0, kits=0, motivo}){
  total=presentes;emPartida=false;document.body.classList.remove('jogando');$('partida').hidden=true;$('pausar').hidden=true;$('final').hidden=false;
  $('resultado').textContent=motivo==='vitrine'
    ? `Vitrine pronta! Você reuniu ${caju} Caju, ${roma} Romã e montou ${kits} kits com Pedro. Obrigada por fazer parte desta história!`
    : `O tempo terminou! Você reuniu ${caju} Caju, ${roma} Romã e preparou ${kits} de 3 kits. Pedro guardou seus produtos. Jogue de novo para completar a vitrine!`;
  $('beneficio').textContent=podeResgatar(CAMPANHA)?`Seu benefício: ${percentualSeguro(CAMPANHA.oferta.descontoPercentual)}% de desconto.`:'Prévia do benefício: até 10% de desconto. Resgate em preparação.';
  $('condicoes').textContent=podeResgatar(CAMPANHA)?`Validade: ${CAMPANHA.oferta.validade}. ${CAMPANHA.oferta.condicoes}`:'A oferta será ativada após a definição de validade e condições pela loja.';
}
async function iniciar(comIntro=false){
  $('inicio').hidden=true;$('final').hidden=true;$('resgate').hidden=true;$('resgate').reset();$('partida').hidden=false;$('controles').hidden=true;$('pausar').hidden=false;document.body.classList.add('jogando');emPartida=true;pausado=false;
  $('loading').hidden=false;$('tentar-carga').hidden=true;$('loading-texto').textContent='Preparando a aventura…';
  registrar('inicio');
  if(jogo){jogo.registry.set('comIntro',comIntro);jogo.scene.start('Aventura');return;}
  jogo=new Phaser.Game({type:Phaser.AUTO,parent:'jogo',width:TELA.largura,height:TELA.altura,pixelArt:true,roundPixels:true,backgroundColor:'#cdd7b0',scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH},input:{activePointers:4},audio:{noAudio:true},physics:{default:'arcade',arcade:{gravity:{x:0,y:JOGADOR.gravidade},debug:false}},scene:[Aventura]});
  jogo.registry.set('comIntro',comIntro);
  jogo.events.on('conclusao',concluir);
  jogo.events.on('falha-assets',()=>{emPartida=false;$('loading-texto').textContent='Não foi possível carregar todas as imagens. Confira sua conexão e tente novamente.';$('tentar-carga').hidden=false;});
  if(import.meta.env.DEV)window.jogo=jogo;
}
$('tentar-carga').onclick=()=>{jogo?.destroy(true);jogo=null;iniciar(true);};
// A abertura é encenada dentro do jogo; "Jogar novamente" vai direto para a cidade.
$('jogar').onclick=()=>iniciar(true);$('novamente').onclick=()=>iniciar(false);
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

// O selo do plano gratuito do Netlify fica fixo no canto de baixo. Sem escondê-lo, o painel ganha folga embaixo
// para o selo não cobrir os botões.
const verSelo=()=>document.body.classList.toggle('com-selo',!!document.getElementById('nl-badge-frame'));
if(typeof MutationObserver!=='undefined'){new MutationObserver(verSelo).observe(document.body,{childList:true});verSelo();}
