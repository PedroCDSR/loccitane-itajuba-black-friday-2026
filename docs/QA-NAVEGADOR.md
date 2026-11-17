# QA em navegador da missão Caju e Romã

Data: 17/11/2026. Versão testada: commits do Codex até `2b8bf75` mais as correções deste registro. Chromium (Playwright) nesta máquina, sem placa de vídeo. Nada foi testado em aparelho real.

## Resultado

| Teste | Resultado |
| --- | --- |
| `npm test` | 27 de 27 (um teste novo para toque curto) |
| `npm run build` | Passou |
| Intro: 3 etapas, "Ir direto para a cidade" | Passou; cronômetro só começa na cidade |
| Cidade inteira com teclado (robô) | Passou: chegou ao Pedro em 38,9 s, sem dano, 4 capivaras alimentadas, nenhum cesto travou a passagem |
| Hitbox da exploradora | Corpo 18×46 com os pés na linha do chão (y 240) |
| Conversa com Pedro por E | Abre, pausa física e relógio, fecha com Enter sem salto e sem reabrir |
| Três kits por E na bancada | 1/3, 2/3, 3/3; estoque desce 1 Caju e 1 Romã por kit |
| Saída com 3 kits | Final "Vitrine pronta!" |
| Tempo esgotado | Final parcial com o progresso real ("preparou 1 de 3 kits") |
| Reinício | Volta a x=80, 5 corações, inventário e kits zerados |
| Celular deitado 844×390, toque emulado | Botão "Conversar" de 147×48 px; conversa, fechar e três kits por toque passaram depois da correção abaixo |
| Console e rede | Sem erros de página; nenhuma resposta 4xx/5xx. Só avisos de desempenho do WebGL da máquina de teste |
| Quadros por segundo | 36 a 42 no Chromium sem GPU; não é medida de celular |
| Download real (build de produção) | 394 KB até a página inicial; 3,28 MB até a partida começar (antes desta rodada: 4,2 MB) |

Capturas reais em `docs/capturas/missao-*.png`.

## Corrigido nesta rodada

1. **Toque curto não montava kit.** No celular, tocar em "Montar kit" não fazia nada: se o dedo entra e sai entre dois quadros, `Entrada` não via o toque. Agora o `pointerdown` vale por pelo menos um quadro (`tocouAgora` em `src/game/Entrada.js`), para interagir, pular e fruta. Teste novo em `tests/entrada.test.js`.
2. **Pedro quebrado na intro.** `index.html` apontava para `assets/showroom/pedro.png`, removido antes. No `npm run dev` o Vite devolve HTML no lugar da imagem (por isso não aparecia 404); no Netlify seria 404. Agora usa `assets/showroom/pedro-intro.webp` (15 KB), um quadro da folha do Pedro.
3. **Folha do Pedro pesada.** O jogo carregava a folha original de 1,18 MB, exibida a cerca de 1/6 do tamanho. Agora usa `assets/showroom/pedro-jogo.webp` (0,25 MB) com atlas ajustado; o original e o atlas original continuam em `public/assets/personagens/`.
4. **Contorno dos produtos parecia caixa de depuração.** Trocado por sombra oval no chão e flutuação leve.

Os derivados saem de `python3 ferramentas/preparar_showroom.py . public/assets/showroom`.

## Para decidir

- **A coleta não desafia.** São 33 produtos pelo chão da cidade e mais 11 no showroom; a missão pede 3 Caju e 3 Romã. O robô chegou ao Pedro com 17 e 16. Se a ideia é que coletar importe, reduzir a quantidade ou pôr parte dos produtos em pontos que pedem salto.
- **O build tem 16 MB** porque `public/` guarda as artes originais e os PNGs nas medidas pedidas (`cidade-entardecer/` 6,8 MB, `produtos/`, `personagens/`, `sprites-nativos/`). O jogador não baixa esses arquivos, mas eles vão para o Netlify em cada deploy. Mover para `references/` reduziria o deploy, se não houver outro uso público para eles.

## Não testado

Aparelho real (Android, iPhone), áudio, multitoque com três dedos, barras do navegador e áreas seguras, desempenho em celular, falha de rede no carregamento.
