# Revisão geral de qualidade

Data: 17/11/2026. Código lido por inteiro; jogo conferido no Chromium (Playwright) com capturas em 1280×720, 844×390 e 390×844 e uma partida completa por robô. Nada foi testado em aparelho real.

## Corrigido nesta revisão

- **O caju nunca alimentava a capivara.** A fruta saía 30 px acima do pé e passava por cima da caixa de colisão da capivara (que começa 17 px acima do chão). Agora sai 20 px acima do pé (`src/game/Aventura.js`). Conferido: a capivara passa para a animação de comer e deixa de tirar vida.

## Medido

- Robô que não erra (pula todas as caixas e capivaras, nunca para): chega ao showroom em **62,7 s** dos 75 s, com 40 presentes e nenhum dano. Sem erros no console.
- O teste de fumaça anterior terminou por tempo, com o robô preso na primeira caixa. A tabela de `docs/SMOKE-TEST.md` foi corrigida.

## Problemas para a próxima etapa, por ordem de importância

1. **Quase ninguém vai ver o showroom.** A folga é de 12 s para um jogador perfeito. Qualquer hesitação, dano ou volta ao checkpoint (até 1000 px para trás) faz a partida acabar por tempo na rua. Como o showroom é o ponto alto, encurtar o percurso (`MUNDO` e posições dos lugares em `Aventura.js`) ou aumentar a velocidade, mirando ~45 s para o jogador perfeito. O teste `percurso cabe na janela` só compara distância e velocidade; não protege contra isso.
2. **Fachada e interior ainda são blocos.** A fachada não tem porta, gradil, jardim nem pedras visíveis; presentes flutuam na frente da parede; o interior repete a mesma estante. As seis fotos agora estão no repositório para guiar a arte final.
3. **Textos dentro do canvas saem borrados** ("L’OCCITANE AU BRÉSIL", "SHOWROOM • ITAJUBÁ"): fonte serifada do sistema desenhada a 480×270 e ampliada. Usar fonte de pixel ou texto em HTML por cima. A fonte Press Start 2P está em `public/` e declarada no CSS, mas não é usada em lugar nenhum; o caminho dela é absoluto (`/assets/fonts/`) e quebra se o site for publicado em subpasta.
4. **Celular deitado desperdiça tela.** Em 844×390 o jogo ocupa 523 px de largura e os botões têm 45 px de altura. Sobrepor os controles ao jogo deixaria o canvas e os botões maiores.
5. **Sem retorno visual** ao coletar, levar dano ou alimentar a capivara, e a capivara alimentada continua parecendo obstáculo. Não há aviso de que o tempo está acabando.
6. **Relógios seguem correndo na pausa.** Invencibilidade e intervalo do arremesso usam o relógio do jogo, que não para com a cena. Efeito pequeno.
7. **Lançamento:** faltam favicon de verdade, imagem e meta tags de compartilhamento (Open Graph) e manifest. O link de compartilhar aponta para o endereço aberto, inclusive prévias.
8. **Repositório público.** Tornar privado antes de preencher dados comerciais.

## O que está bom

Física do pulo (pulo variável, tolerância na borda), pausa ao perder o foco, reinício sem duplicar controles, bloqueio do resgate, teto de 10% coberto por teste, métricas sem dados pessoais, cidade de Itajubá reconhecível.
