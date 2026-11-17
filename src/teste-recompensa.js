import { CAMPANHA } from './data/campanha.js';
import { linkCupomWhatsApp } from './services/cupom.js';

// Atalho temporário de teste na abertura, sem iniciar a partida.
const botao = document.getElementById('testar-recompensa');
const pagina = new URL(`${import.meta.env.BASE_URL}recompensas/jogo10/`, window.location.href);
botao.onclick = () => window.location.assign(linkCupomWhatsApp(CAMPANHA.whatsapp, pagina.href));
