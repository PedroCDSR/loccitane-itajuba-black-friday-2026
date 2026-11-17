import './style.css';
import { CIDADE, FOLHAS, OBJETOS } from './game/assets.js';
const $ = id => document.getElementById(id);
const base = import.meta.env.BASE_URL;
const etapas = [0, 20, 50, 70, 100];
const estados = [];
function mostrar(valor) {
  const etapa = etapas.filter(e => e <= valor).at(-1);
  $('caju-loading').src = `${base}assets/carregamento/caju-${String(etapa).padStart(3,'0')}.png`;
  $('progresso-abertura').value = valor;
  $('texto-abertura').textContent = `Preparando sua aventura… ${valor}%`;
}
async function carregar() {
  $('tentar-abertura').hidden = true;
  try {
    // Primeiro os próprios indicadores; nunca avançar por um relógio fictício.
    await Promise.all(etapas.map(n => new Promise(resolve => {
      const img = new Image(); estados.push(img); img.onload = img.onerror = resolve;
      img.src = `${base}assets/carregamento/caju-${String(n).padStart(3,'0')}.png`;
    })));
    const arquivos = [
      ...Object.values(CIDADE).map(n=>`assets/runtime-cidade/${n}.webp`),
      ...Object.values(FOLHAS).map(([n])=>`assets/runtime-sprites/${n}.webp`),
      ...Object.values(OBJETOS).map(n=>`assets/runtime-sprites/${n}.webp`),
      ...['fachada','interior','caju','roma','bandeira-jardim','logo-tenda','selo-tenda'].map(n=>`assets/showroom/${n}.png`),
      'assets/produtos/capim-limao-colonia-sprite.png',
      'assets/personagens/karina/karina-spritesheet.png',
      'assets/personagens/mariana/mariana-spritesheet.png',
      'assets/personagens/marcela/marcela-spritesheet.png',
    ];
    let concluidos = 0;
    const total = arquivos.length + 1;
    const pronto = () => mostrar(Math.floor(++concluidos / total * 100));
    const modulo = Promise.all([import('./main.js'), import('./teste-recompensa.js')]).then(pronto);
    await Promise.all([modulo, ...arquivos.map(async caminho=>{
      const resposta = await fetch(`${base}${caminho}`);
      if (!resposta.ok) throw new Error('Não foi possível carregar a aventura');
      await resposta.blob(); pronto();
    })]);
    mostrar(100);
    // Exibe o estado final antes de revelar o pergaminho.
    await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
    $('abertura-loading').hidden = true;
    $('inicio').hidden = false;
    document.body.classList.remove('preparando');
    const { tentarMusicaInicial } = await import('./services/som.js');
    tentarMusicaInicial();
  } catch {
    $('texto-abertura').textContent = 'Não foi possível preparar a aventura. Confira sua conexão e tente novamente.';
    $('tentar-abertura').hidden = false;
  }
}
$('tentar-abertura').onclick = carregar;
carregar();
