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
