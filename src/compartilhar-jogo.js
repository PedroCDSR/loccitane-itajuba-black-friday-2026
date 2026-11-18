import { CAMPANHA } from './data/campanha.js';
const $ = id => document.getElementById(id);
const pagina = new URL(import.meta.env.BASE_URL, window.location.href);
pagina.search = ''; pagina.hash = '';
const texto = `Vem viver essa última aventura por Itajubá comigo! Jogue, encontre a família no showroom e descubra sua recompensa: ${pagina.href}`;
let imagem, pedido = null;
$('instagram-final').href = CAMPANHA.instagram;
$('whatsapp-final').href = `https://wa.me/${CAMPANHA.whatsapp}`;
// Prepara a imagem antes do clique para preservar a ativação do usuário ao abrir o menu nativo.
// Fora da abertura: são ~2,5 MB que antes disputavam o carregamento inicial. Baixa uns segundos depois de começar
// a partida (já com a cidade carregada) ou, no mais tardar, no encerramento.
function prepararImagem() {
  if (imagem || pedido) return;
  pedido = fetch(`${import.meta.env.BASE_URL}assets/compartilhar/ultima-aventura-promocional.png`)
    .then(r => { if (!r.ok) throw new Error('Imagem indisponível'); return r.blob(); })
    .then(blob => { imagem = new File([blob], 'aventura-itajuba.png', {type:'image/png'}); })
    .catch(() => { pedido = null; }); // falhou: tenta de novo no próximo gatilho
}
window.addEventListener('aventura:encerramento', prepararImagem);
$('jogar').addEventListener('click', () => setTimeout(prepararImagem, 10000));
$('compartilhar-jogo').onclick = async () => {
  const botao = $('compartilhar-jogo'), status = $('status-compartilhar');
  botao.disabled = true;
  try {
    if (navigator.share) {
      const dados = {title:'Uma última aventura · L’Occitane Itajubá',text:texto};
      if (imagem && navigator.canShare?.({files:[imagem]})) dados.files = [imagem];
      await navigator.share(dados);
    } else {
      $('salvar-convite').hidden = false;
      window.open(`https://wa.me/?text=${encodeURIComponent(texto)}`, '_blank', 'noopener,noreferrer');
    }
  } catch (erro) {
    if (erro.name !== 'AbortError') {
      status.hidden = false;
      status.textContent = 'Salve a imagem abaixo e compartilhe com quem você quer convidar.';
      $('salvar-convite').hidden = false;
    }
  } finally {botao.disabled = false;}
};
