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

# Showroom no celular em pé (17/11/2026, quarta rodada)

Pedido: com o zoom pela altura, o showroom mostrava só ~108 unidades de largura no celular em pé (390×844). Joguei no Chromium antes de mudar e anotei:

- **Enquadramento apertado.** Zoom 8,9: a exploradora ocupava quase meia tela, as caixas no alto das estantes quase nunca apareciam junto com ela, e não havia como saber para que lado ficavam as caixas ou a bancada.
- **Chegada cortada.** A exploradora aparecia pela metade na borda esquerda da fachada.
- **Avisos grandes e cortados.** "Falta: caixa de presente" saía da tela pela direita; a placa "← ITAJUBÁ" ficava enorme.
- Escalada, conversa, montagem dos kits e saída funcionavam, mas às cegas.

Capturas reais do antes: `docs/capturas/v5-antes-fachada.png`, `v5-antes-pedro.png`, `v5-antes-interior.png`, `v5-antes-bancada.png`.

## O que mudou (`src/game/guiaShowroom.js`, novo, e `src/game/Aventura.js`)

- **Mapa da loja no alto da tela** (só no celular em pé e só no showroom). É uma segunda câmera do Phaser que mostra o showroom inteiro, fachada e interior, com as próprias artes de `public/assets/showroom/` (faixa das estantes ao chão). Uma moldura clara marca o pedaço visível, um losango vermelho marca a exploradora e círculos dourados piscam nos objetivos.
- **Zoom do showroom diferente da cidade.** No celular em pé, o showroom mostra pelo menos **150 unidades de largura** (antes ~108; zoom 6,4 em vez de 8,9), sempre com a altura inteira (180). O espaço que sobra embaixo vira um reflexo escurecido do piso de cada arte que se funde ao verde do painel. Cidade, computador e celular deitado continuam como antes (zoom pela altura, sem mapa). A regra fica em `enquadramento()`, testada em `tests/guia-showroom.test.js`.
- **Setas para o próximo objetivo**, no celular e no computador: fora da tela, uma seta dourada na borda com o ícone do alvo; dentro da tela, um triângulo que balança em cima dele. Os alvos seguem a missão (`alvosShowroom()`): Pedro na porta → caixas de presente que faltam (e os produtos de reserva da mesa, se faltar fruta) → o próximo lugar livre da bancada quando há Caju, Romã e caixa → a saída com os três kits. Se faltar fruta e não houver reserva, a seta aponta para "← ITAJUBÁ". A seta tem ~38 px na tela em qualquer aparelho.
- **Avisos** do showroom ficam menores e sempre inteiros dentro da tela; o mapa não os mostra. Placa "← ITAJUBÁ" menor.
- **Chegada** 10 unidades mais para dentro da fachada (`CHEGADA_SHOWROOM = FACHADA + 34`), longe do gatilho de volta (+12).
- Sem mudança em física, prateleiras, posições das caixas, conversa com o Pedro, oferta ou condições.

## Testado de verdade (Chromium com Playwright, 17/11/2026)

- `npm test` 34 de 34 (2 novos para o enquadramento; os testes de exploração ganharam o adaptador do guia) e `npm run build`.
- **Celular em pé 390×844** (toque emulado, isMobile), jogando o showroom com teclado a partir da chegada (a cidade foi pulada com atalho de teste e 3 Caju/3 Romã no estoque): conversa com o Pedro abre sozinha na porta e fecha; da mesa da fachada ao topo da estante e caixa 1; prateleiras da estante esquerda (caixa 2 já se alcança da primeira prateleira); dois kits montados de passagem na bancada; prateleiras da estante direita, caixa 3; terceiro kit; seta para a saída; tela final "Vitrine pronta!". Sem erros no console e sem respostas 4xx/5xx.
- Toque real (`touchscreen.tap`) no botão Pular dentro do showroom faz a exploradora saltar; sem rolagem da página.
- Botão "Vamos montar os kits" tocado no diálogo do Pedro.
- 412×915: zoom 6,4, 150 de largura, 224 de altura visível.
- Celular deitado 844×390: sem mapa, zoom 3 (320 de largura), como antes.
- Link de testes no ar (dev--loccitane-itajuba.netlify.app) em 390×844: cidade jogada até a bandeira, transição e fachada com mapa e marcador; sem erros nem 4xx/5xx.
- Computador 1280×800: sem mapa, zoom pela altura (220 de largura); setas aparecem e têm o mesmo tamanho na tela. Volta à cidade pela esquerda da fachada: zoom da cidade restaurado e mapa escondido.

