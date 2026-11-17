export const LARGURA = 480;
export const ALTURA = 270;
export const DURACAO_SEGUNDOS = 75;
// O mundo é medido em unidades de 480x270. O canvas tem o dobro (960x540) e a câmera usa zoom 2 na
// cidade e zoom 3 no showroom, onde os fundos têm 3 pixels de textura por unidade.
// Tela quadrada (960x960), pensada para o celular em pé: ocupa toda a largura, a cidade aparece inteira do céu
// ao chão (270 de altura, 270 de largura visível) e o showroom preenche a altura com os fundos de 180.
export const TELA = { largura: 960, altura: 960 };
export const ZOOM_CIDADE = TELA.altura / 270;
export const ZOOM_SHOWROOM = TELA.altura / 180;
export const SHOWROOM = { x: 5216, largura: 320, topo: 90, altura: 180 }; // cada um dos dois fundos (fachada, interior)
export const MUNDO = SHOWROOM.x + SHOWROOM.largura * 2;
export const ARTE_JOGADOR = 3; // pixels de textura por unidade do mundo no sprite da exploradora
export const JOGADOR = {
  velocidade: 140, aceleracaoChao: 1400, aceleracaoAr: 900, freio: 1800,
  aterrissagemMs: 145, gravidade: 900, gravidadeQuedaExtra: 500, quedaMaxima: 520,
  forcaPulo: 380, cortePulo: 0.45, coyoteMs: 160, bufferPuloMs: 160,
  recuoDano: { x: 75, y: 140 }, atordoadoMs: 180, coracoes: 5, invencivelMs: 1800,
  corpo: { largura: 18, altura: 46, x: 15, y: 18 },
  antecipacaoFrutaMs: 100, arremessoMs: 250,
};

// Reaproveita os cinco corações do modo fácil original, sem encurtar o mapa.
export const MODO_FACIL = { capivaraVelocidade: 10, checkpointDistancia: 400 };
