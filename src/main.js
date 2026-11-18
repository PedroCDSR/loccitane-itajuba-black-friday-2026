import * as Phaser from 'phaser';
import './style.css';
import { CAMPANHA } from './data/campanha.js';
import { Aventura } from './game/Aventura.js';
import { LARGURA, ALTURA, JOGADOR, TELA } from './game/config.js';
import { percentualSeguro, podeResgatar, linkResgate, linkCompartilhar } from './services/oferta.js';
import { registrar } from './services/metricas.js';
import { alternarSom, somLigado, aoMudarSom, prepararSom, definirAtivo, musica, historico } from './services/som.js';
const $=id=>document.getElementById(id);
let jogo, total=0, emPartida=false, pausado=false, iniciando=false;
$('despedida').textContent=CAMPANHA.despedida;
// Som: um botão no cabeçalho (tela inicial) e outro no HUD (partida), sempre sincronizados.
function mostrarSom(ligado){$('som').textContent=`Som: ${ligado?'ligado':'desligado'}`;for(const id of ['som','som-hud'])$(id).setAttribute('aria-pressed',String(ligado));$('som-hud').setAttribute('aria-label',ligado?'Som ligado. Tocar para desligar':'Som desligado. Tocar para ligar');}
prepararSom();aoMudarSom(mostrarSom);mostrarSom(somLigado());
// A trilha é agendada na história e começa quando o navegador libera áudio no primeiro gesto.
if (typeof window.dispatchEvent === 'function') musica(true);
$('som').onclick=$('som-hud').onclick=()=>alternarSom();
function pausar(){if(!emPartida||pausado||!jogo)return;const cena=jogo.scene.getScene('Aventura');if(!cena?.entrada)return;pausado=true;cena.entrada.limpar();jogo.scene.pause('Aventura');definirAtivo(false);$('pausa').hidden=false;}
$('pausar').onclick=pausar;
$('continuar').onclick=()=>{if(!emPartida)return;$('pausa').hidden=true;pausado=false;definirAtivo(true);jogo.scene.resume('Aventura');};
// Áudio para junto com a aba ou o foco; na partida volta só no "Continuar" da pausa.
document.addEventListener('visibilitychange',()=>{if(document.hidden){pausar();definirAtivo(false);}else if(!pausado)definirAtivo(true);});
window.addEventListener('blur',()=>{pausar();definirAtivo(false);});
window.addEventListener('focus',()=>{if(!pausado)definirAtivo(true);});
window.addEventListener('keydown',e=>{if(e.code==='Escape'&&emPartida)pausar();});
// Sem limite de tempo, a partida só termina com a vitrine pronta (motivo 'vitrine'). O tempo de passeio é só lembrança.
function passeio(segundos){
  if(!Number.isFinite(segundos)||segundos<=0)return '';
  const t=Math.round(segundos),m=Math.floor(t/60),s=t%60;
  return ` Seu passeio por Itajubá durou ${m?`${m} min `:''}${s} s.`;
}
function concluir({presentes, caju=0, capim=0, roma=0, kits=0, tempo, vida, vidaMinima, brindesShowroom}){
  total=presentes;emPartida=false;musica(false);document.body.classList.remove('jogando');$('partida').hidden=true;$('pausar').hidden=true;$('final').hidden=false;
  $('resultado').textContent=`Vitrine pronta! Você reuniu ${caju} Caju, ${capim?`${capim} Capim-Limão, `:''}${roma} Romã e montou ${kits} kits com a Karina.${passeio(tempo)} Obrigada por fazer parte desta história!`;
  $('beneficio').textContent=podeResgatar(CAMPANHA)?`Seu benefício: ${percentualSeguro(CAMPANHA.oferta.descontoPercentual)}% de desconto.`:'Prévia do benefício: até 10% de desconto. Resgate em preparação.';
  $('condicoes').textContent=podeResgatar(CAMPANHA)?`Validade: ${CAMPANHA.oferta.validade}. ${CAMPANHA.oferta.condicoes}`:'A oferta será ativada após a definição de validade e condições pela loja.';
  if(typeof window.dispatchEvent==='function')window.dispatchEvent(new CustomEvent('aventura:encerramento',{detail:{presentes,caju,capim,roma,kits,tempo,vida,vidaMinima,brindesShowroom}}));
}
// Altura da tela do jogo na proporção da área livre (largura fixa em 960 px de jogo).
function tamanhoTela(){
  const r=$('jogo').getBoundingClientRect?.();
  if(!r||!r.width||!r.height)return TELA.altura;
  return Math.round(Math.min(TELA.alturaMax,Math.max(TELA.alturaMin,TELA.largura*r.height/r.width)));
}
let ajusteTela=0;
function ajustarTela(){cancelAnimationFrame?.(ajusteTela);ajusteTela=requestAnimationFrame?.(()=>{if(jogo&&emPartida){const h=tamanhoTela();if(Math.abs(jogo.scale.height-h)>2)jogo.scale.setGameSize(TELA.largura,h);}})}
if(typeof ResizeObserver!=='undefined')new ResizeObserver(ajustarTela).observe($('jogo'));
async function iniciar(comIntro=false){
  if(iniciando)return;
  iniciando=true;
  try {
  // Cada partida recebe um renderer e um mundo novos. O anterior pode estar pausado
  // e conter texturas canvas referenciadas pelo WebGL após a conclusão.
  if(jogo){
    const anterior=jogo;jogo=null;emPartida=false;
    await new Promise(resolve=>{anterior.events.once('destroy',resolve);anterior.destroy(true);});
  }

  $('inicio').hidden=true;$('final').hidden=true;$('resgate').hidden=true;$('resgate').reset();$('partida').hidden=false;$('controles').hidden=false;$('pausar').hidden=false;document.body.classList.add('jogando');emPartida=true;pausado=false;
  $('loading').hidden=false;$('tentar-carga').hidden=true;$('loading-texto').textContent='Preparando a aventura…';
  registrar('inicio');definirAtivo(true);musica(true);
  jogo=new Phaser.Game({type:Phaser.AUTO,parent:'jogo',width:TELA.largura,height:tamanhoTela(),pixelArt:true,roundPixels:true,backgroundColor:'#cdd7b0',scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH},input:{activePointers:4},audio:{noAudio:true},physics:{default:'arcade',arcade:{gravity:{x:0,y:JOGADOR.gravidade},debug:false}},scene:[Aventura]});
  jogo.registry.set('comIntro',comIntro);
  jogo.events.on('conclusao',concluir);
  jogo.events.on('falha-assets',()=>{emPartida=false;musica(false);$('loading-texto').textContent='Não foi possível carregar todas as imagens. Confira sua conexão e tente novamente.';$('tentar-carga').hidden=false;});
  if(import.meta.env.DEV){window.jogo=jogo;window.sons=historico;}
  } finally {iniciando=false;}
}
$('tentar-carga').onclick=()=>iniciar(true);
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

// O Netlify injeta o selo "Powered by Netlify" (#nl-badge-frame) nas páginas publicadas. No plano pago (Personal)
// o próprio script do selo permite escondê-lo; aqui ele some para todos, sem cobrir os botões do jogo.
const verSelo=()=>{const selo=document.getElementById('nl-badge-frame');if(selo)selo.style.setProperty('display','none','important');};
if(typeof MutationObserver!=='undefined'){new MutationObserver(verSelo).observe(document.body,{childList:true});verSelo();}

window.addEventListener('aventura:voltar-inicio',()=>{emPartida=false;pausado=false;$('pausa').hidden=true;definirAtivo(true);musica(true);});