Capturas reais do depois: `docs/capturas/v5-depois-chegada.png` (marcador acima da cabeça do Pedro, ajustado depois de conferir o link no ar), `v5-depois-pedro.png`, `v5-depois-dialogo.png`, `v5-depois-fachada-setas.png`, `v5-depois-fachada-caixa.png`, `v5-depois-interior.png`, `v5-depois-estante.png`, `v5-depois-bancada.png`, `v5-depois-saida.png`, `v5-depois-412x915.png`, `v5-depois-deitado-844x390.png`, `v5-depois-computador.png`.

## Não testado e pendências

- Aparelho real; desempenho de duas câmeras num celular fraco (o Chromium sem GPU daqui roda a ~14 quadros por segundo em 390×844 com densidade 2, antes e depois).
- A escalada foi feita por robô, que acerta os pulos de primeira; falta ver com gente se as prateleiras ficam confortáveis com o novo zoom.
- O mapa não mostra rótulo ("mapa da loja"): em 390 px o texto ficaria pequeno demais dentro do canvas. Se faltar clareza com gente jogando, dá para pôr um rótulo em HTML sobre ele.
- O reflexo do piso embaixo é uma solução com as próprias artes; se o Pedro preferir, dá para trocar por uma faixa lisa ou estender os fundos com um gerador de imagem nas mesmas medidas.

# Efeitos sonoros e música (17/11/2026, quinta rodada)

Pedido: sons em tudo, botão de som visível durante a partida, áudio só depois do primeiro toque e pausa junto com o jogo.

- **Tudo gerado em código** (`src/services/som.js`, Web Audio puro). Nenhum arquivo de áudio, nada de terceiros: preferimos escrever um sintetizador pequeno a trazer o ZzFX. Sons curtos, em tons maiores e timbres macios (triângulo e seno com filtro), passando por um compressor.
- **Onde toca:** pulo (só quando o pulo sai de verdade, não ao apertar no ar), quique no toldo ("boing"), arremesso do caju, capivara comendo (mordidinhas e um "hm!"), Caju e Romã (sininhos diferentes), caixa de presente (arpejo), kit montado (arpejo com brilho), "falta algo" na bancada, dano (um "ops" grave, sem susto), passagem cidade ↔ showroom, conversa com o Pedro (dois bipes de "olá"), vitrine pronta (fanfarra), entrega derrubada na abertura, avanço das falas e cliques em botões da página. Os botões do jogo (setas, Caju, Pular) não fazem clique: o próprio pulo e o arremesso já soam.
- **Capivara dormindo:** não existe pisão no jogo, então não há som para isso.
- **Música de fundo:** 8 compassos originais em Dó maior (Dó, Lá menor, Fá, Sol), 92 bpm, cerca de 10 s em loop, a 1/5 do volume dos efeitos. Começa com a partida e para no final.
- **Botão de som no HUD** (alto-falante, ao lado da pausa), sincronizado com o "Som" do cabeçalho. A escolha fica no `localStorage` (`aventura-som`); começa ligado; se o navegador bloquear o armazenamento, vale só na visita.
- **Desbloqueio e pausa:** o contexto de áudio só é criado num gesto (toque, clique ou tecla), com o buffer mudo que o iOS antigo exige, e é retomado a cada gesto. Pausa, aba escondida e janela sem foco suspendem tudo; volta no "Continuar".

## Testado (Chromium, Playwright, servidor `vite` local)

- `npm test` 38 de 38 (testes novos em `tests/som.test.js` e `tests/fluxo-ui.test.js`) e `npm run build`.
- Computador 1280×800: nenhum contexto de áudio antes do primeiro clique; "Jogar" cria o contexto já tocando (`running`). Partida conduzida por teclado com teletransportes do teste: tocaram, nesta ordem, botao, derruba, pulo, arremesso, capivara, caju, roma, toldo, dano, transicao, pedro, kit ×3 e vitrine.
- Perda de foco (`blur`): jogo pausado e áudio `suspended`; "Continuar" volta a `running`.
- Botão do HUD desliga: `localStorage` = `desligado`, nenhum som novo ao pular; depois de recarregar, o cabeçalho mostra "Som: desligado".
- Celular em pé emulado 390×844 (toque, `isMobile`): toque em "Jogar" libera o áudio; toques em Pular e Caju soam; botão do HUD com 40×30 px ao lado da pausa, ícone muda para mudo.
- Volume medido renderizando cada som fora do jogo (pico de amplitude, já com o barramento de efeitos): 0,04 (botão) a 0,16 (Caju); música 0,09. Um estalo no início do ruído do kit (pico 0,46) foi achado e corrigido.
- Sem erros no console.

