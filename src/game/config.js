export const LARGURA = 480;
export const ALTURA = 270;
// Sem limite de tempo: a partida só termina saindo do showroom com os três kits (pedido do Pedro, 17/11/2026).
// O mundo é medido em unidades de 480x270. O canvas tem o dobro (960x540) e a câmera usa zoom 2 na
// cidade e zoom 3 no showroom, onde os fundos têm 3 pixels de textura por unidade.
// A tela do jogo ocupa todo o espaço livre entre o placar e os botões (no celular em pé fica mais alta que larga).
// A largura em pixels é fixa; a altura acompanha a proporção da área (ver tamanhoTela em main.js).
// A câmera aproxima até a cidade (270 de altura) ou o showroom (180) preencher a altura: no celular em pé
// aparecem ~175 unidades de largura da rua e ~115 do showroom.
export const TELA = { largura: 960, altura: 960, alturaMin: 540, alturaMax: 2400 }; // sem a faixa do HUD, a tela do jogo vai até o painel de botões
export const ALTURA_CIDADE = 270, ALTURA_SHOWROOM = 180;
export const ZOOM_CIDADE = TELA.altura / ALTURA_CIDADE;
export const ZOOM_SHOWROOM = TELA.altura / ALTURA_SHOWROOM;
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
