import './compartilhar-jogo.js';
import { CAMPANHA } from './data/campanha.js';
import { RECOMPENSAS, RECOMPENSA_FINAL, desempenho } from './data/recompensas.js';
import { linkCupomWhatsApp } from './services/cupom.js';
import { tocar } from './services/som.js';
import { registrar } from './services/metricas.js';
const $ = id => document.getElementById(id);
const base = import.meta.env.BASE_URL;
let pagina = 0, atual, falas = [], sessao = 0, chaveAtual = 'roma';

function prepararImagem() {
  const token = ++sessao;
  const img = $('imagem-premio');
  img.hidden = true;
  $('resgatar-premio').hidden = true;
  $('recarregar-premio').hidden = true;
  $('estado-premio').hidden = false;
  $('estado-premio').textContent = 'Preparando sua recompensa…';
  img.onload = () => {
    if (token !== sessao) return;
    img.hidden = false;
    $('estado-premio').textContent = '';
    $('estado-premio').hidden = true;
    $('resgatar-premio').hidden = false;
    $('premio-final').classList.add('revelado');
    if (!$('premio-final').hidden) tocar('vitrine');
  };
  img.onerror = () => {
    if (token !== sessao) return;
    $('estado-premio').textContent = 'Sua recompensa está guardada. Não foi possível carregar a imagem.';
    $('recarregar-premio').hidden = false;
  };
  img.alt = `Cupom ${atual.codigo}: ${atual.percentual}% de desconto em toda a loja. Validade ilustrativa: 26/11/26.`;
  img.src = `${base}assets/recompensas/${encodeURIComponent(atual.imagem)}`;
}
function abrirFinal(resultado = {}, teste = false) {
  const placar = desempenho(resultado);
  const chave = placar.chave;
  atual = RECOMPENSAS[chave] || RECOMPENSAS[RECOMPENSA_FINAL];
  chaveAtual = RECOMPENSAS[chave] ? chave : RECOMPENSA_FINAL;
  pagina = 0;
  $('inicio').hidden = true;
  $('partida').hidden = true;
  $('pausa').hidden = true;
  $('pausar').hidden = true;
  document.body.classList.remove('jogando');
  $('final').hidden = false;
  $('encerramento-titulo').textContent = 'Vitrine pronta!';
  $('premio-final').hidden = false;
  $('premio-final').classList.remove('revelado');
  $('titulo-premio').textContent = `Você ganhou ${atual.percentual}% de desconto em toda a loja!`;
  const url = new URL(`${base}recompensas/${chave}/`, window.location.href);
  $('resgatar-premio').href = linkCupomWhatsApp(CAMPANHA.whatsapp, url.href, atual);
  $('voltar-inicio').textContent = teste ? 'Voltar ao início · testar outro cupom' : 'Voltar ao início';
  prepararImagem(); // Pré-carrega durante a conversa; CTA só aparece na revelação.
  $('encerramento-titulo').focus();
  window.scrollTo({ top: 0, behavior: 'instant' });
}
$('recarregar-premio').onclick = prepararImagem;
$('voltar-inicio').onclick = () => {
  sessao++;
  $('final').hidden = true;
  $('inicio').hidden = false;
  window.dispatchEvent(new CustomEvent('aventura:voltar-inicio'));
  $('jogar').focus();
};
window.addEventListener('aventura:encerramento', e => { abrirFinal(e.detail); registrar(`cupom_${chaveAtual}`); });
$('resgatar-premio').addEventListener('click', () => registrar(`resgatar_${chaveAtual}`));
// Confetes CSS finitos; sem loop de renderização ou dependência adicional.
for (let i = 0; i < 22; i++) {
  const p = document.createElement('i');
  p.style.setProperty('--x', `${(i * 47) % 100}%`);
  p.style.setProperty('--delay', `${(i % 7) * .09}s`);
  p.style.setProperty('--cor', ['#b18b45', '#942c39', '#304f3d'][i % 3]);
  $('confetes').append(p);
}
