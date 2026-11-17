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

# Celular em pé (17/11/2026, segunda rodada)

Pedido: o jogo estava pensado para tela deitada e cheia; no celular em pé ficava pequeno, com os botões por cima do jogo e sem instruções claras.

- **Tela do jogo ocupa todo o espaço entre o placar e os botões** (opção A, "mais zoom", escolhida pelo Pedro sobre `docs/capturas/proposta-espaco-vertical.png`). A largura do jogo é fixa em 960 px e a altura acompanha a proporção da área de cada celular (`tamanhoTela` em `src/main.js`, recalculada se a tela mudar). A câmera aproxima até a cidade (270 de altura) ou o showroom (180) preencherem a altura: num iPhone em pé aparecem cerca de 160 unidades da rua e 110 do showroom, com a exploradora bem maior.
- **Partida em coluna, sem rolagem:** HUD no alto, jogo no meio e, embaixo, um painel próprio com setas grandes à esquerda e Caju e Pular à direita, perto dos polegares. Nada fica por cima do jogo.
- **Falas da abertura e do Pedro** aparecem no alto da tela do jogo; os botões ficam sempre no lugar, para a tela não mudar de tamanho. O botão "Conversar com Pedro" flutua acima dos botões e some durante a conversa.
- **Dicas da primeira partida** (`src/game/Tutorial.js`): balão com seta e botão piscando para andar, pular, dar caju à primeira capivara e quicar na primeira tendinha. Cada dica some quando a pessoa faz a ação ou depois de alguns segundos; no computador o texto mostra as teclas.
- **Selo do Netlify:** quando aparece, o painel ganha folga embaixo para o selo não cobrir os botões. O selo não é escondido.

Testado no Chromium com toque emulado em 390×844 e 412×915: sem rolagem, sem erros, setas + pular com dois dedos, dicas na ordem, altura do jogo fixa do começo à conversa com o Pedro. A partida completa por teclado continua passando (vitrine em cerca de 57 s).

Atenção: com o zoom, o showroom mostra só cerca de 110 unidades de largura no celular em pé; vale conferir com gente jogando se a escalada das estantes fica confortável.

# Sem limite de tempo e com espaço para explorar (17/11/2026, terceira rodada)

Pedido do Pedro: "Não limite o jogo a 75 segundos, dê espaço para a pessoa explorar a cidade e o showroom."

- **Fim por tempo removido.** Saiu `DURACAO_SEGUNDOS` (`src/game/config.js`), o `concluir('tempo')` e o final parcial "O tempo terminou" (`src/main.js`). A partida só termina saindo à direita do showroom com os três kits (motivo `vitrine`). O relógio interno de jogo ativo (`this.tempo`) continua, só para invencibilidade e avisos.
- **HUD sem relógio.** Escolhemos tirar o contador em vez de trocar por um relógio crescente: o HUD do celular em pé é estreito (corações, produtos e pausa já ocupam a linha) e um relógio que sobe também convida a correr. O tempo aparece só no final, como lembrança: "Seu passeio por Itajubá durou 1 min 59 s".
- **Ida e volta entre cidade e showroom** (`trocarSala` em `src/game/Aventura.js`). Na fachada, andar para a esquerda até a borda (x < fachada + 12) escurece a tela com "De volta a Itajubá · Passeie à vontade" e reabre na rua, perto da placa, virada para a esquerda. A bandeira leva de novo ao showroom. Missão, itens já pegos, kits e capivaras alimentadas ficam como estavam; a fase da missão não regride e a métrica `chegada_showroom` conta só a primeira chegada. Os pontos de chegada ficam longe dos dois gatilhos, e a transição solta os botões, então a passagem não dispara em loop. Uma placa "← ITAJUBÁ" no alto da fachada mostra o caminho.
- **Objetivo no HUD conforme o lugar** (`objetivoMissao(missao, sala)`): de volta à rua, "Passeie à vontade · a bandeira leva de volta ao showroom →" (ou "Reúna mais Caju e Romã", se faltar para os kits). Quem volta à fachada depois de conversar com o Pedro lê "Entre no showroom: as caixas estão no alto das estantes →", e não "Fale com Pedro" de novo.
- **Textos.** Abertura: "Sem pressa: passeie pela cidade à vontade!". Tela inicial: "Modo fácil · sem pressa: passeie pela cidade e pelo showroom · cinco corações."
- Extensão do mapa, posições dos marcos e física não mudaram.

## Testado

- `npm test` 32 de 32 (novos: `tests/exploracao.test.js` com 20 minutos de jogo ativo sem encerrar, fim só com os três kits, ida e volta preservando a missão sem loop; objetivo na rua e na fachada; textos sem "75 segundos"; final com tempo de passeio) e `npm run build`.
- Chromium (Playwright), teclado, partida completa: cidade em 37 s; conversa com o Pedro; volta à rua pela esquerda da fachada (5 capivaras alimentadas e produtos preservados); espera na rua até **95 s** de jogo ativo sem a partida acabar; volta ao showroom; três caixas, três kits e final de vitrine aos 116 s. Sem erros no console e sem 404.
- Celular em pé 390×844 com toque emulado: abertura com o texto novo, transição de volta, rua com o objetivo novo, fachada com a placa, sem rolagem e sem erros. Capturas em `docs/capturas/v4-celular-*.png`.

## Não testado

- Aparelho real. Falta ver com gente jogando se a volta pela borda esquerda da fachada é fácil de descobrir.
