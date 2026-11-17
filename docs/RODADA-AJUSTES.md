# Ajustes pedidos pelo Pedro (17/11/2026)

Pedido: entrada no showroom sem transição e com o fundo quebrando, árvores na frente dos marcos, jogo fácil e linear demais, intro pobre e dinâmica fraca dentro do showroom.

## O que mudou

**Passagem para o showroom.** A rua termina numa placa "SHOWROOM →" e na bandeira vermelha da loja. Ao passar pela bandeira, a tela escurece com o nome "L’Occitane au Brésil · Itajubá" e reabre na fachada. Cidade e showroom viraram duas salas: a câmera nunca mostra as duas juntas, então o céu da cidade e o da fachada não se encontram mais. A passagem não gasta tempo.

**Árvores.** Saíram da frente do Clube, da fonte do Theodomiro Santiago e da Matriz. Agora ficam só nos vãos entre os marcos (`ARVORES` em `src/game/Aventura.js`).

**Obstáculos.** Seis tendinhas da L’Occitane pela rua, uma em cada vão entre marcos: o balcão é uma plataforma e o toldo quica (segurando Pular vai mais alto). Os frascos que "voaram" ficam no alto de cada tenda. Cestos simples e duplos com um frasco em cima, e cinco capivaras. A tenda, a bandeira e a placa são desenhadas em código (`src/game/cenario.js`) e reaproveitam os frascos, o kit e a sacola no balcão.

**Produtos.** 4 no chão (o mínimo da missão sempre fica no caminho), 6 sobre os cestos, 12 no alto das tendas.

**Abertura.** Encenada dentro do jogo, com 4 falas e botão para pular: a exploradora chega à rua, uma capivara derruba a entrega e os frascos voam pela cidade, chega a mensagem do Pedro e a explicação de como jogar. Os textos ficam em `CAMPANHA.introCena` (`src/data/campanha.js`). "Jogar novamente" vai direto para a rua. A introdução em cartões saiu.

**Showroom.**
- Cada kit leva também uma **caixa de presente**. As três caixas ficam no alto: uma nas estantes da fachada e uma em cada estante do interior.
- As estantes do interior ganharam duas prateleiras escaláveis cada; a mesa da fachada e a do interior também servem de plataforma.
- O Pedro recebe na porta e a conversa abre sozinha na primeira passagem, porque é ela que explica as caixas. Depois ele aparece ao lado da bancada e acena a cada kit.
- O kit se monta ao passar pela bancada com os três itens, sem botão: os itens voam até a mesa, a caixa aparece com brilho. Se faltar algo, aparece o que falta.
- Com os três kits, surge a placa "SAÍDA →".

## Testado (Chromium, Playwright)

- `npm test` 27 de 27 e `npm run build`.
- Partida completa com teclado, jogando sem atalhos: cidade em 37 s sem dano; conversa abre sozinha na porta; caixas pegas no alto da fachada e das duas estantes; dois kits de passagem e o terceiro na volta; final de vitrine aos **53,5 s** dos 75 s.
- Quique no toldo: a exploradora sobe até y 99 e pega o frasco do alto.
- Abertura nos quatro passos, botão "Pular abertura", transição para a fachada.
- Celular deitado 844×390 emulado: texto da abertura no alto, cena visível, controles de toque voltam ao começar.
- Sem erros no console e sem arquivos faltando.

Capturas reais em `docs/capturas/v2-*.png`.

## Não testado e pendências

- Aparelho real; um robô joga sem errar, então a folga de 21 s precisa ser medida com pessoas.
- A arte das tendas é desenhada em código, sem passar por um gerador de imagem como as demais. Se ficar abaixo do resto, dá para pedir uma tenda nas mesmas medidas (96×80 unidades, 288×240 pixels).
- O selo "Powered by Netlify" continua sobre os botões da direita no celular.
