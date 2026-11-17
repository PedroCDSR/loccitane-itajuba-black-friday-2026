import { CAMPANHA } from './data/campanha.js';
import { RECOMPENSAS, RECOMPENSA_FINAL, FAIXAS, desempenho } from './data/recompensas.js';
import { linkCupomWhatsApp } from './services/cupom.js';
import { tocar } from './services/som.js';
const $ = id => document.getElementById(id);
const base = import.meta.env.BASE_URL;
let pagina = 0, atual, falas = [], sessao = 0;

function prepararImagem() {
  const token = ++sessao;
  const img = $('imagem-premio');
  img.hidden = true;
  $('resgatar-premio').hidden = true;
  $('recarregar-premio').hidden = true;
  $('estado-premio').textContent = 'Preparando sua recompensa…';
  img.onload = () => {
    if (token !== sessao) return;
    img.hidden = false;
    $('estado-premio').textContent = 'Seu cupom está pronto!';
    $('resgatar-premio').hidden = false;
    $('premio-final').classList.add('revelado');
    if (!$('premio-final').hidden) tocar('vitrine');
  };
  img.onerror = () => {
    if (token !== sessao) return;
    $('estado-premio').textContent = 'Sua recompensa está guardada. Não foi possível carregar a imagem.';
    $('recarregar-premio').hidden = false;
  };
  img.alt = `Cupom ${atual.codigo}: ${atual.percentual}% de desconto, ${atual.nome}. Validade ilustrativa: 26/11/26.`;
  img.src = `${base}assets/recompensas/${encodeURIComponent(atual.imagem)}`;
}
function mostrarFala() {
  $('fala-karina').textContent = falas[pagina];
  $('pagina-fala').textContent = `${pagina + 1} de ${falas.length}`;
  $('avancar-final').textContent = pagina === falas.length - 1 ? 'Revelar minha recompensa ✦' : 'Continuar →';
}
function abrirFinal(resultado = {}, teste = false) {
  const placar = desempenho(resultado);
  const chave = placar.chave;
  atual = RECOMPENSAS[chave] || RECOMPENSAS[RECOMPENSA_FINAL];
  pagina = 0;
  $('placar-produtos').textContent = `${placar.produtos} produtos × 10 = ${placar.pontosProdutos} pontos`;
  $('placar-kits').textContent = `${placar.kits} kits × 50 = ${placar.pontosKits} pontos`;
  $('placar-total').textContent = `${placar.total} pontos`;
  for (const faixa of FAIXAS) {
    const linha = $(`faixa-${faixa.chave}`);
    linha.classList.toggle('faixa-liberada', faixa.chave === chave);
    linha.querySelector('td:last-child').textContent = faixa.chave === chave ? 'Seu cupom ✦' : (placar.total < faixa.minimo ? `Faltaram ${faixa.minimo - placar.total} pontos` : 'Faixa alcançada');
  }
  falas = [
    'Olha só como nossa vitrine ficou linda! Obrigada por reunir os produtos e ajudar a preparar os kits.',
    'Cada presente carrega um pouquinho dos encontros e das boas lembranças que vivemos aqui em Itajubá. Você agora faz parte dessa história!',
    `Você conquistou ${placar.total} pontos! Seu cuidado merece uma recompensa especial. Vamos descobrir qual cupom você desbloqueou?`,
  ];
  $('inicio').hidden = true;
  $('partida').hidden = true;
  $('pausa').hidden = true;
  $('pausar').hidden = true;
  document.body.classList.remove('jogando');
  $('final').hidden = false;
  $('encerramento-titulo').textContent = 'Vitrine pronta!';
  $('fala-final').hidden = false;
  $('avancar-final').hidden = false;
  $('premio-final').hidden = true;
  $('premio-final').classList.remove('revelado');
  $('codigo-premio').textContent = `Seu código: ${atual.codigo}`;
  $('titulo-premio').textContent = `Você ganhou ${atual.percentual}% de desconto!`;
  const url = new URL(`${base}recompensas/${chave}/`, window.location.href);
  $('resgatar-premio').href = linkCupomWhatsApp(CAMPANHA.whatsapp, url.href, atual);
  $('voltar-inicio').textContent = teste ? 'Voltar ao início · testar outro cupom' : 'Voltar ao início';
  mostrarFala();
  prepararImagem(); // Pré-carrega durante a conversa; CTA só aparece na revelação.
  $('encerramento-titulo').focus();
  window.scrollTo({ top: 0, behavior: 'instant' });
}
$('avancar-final').onclick = () => {
  if (pagina < falas.length - 1) { pagina++; mostrarFala(); return; }
  $('fala-final').hidden = true;
  $('avancar-final').hidden = true;
  $('premio-final').hidden = false;
  if (!$('imagem-premio').hidden) tocar('vitrine');
  $('encerramento-titulo').textContent = 'Essa conquista é sua!';
  $('encerramento-titulo').focus();
};
$('recarregar-premio').onclick = prepararImagem;
$('voltar-inicio').onclick = () => {
  sessao++;
  $('final').hidden = true;
  $('inicio').hidden = false;
  $('jogar').focus();
};
const exemplos = { roma: { caju: 3, roma: 3, capim: 0, kits: 3 }, caju: { caju: 6, roma: 6, capim: 5, kits: 3 }, bresil: { caju: 9, roma: 9, capim: 9, kits: 3 } };
$('testar-recompensa').onclick = () => abrirFinal(exemplos[$('cupom-teste').value], true);
window.addEventListener('aventura:encerramento', e => abrirFinal(e.detail));
// Confetes CSS finitos; sem loop de renderização ou dependência adicional.
for (let i = 0; i < 22; i++) {
  const p = document.createElement('i');
  p.style.setProperty('--x', `${(i * 47) % 100}%`);
  p.style.setProperty('--delay', `${(i % 7) * .09}s`);
  p.style.setProperty('--cor', ['#b18b45', '#942c39', '#304f3d'][i % 3]);
  $('confetes').append(p);
}
