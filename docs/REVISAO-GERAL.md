# Revisão geral da dev (17/11/2026)

Revisão dos quatro pedidos feitos em chats separados, mais os ajustes que o Pedro pediu depois de jogar a dev no celular. Branch revisada: `dev` (link de testes https://dev--loccitane-itajuba.netlify.app). Nada foi enviado para a `main`.

## Estado das branches

| Branch | Situação |
| --- | --- |
| `dev` | Tem os quatro temas mesclados pelos próprios chats (merges `e3c9cbe`, `3f27d23`, `bb9181e`, `c9e572c`) e as rodadas seguintes do showroom (`732808f` duas telas, `6c7de02` fachada fechada). Não havia conflito pendente. |
| `main` | Produção. Só tem um commit que a `dev` não tem: `055a57b` "Add files via upload", a foto original da fachada em `public/assets/showroom/fachada loccitane.png` (3 MB). A `dev` já usa essa arte (cópia em `references/propostas/fachada-fechada-original.png` e derivado `public/assets/showroom/fachada.png`). |
| `rascunho-tema2-pisao` | Rascunho superado pelo tema 2 da `dev`. Só referência; não foi mesclado. |

## O que cada tema entregou

1. **Sem limite de 75 s** (`c39b084`). Pronto. A partida só termina saindo do showroom com os três kits. Dá para ir e voltar entre a cidade e o showroom sem perder a missão, e o HUD não tem relógio. Nenhum texto do jogo fala em 75 segundos.
2. **Pisão na capivara** (`2fbd73e`). Pronto. Cair em cima faz a capivara dormir com "zzz", o caju continua alimentando e encostar de lado tira 1 coração. Dicas e abertura explicam as três formas.
3. **Sons** (`e4e8bbf`). Pronto, com duas correções desta revisão (abaixo). Todos os sons são gerados em código. O botão de som fica no HUD e o áudio só começa depois do primeiro toque.
4. **Showroom no celular** (`8fb5c05` e seguintes). Pronto, com os ajustes pedidos pelo Pedro nesta revisão: tirar o mapa, Pedro maior, andar pela calçada e não subir no toldo. Ficaram as setas para o objetivo, as duas telas (fachada e interior) com transição e a entrada pela porta.

## Problemas encontrados e corrigidos nesta revisão

- **Sons terminavam com estalo** (`924c063`). Em `tom()` e `ruido()`, em `src/services/som.js`, a queda de volume estava dentro de um comentário, então toda nota terminava no volume cheio e era cortada de repente. Medido no Chromium: antes 0,06 a 0,23 de amplitude nos últimos 5 ms de cada som; agora 0. Um teste impede que isso volte.
- **Capivara dormindo sem som próprio** (`924c063`). Os temas 2 e 3 foram feitos em paralelo e o pisão tocava o som do toldo. Agora tem o som "dormir" (quique fofo e um zzz que desce), também na demonstração da abertura.
- **Comentário citando um filme da Disney** no código das dicas, num repositório público (`2d563c0`). Só texto de comentário.

## Ajustes pedidos pelo Pedro depois de jogar a dev no celular

- **Mapa da loja removido** (fachada e interior). A câmera do jogo ocupa toda a tela. Sem o mapa, o celular em pé mostra pelo menos 136 unidades de largura do showroom (`LARGURA_MIN_SHOWROOM` em `src/game/guiaShowroom.js`). O que sobra embaixo é o reflexo escurecido do piso, que já existia.
- **Calçada inclinada.** Na fachada, a exploradora anda sobre a calçada, que na arte desce levemente da esquerda (y 255) para a direita (y 241), e não mais no nível do jardim. O piso são degraus de 4 unidades (0,18 de diferença cada), que a física sobe e desce sem travar (`CALCADA` e `chaoFachada` em `src/game/Aventura.js`). Pedro, os produtos de reserva e o botão da porta seguem a mesma linha.
- **Pedro maior.** Escala de 0,316 para 0,41: ele fica um pouco mais alto que a exploradora, na porta e na bancada.
- **Sem pular no toldo nem subir na marquise.** O toldo vermelho da fachada não quica nem segura mais, e a marquise deixou de ser plataforma. A caixa que ficava lá foi para o alto da estante esquerda do interior: **as três caixas agora ficam no alto das estantes**, duas na esquerda e uma na direita. A fala do Pedro e o objetivo da fachada mudaram junto (`CAMPANHA.boasVindasPedro`, fora da parte da oferta, e `objetivoMissao`).
- **Música de fundo "Espalhe Amor"**, a partir do MIDI enviado pelo Pedro (`references/musica/loccitane-espalhe-amor.mid`). `ferramentas/converter_midi.py` transforma o MIDI em `src/data/musica.js`: 1.108 notas com os tempos exatos do arquivo, 104 s. O sintetizador do jogo toca as notas com timbre de piano macio, em loop. Não há arquivo de áudio nem biblioteca de MIDI. Substitui a trilha original de 8 compassos. Pico medido de 0,083, perto da trilha anterior (0,09). A música para na pausa, com a aba escondida e no final.

## O que foi testado de verdade

Chromium com Playwright nesta máquina, sem placa de vídeo, servidor `npx vite --port 5173`.

- `npm ci`, `npm test` (49 de 49) e `npm run build`.
- **Computador 1280×860, teclado real, partida completa** (antes dos ajustes do Pedro). Tudo passou:
  - tela inicial sem "75 segundos" e nenhum contexto de áudio antes do primeiro clique;
  - abertura com 6 falas;
  - na cidade: dicas na ordem; pisão na 1ª e na 4ª capivara (dormiram, sem perder coração); caju na 2ª e na 5ª; encostar de lado na 3ª tirou 1 coração e mostrou a dica;
  - chegada ao showroom em 45 s de jogo; conversa com o Pedro; volta à cidade pela esquerda e retorno pela bandeira, sem perder a missão;
  - caixas, 3 kits, saída e tela final "Vitrine pronta!", com o tempo do passeio;
  - "Ver meu benefício": botão de envio e nome desativados, "até 10%", marketing desmarcado;
  - "Jogar novamente": volta ao começo com 5 corações e sem abertura;
  - perder o foco pausa o jogo e o áudio; "Continuar" retoma;
  - botão de som do HUD desliga e sincroniza com o cabeçalho;
  - todos os sons dispararam: pulo, toldo, caju, romã, arremesso, capivara, dano, dormir, transição, pedro, botão, caixa, kit, falta e vitrine;
  - console sem erros e nenhuma resposta 4xx/5xx.
- **Celular em pé 390×844, toque real por CDP:**
  - página sem rolagem; HUD, jogo e painel em coluna; botões abaixo do jogo, sem cobrir (◀ ▶ e Caju 74×74 px, Pular 98×98 px); botão de som 40×30 px no HUD;
  - áudio criado só depois do toque em "Começar";
  - abertura; segurar ▶ e tocar Pular junto (multitoque); quique no toldo de uma tendinha.
- **Celular em pé, depois dos ajustes do Pedro, só o showroom** (chegada por atalho de teste, com 3 Caju e 3 Romã no estoque):
  - fachada: mapa ausente (uma câmera só); Pedro 82 contra 64 da exploradora;
  - calçada percorrida de ponta a ponta nos dois sentidos, nenhuma das 896 amostras com os pés fora da linha da calçada, sem travar;
  - pulo embaixo do toldo: sobe e volta para a calçada, sem pousar no toldo;
  - botão "Entrar no showroom" na frente da porta e transição para o interior;
  - duas caixas na estante esquerda e uma na direita; 3 kits; saída e final;
  - sem erros nem 4xx/5xx.
- **Música** no 390×844: nenhum som antes do toque; com a partida parada na rua, 74 notas em 4 s sem nenhum efeito sonoro no período; pausada, nenhuma nota nova.
- **Celular em pé 412×915**: o mesmo percurso do showroom, com o mesmo resultado.
- **Link de testes no ar** (deploy `f783da1`, "ready" no Netlify), 390×844 com toque emulado: carrega o build novo, nenhum som antes do toque, música tocando depois, exploradora anda com toque, sem rolagem, sem erros e nenhum 404. Os deploys de `6c7de02` e `2d563c0` também saíram "ready".

Capturas reais em `docs/capturas/revisao-*.png`: `revisao-fachada-*`, `revisao-interior-*`, `revisao-estante-*` e `revisao-tres-kits-*` em 390×844 e 412×915 (versão nova); `revisao-no-ar-390x844.png` (link no ar); `revisao-celular390-*` e `revisao-computador-*` (antes dos ajustes da fachada: ainda com o mapa e o Pedro menor).

## O que não foi testado

- **Aparelho real.** O Pedro testou a dev num Android, e foi daí que vieram os ajustes acima. A versão nova ainda não foi testada num aparelho.
- **Ninguém ouviu os sons nem a música:** a máquina de teste não tem saída de áudio. Foram conferidos o momento de cada som, o estado do áudio e o volume medido.
- **A partida inteira por toque no celular, de ponta a ponta**, não fechou. O robô de toque travou no primeiro cesto: a emulação de toque do Chromium não soltava o dedo virtual do Pular. É limitação do teste, não do jogo; o mesmo trecho passou com teclado no computador. O celular emulado roda bem devagar aqui (o tempo do jogo anda ~0,25 s por segundo real em densidade 2).
- A partida completa no computador não foi refeita depois dos ajustes do showroom; o showroom foi refeito no celular, como descrito acima.

## Pendências e recomendações para o lançamento

1. **Direitos da música.** "Espalhe Amor" foi enviada pelo Pedro como música da L’Occitane. O repositório e o site são públicos: confirme que a autorização da marca cobre o uso da música no jogo.
2. **Foto da fachada na `main`.** `public/assets/showroom/fachada loccitane.png` (3 MB) está só na `main` e vai para o deploy, sem uso no jogo. Ao lançar (mesclar a `dev` na `main`), vale removê-la de `public/`, porque a cópia está em `references/propostas/`.
3. **`docs/RODADA-AJUSTES.md`** ainda descreve a caixa na marquise e o mapa da loja (rodadas anteriores). Esta revisão substitui essas partes.
4. **Commit `c39b084` "Unverified"** no GitHub: fica como está, conforme combinado, até todos os chats terminarem.
5. **Antes de lançar:** jogar a dev num iPhone e num Android, com som. No iPhone, a chave de silencioso pode calar o áudio da página.
6. **Oferta:** continua desativada (`oferta.ativa: false`, 10%, sem WhatsApp, validade, condições ou responsável). Nada disso foi mexido nem inventado.

## História nova: Pedro na praça, Carina no showroom (mesmo dia)

Pedido do Pedro: ele aparece no começo, na praça, e conta como a L’Occitane chegou a Itajubá; no showroom, quem atende é a Carina, dona da loja.

- **Merge da `main` na `dev`** para trazer a coleção de sprites da Carina (`3d7cca8`): `public/assets/personagens/carina/` e `src/game/carina-animacoes.js`. O merge também trouxe a foto original da fachada (`055a57b`). Sem conflitos.
- **Pedro na praça**, ao lado da fonte do Theodomiro Santiago (x 1330), logo depois das primeiras dicas e da primeira capivara. Ele acena quando a exploradora chega perto e a conversa abre sozinha na primeira passagem, ou pelo botão "Conversar com Pedro". A fala é só a que o Pedro ditou: "Oi! Eu sou o Pedro. Em janeiro de 2023 nós trouxemos a L’Occitane para Itajubá, com o objetivo de trazer uma nova forma de autocuidado para a cidade." A conversa não mexe na missão.
- **Carina no showroom**, no lugar do Pedro: recebe na porta e depois espera ao lado da bancada, acenando a cada kit. A fala dela são só as instruções da missão (as mesmas de antes), sem falas pessoais inventadas. Altura 70 (escala 0,39), entre a exploradora (64) e o Pedro (78).
- **Textos:**
  - abertura "MENSAGEM DA CARINA" (antes "MENSAGEM DO PEDRO") e "Fale com a Carina" na fala "NO SHOWROOM";
  - objetivo da fachada e passo 04 da tela inicial passam a citar a Carina;
  - final: "montou 3 kits com a Carina".
  As falas ficam em `CAMPANHA.conversas` (`src/data/campanha.js`, fora da parte da oferta).
- As conversas abrem com a exploradora a 30 unidades do personagem (antes 20), para os dois aparecerem lado a lado e não um na frente do outro.

Testado no Chromium em 390×844 com toque emulado:
- abertura com as 6 falas;
- conversa do Pedro abrindo ao andar até ele, sem reabrir depois;
- objetivo da fachada "Fale com a Carina", conversa da Carina na porta, Carina na bancada acenando nos kits;
- final com "com a Carina";
- sem erros nem 4xx/5xx.

`npm test` passou (52 de 52, com um teste novo da conversa do Pedro) e `npm run build` também. Capturas: `revisao-pedro-praca-conversa.png`, `revisao-carina-conversa.png`, `revisao-carina-porta.png` e `revisao-carina-bancada.png`.

Para confirmar com o Pedro: o nome no repositório é **Carina** (com C), como na coleção de sprites. Ele disse "Karina" na conversa.

## Bandeira, estantes, bancada e nome da Karina (mesmo dia)

Pedidos do Pedro depois de jogar no celular:

- **Bandeira do fim da rua.** A bandeira desenhada em código saiu. Entrou a mesma bandeira do jardim do showroom, recortada da arte original da fachada por `ferramentas/recortar_bandeira.py` (tecido, mastro e base, alfa binário, 3 px por unidade) e salva em `public/assets/showroom/bandeira-jardim.png` (35×84 unidades).
- **Exploradora "voando" na estante.** A plataforma de altura 183 ia até a parte do meio da estante esquerda, onde a arte não tem tábua nesse nível. Agora as plataformas seguem a arte (medidas sobre `interior.png`):
  - parte esquerda (52–97): tábua em 183;
  - parte do meio (105–152): tábua em 168, mais as prateleirinhas de parede (129–152) em 209 e 190, que servem de degrau;
  - topo das duas partes em 150;
  - estante da direita: tábua em 185 (antes 183, acima da tábua) e topo em 150.
- **Personagem na bancada no chão.** O sprite não tem espaço vazio embaixo: parecia flutuar porque ficava exatamente na linha da parede, com o piso inteiro na frente. Na bancada, a Karina agora fica 9 unidades à frente, sobre o piso (y 250).
- **Karina com K** em todos os textos do jogo: conversa, abertura ("MENSAGEM DA KARINA"), objetivo, botão "Conversar com a Karina", tela inicial e final. Os arquivos da coleção foram renomeados para `karina` na `main` (`723a7cf`) e o código passou a usar esses nomes.

Testado no Chromium em 390×844:
- do chão para a tábua do meio (168) e para o topo (150);
- a parte esquerda (183 → 150) e a direita (185 → 150);
- as três caixas;
- solta onde antes ficava "voando" (x 120, altura 178): agora cai até o chão;
- bandeira no fim da rua e Karina sobre o piso;
- sem erros nem 4xx/5xx.

`npm test` passou (52 de 52) e `npm run build` também. Capturas: `revisao-bandeira-rua.png`, `revisao-estante-meio.png` e `revisao-karina-bancada.png`.

## Instruções aos poucos e Pedro com os pés no chão (mesmo dia)

Pedido do Pedro: "muita informação no início e pouco jogo". Nenhuma instrução saiu; mudou só a ordem em que aparecem.

- **Tela inicial:** três passos, só o convite: recuperar os produtos espalhados pela cidade, levar tudo ao showroom, ajudar a Karina a montar os kits. As regras da capivara saíram daqui e ficam nas dicas da rua.
- **Abertura:** 3 falas em vez de 6.
  - "ITAJUBÁ · NOVEMBRO DE 2026";
  - "OPA!": a capivara derruba a entrega e os produtos se espalham pela cidade;
  - "SUA MISSÃO": "Recupere os produtos espalhados por Itajubá e leve tudo ao showroom da L’Occitane. É só seguir sempre em frente. Sem pressa!"
  
  Saíram da abertura as falas NA RUA, CAPIVARAS e NO SHOWROOM, além da demonstração do pisão. Objetivo da rua: "Recupere os produtos e siga em frente até o showroom →".
- **Na rua**, as dicas que já existiam, cada uma na hora da ação: andar → pular → toldo na 1ª tendinha → pisão na 1ª capivara → caju na 2ª → "encostar de lado tira 1 ♥ · pise, dê caju ou pule por cima" na primeira vez que acontece. O Pedro aparece na praça, entre a 1ª e a 2ª capivara.
- **No showroom**, a Karina explica, com o texto ditado pelo Pedro: "Que bom que você chegou! Preciso da sua ajuda para montar os kits de presente: cada um leva um Caju, uma Romã e uma caixa. As caixas estão no alto das estantes, lá dentro. Você consegue pegar para mim, por favor? Depois é só passar na bancada." Depois vêm as dicas das caixas e da bancada.
- **Pedro flutuando.** Os quadros da folha do Pedro tinham de 5 a 11 px sem pixel visível embaixo dos tênis: linhas quase transparentes que sobraram da redução da imagem, diferentes em cada quadro. `ferramentas/preparar_showroom.py` agora alinha o recorte de cada quadro pelo último pixel visível (`alinhar_pes`), e `public/assets/showroom/pedro-jogo.json` foi regenerado. Pedro e Karina, na fachada, pisam na mesma linha que a exploradora; na bancada, a Karina continua um pouco à frente, sobre o piso. Os quadros da Karina já tocavam a base.

Testado no Chromium em 390×844:
- textos da tela inicial e da abertura (3 falas);
- dicas na ordem andar, pular, toldo, pisão, caju e dano de lado;
- conversa da Karina na porta e objetivo da fachada;
- pés do Pedro na mesma linha que os da exploradora, em todos os quadros da conversa (zoom em `revisao-pedro-pes.png`);
- sem erros nem 4xx/5xx.

`npm test` passou (52 de 52, com o teste dos textos refeito para "instruções aos poucos") e `npm run build` também. Capturas: `revisao-ritmo-*.png` e `revisao-pedro-pes.png`.

## Contadores no HUD e Capim-Limão (mesmo dia)

Pedido do Pedro: contadores com o ícone do próprio produto no canto superior esquerdo, um por produto, que só aparecem quando o primeiro item daquele tipo é pego; e espalhar a colônia Capim-Limão pela cidade.

- **Merge da `main` na `dev`** (`723a7cf`): a coleção da Karina foi renomeada para `karina` (arquivos, `src/game/karina-animacoes.js`, animações `karina-*`) e chegou o sprite `public/assets/produtos/capim-limao-colonia-sprite.png` (32×78, mesmo formato do Caju e da Romã). O código da dev passou a usar os nomes `karina` em tudo.
- **Contadores** (`#presentes` em `index.html`, atualizados em `atualizarHUD`): Caju, Capim-Limão, Romã e caixas de presente, nessa ordem, à esquerda logo depois dos corações. Cada um tem o ícone do frasco ou da caixa e o número. Começam escondidos, aparecem no primeiro item e dão um pulinho a cada novo item (sem animação para quem pede menos movimento). O texto "Caju 0 · Romã 0 · Caixas 0" saiu. Para leitor de tela, o grupo tem um `aria-label` com o resumo ("2 Caju, 1 Capim-Limão…").
- **Capim-Limão na cidade:** 10 frascos, 4 no chão entre os marcos (x 610, 1900, 3250, 4250) e 1 no alto de cada uma das 6 tendinhas, entre o Caju e a Romã (pega-se com o quique). Tem aviso "+1 Capim-Limão", sininho próprio e entra no texto do final ("Você reuniu 2 Caju, 2 Capim-Limão, 1 Romã…").
- **Fora da receita dos kits:** cada kit continua com Caju, Romã e caixa, como diz o README do sprite ("a missão continua Caju/Romã"). O Capim-Limão é coleção. Se o Pedro quiser, dá para colocá-lo nos kits.

Testado no Chromium em 390×844:
- no começo nenhum contador aparece; depois do 1º Caju aparece só o dele; depois do 1º Capim-Limão, os dois;
- um quique no toldo da 1ª tendinha pegou o Caju, o Capim-Limão e a Romã do alto, e o contador da Romã apareceu;
- os ícones carregam e o HUD cabe na largura;
- o final cita o Capim-Limão;
- sem erros nem 4xx/5xx.

`npm test` passou (54 de 54; novos: Capim-Limão fora da receita e contadores com ícone real) e `npm run build` também. Capturas: `revisao-contadores-0.png`, `-1.png` e `revisao-contadores-tenda.png`.

## Rodada do handoff consolidado: HUD sobre o céu, diálogo creme e vinho, abertura, tenda e produtos (mesmo dia)

Seguindo `docs/HANDOFF-CLAUDE.md` (versão consolidada na `main`, `a2563ba`) e os estudos aprovados de `references/propostas/rodada-hud-tenda/` (05 para o HUD, 04 só para a paleta, 03 e 01 para a tenda). A prancha `references/propostas/ui/hud-dialogos-abertura-proposta.png`, rejeitada, não foi usada.

- **Merge da `main` na `dev`** com o handoff, os estudos, as logos originais, o loader do Caju e o card de 10%. Um conflito em `AGENTS.md` foi resolvido ficando com a versão da `main`; as duas diziam "sem limite de tempo".
- **Sem limite de tempo:** já valia desde `c39b084`. Nada mudou aqui.
- **HUD sobre o jogo** (`index.html`, `src/style.css`, `atualizarHUD` em `src/game/Aventura.js`):
  - saíram a faixa verde e a barra bege;
  - a tela do jogo vai do topo até o painel de botões (`TELA.alturaMax` 2400);
  - cinco corações pixel art cheios e vazios, com `aria-label` "N de 5 corações";
  - contadores com os sprites pequenos originais (`showroom/caju.png`, `showroom/roma.png`, `produtos/capim-limao-colonia-sprite.png`), na mesma altura visível: o Capim-Limão fica em 67/78 da altura, a Romã sobe meio pixel, como na proposta 05;
  - cada contador aparece só depois do primeiro item daquele tipo, mostra só a quantidade e nunca total ou "0/3";
  - som e pausa como símbolos pixel translúcidos, com alvo de 44×44 px e os mesmos `aria-label`/`aria-pressed`;
  - o objetivo virou um aviso curto em creme e vinho, que aparece quando muda e some em 5 s; "Kits 3/3" não aparece mais no HUD.
- **Diálogo creme e vinho:**
  - fundo #F4EDDB, borda #942C39, texto marrom, cantos em degrau, fonte pixel local (Press Start 2P, com todos os acentos);
  - falas divididas em páginas curtas (`src/game/falas.js`, quebra nas frases e, se preciso, na vírgula);
  - texto revelado letra a letra: o primeiro toque completa, o seguinte avança; E, Enter ou Espaço fazem o mesmo; com `prefers-reduced-motion`, o texto aparece de uma vez;
  - **AVANÇAR** separado, acima de Caju e Pular, só durante a conversa;
  - a caixa fica abaixo do HUD e não cobre a Karina: em 390×844 ela termina em 200 px e a cabeça da Karina começa em 256 px;
  - títulos em maiúsculas e minúsculas, porque nas maiúsculas da fonte o acento é um pixel só.
- **Abertura:**
  - 1ª fala (duas páginas) → a caixa e o AVANÇAR somem → a capivara anda até o cesto, derruba a entrega e os frascos voam → a caixa volta com "Opa!…" → missão;
  - durante a cena, tocar não avança (`acaoIntro`), e "Pular abertura" continua funcionando;
  - para caber no celular em pé, a exploradora para em x 58, o cesto fica em x 112 e a capivara chega de x 178 (câmera 0 a ~150);
  - os frascos que voam incluem o Capim-Limão.
- **Tenda:**
  - placa com a **logo original** ("logo em alta resolução.png", marca branca no vermelho) e pano com o **selo de revendedor original** em disco vermelho e arte branca, como o Pedro pediu;
  - as duas são recortadas e reduzidas sem deformar por `ferramentas/preparar_logos.py` (`public/assets/showroom/logo-tenda.png`, `selo-tenda.png`), e os arquivos fonte foram preservados;
  - no balcão, os três frascos menores com a mesma altura visível, a sacola e a caixa de presente;
  - proporção compacta da tenda atual: a textura só cresceu para cima, para a placa caber, e o toldo e o balcão ficaram na mesma altura do mundo (colisão e quique iguais).
- **Produtos na cidade:**
  - 9 Caju, 9 Romã e 9 Capim-Limão: 12 no chão alternando os três, 6 nos cestos alternando e 9 no alto das tendas;
  - cada tenda tem um ou dois produtos no alto, alternados, nunca os três;
  - no mundo, o Capim-Limão também fica 67/78 menor, para ter a altura aparente dos outros;
  - a receita dos kits continua Caju, Romã e caixa.

### Testado de verdade

- `npm test` passou (57 de 57) e `npm run build` também. Testes novos:
  - páginas das falas;
  - a abertura esconde a caixa durante a cena, não avança no meio dela e pode ser pulada;
  - quantidades iguais e um ou dois produtos por tenda;
  - a conversa do Pedro em duas páginas;
  - contadores com ícone real.
- Chromium (Playwright), 390×844 com toque emulado:
  - digitação, 1º toque completa, páginas;
  - a cena da capivara aparece inteira na tela, com a caixa e o AVANÇAR escondidos, e tocar durante a cena não avança;
  - HUD transparente, sem rolagem e com botões de 44 px;
  - contadores aparecendo no 1º Caju e no 1º Capim-Limão;
  - corações esvaziando com o dano;
  - tenda com as logos;
  - conversa do Pedro fechada com Espaço sem a exploradora pular;
  - caixa da Karina sem cobri-la;
  - pausa e retomada;
  - sem erros nem 4xx/5xx.
- 412×915 e computador 1280×800: o mesmo roteiro (resultado abaixo).

### Não feito nesta rodada

- **Loader do Caju** (`public/assets/carregamento/`): o README pede para normalizar as margens e limpar o halo antes de integrar. Ficou para outra rodada.
- **Cards de 3% e 5%:** pendentes de decisão do Pedro. A oferta continua desativada e o teto de 10% não mudou.
- **Sem deploy:** como pede o handoff, o trabalho foi para a branch `claude/modest-hamilton-dqefs6` e não para a `dev`, que publica sozinha no Netlify.