Capturas: `docs/capturas/som-celular-hud.png`, `som-celular-hud-mudo.png`, `som-computador-cidade.png`, `som-computador-vitrine.png`.

## Não testado

- **Ninguém ouviu os sons**: a máquina de teste não tem saída de áudio. O que foi conferido é que cada som dispara no momento certo, o estado do áudio e o volume medido. O gosto (timbre, música) precisa ser ouvido pelo Pedro.
- iPhone real: o desbloqueio segue o que o Safari exige, mas só um aparelho confirma. No iPhone, a chave de silencioso pode calar o áudio da página.

# Pisão na capivara e dicas mais claras (17/11/2026, sexta rodada)

Pedido: cair em cima da capivara deve fazê-la dormir, com quique e "zzz"; dar mais ênfase ao que é possível fazer.

- **Três formas de lidar com a capivara:** cair em cima (ela dorme), dar caju (ela come feliz) ou pular por cima. Encostar de lado numa capivara acordada e com fome continua tirando 1 coração. Dormindo ou alimentada, ela fica inofensiva até o fim da partida e o caju passa direto.
- **Pisão:** vale quando a exploradora está caindo e os pés estavam acima do topo da capivara no quadro anterior (folga de 8 unidades). O quique é 260 (340 segurando Pular), menor que o do toldo (360/430). O pisão funciona mesmo durante a invencibilidade depois de um dano. Regras em `src/game/capivaras.js`, sem Phaser.
- **Capivara dormindo:** usa o primeiro quadro de `capivara-andando` com o olho redesenhado fechado em código (`criarCapivaraDormindo` em `src/game/arte.js`); os quadros de olhos fechados de `capivara-comendo` seguram um caju e confundiriam com "alimentada". Ela amassa ao ser pisada, respira devagar e solta "Z" em pixel art desenhados em código (`criarZ`), que sobem, crescem e somem.
- **Dicas da primeira partida** (`src/game/Tutorial.js`): andar → pular → toldo na 1ª tendinha → **"Pule em cima da capivara para ela dormir!"** na 1ª capivara → caju na 2ª capivara. Na primeira vez que uma capivara empurra de lado aparece "Encostar de lado tira 1 ♥. Pise nela, dê caju ou pule por cima!". No showroom: caixas no alto → passar pela bancada → saída. As dicas da rua somem na transição.
- **Abertura:** a antiga fala "COMO JOGAR" virou três falas curtas: NA RUA (produtos e toldo), CAPIVARAS (pisar, caju, pular por cima, não encostar de lado) e NO SHOWROOM (Pedro, caixas, bancada, sem pressa). Na fala das capivaras a exploradora demonstra o pisão e a capivara dorme com "zzz".
- **Tela inicial:** quatro passos (Caju e Romã, toldo, capivara, kits) e o aviso de que encostar de lado tira 1 coração. O texto abaixo do jogo também cita as três formas.

## Testado de verdade

- `npm test` 46 de 46 depois das mesclas com as rodadas "sem limite de tempo", "showroom no celular em pé" e "efeitos sonoros" (6 novos em `tests/capivaras.test.js`: pisão, dano de lado, inofensiva, força do quique, `Aventura.adormecer` e textos de dicas, abertura e tela inicial) e `npm run build`.
- **Celular em pé emulado (Chromium, 390×844, toque por CDP):** seis falas da abertura com a demonstração do pisão; dicas na ordem andar, pular, toldo, pisão, caju e dano com toques reais nos botões; pisão posicionando a exploradora em queda sobre a 1ª capivara: dormiu, quique para cima, 5 corações; atravessar a capivara dormindo não tirou coração; botão Caju alimentou a 2ª; encostar de lado na 3ª tirou 1 coração e mostrou a dica; no showroom, dicas das caixas e da bancada (estoque ajustado pelo script para checar a dica). Sem rolagem, sem erros no console nem respostas 4xx/5xx.
- **Computador 1280×860, teclado real:** abertura pulada pelo botão e a cidade percorrida segurando → e pulando com Espaço perto das capivaras: 1 a 2 capivaras dormiram por pisão natural (duas execuções, antes e depois da mescla), nenhum dano, chegada ao showroom em 37,6 s de jogo. Os testes de celular e computador foram repetidos sobre a versão mesclada.
- Não refeita nesta rodada: a partida completa até a vitrine. Nada testado em aparelho real.

Capturas: `docs/capturas/v4-*.png`.
