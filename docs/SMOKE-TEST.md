# Teste de fumaça da base e fotos do showroom

Data: 17/11/2026. Ambiente: Linux no contêiner, Node 22.23.4, Chromium do Playwright (`/opt/pw-browsers/chromium`).

## Fotos do showroom

Seis fotos adicionadas em `references/showroom/` (referência, fora do build). `manifest.json` está com status `present` e SHA-256.

| Arquivo | Conteúdo |
| --- | --- |
| 01-fachada-obliqua.jpg | Fachada inclinada com placa vermelha de revendedor (Street View, Dez 2025) |
| 02-fachada-jardim.jpg | Portão e jardim com muro de pedra (Street View, Dez 2025) |
| 03-toldo-vermelho.jpg | Toldo vermelho "Revendedor L'Occitane au Brésil" sobre pedra (Street View, Dez 2025) |
| 04-kits-presentes.jpg | Kits vermelhos com janela, frascos e caixa Ninfa das Águas |
| 05-estantes-showroom.jpg | Estantes de madeira clara com produtos |
| 06-jardim-bandeira.jpg | Bandeira vermelha L'Occitane no jardim de pedra |

Associação feita pela ordem de envio e pelo conteúdo visível. **Confirmar com o Pedro** se algum nome estiver trocado. Três fotos têm interface e atribuição do Google Street View, preservadas no arquivo. O uso comercial depende da autorização da marca, não de licença do Google.

## Resultados

| Teste | Resultado |
| --- | --- |
| `npm ci` | Passou |
| `npm test` | 7 de 7 passaram |
| `npm run build` | Passou. `dist/` com JS de 1,39 MB (365 KB gzip) |
| Carregamento no Chromium (844×390) | Passou. Sem assets ausentes após a correção do favicon |
| Início da partida | Passou |
| Movimento, salto, pausa e retomada | Passou. O tempo fica parado durante a pausa |
| Coleta de presentes | Passou (2 presentes na partida de teste) |
| Arremesso de caju | Só verificado que a tecla X é aceita e o jogo continua. Não verificado se o caju acertou capivara |
| Chegada à tela final | Passou em 71 s, por tempo ou chegada à fachada |
| Reinício | Passou. A partida volta com 0 presentes |
| Resgate bloqueado sem configuração | Passou. Botão "enviar" desabilitado e aviso de pendência |
| Compartilhamento pelo WhatsApp | Só conferido o link (`wa.me` com texto). **Não clicado**, para não abrir mensagem real |
| Controles de toque | Emulação com ponteiro do mouse em contexto de toque: botões de 64×45 px e estado "pressed" ao segurar. **Não é multitoque real** |
| Console | Sem erros de página. Restam avisos de desempenho do WebGL (`ReadPixels`), sem impacto no fluxo |

## Correção feita

- `index.html`: adicionado `<link rel="icon" href="data:," />`. O navegador pedia `/favicon.ico`, que não existe, e isso gerava um 404 no console.

## Pendências (não corrigidas nesta etapa)

1. Os botões de toque têm 45 px de altura. Os 64 px do requisito de toque valem para o projeto anterior, não para este; decidir se a altura deve aumentar.
2. Testar multitoque (dois ou três dedos), giro de tela e barras do navegador em aparelho real: Android Chrome e iPhone Safari.
3. Testar o caju contra as capivaras e a sequência completa com teclado e toque.
4. Testar áudio no iPhone após o primeiro toque, em aparelho real.
5. Clicar no compartilhamento e no botão de WhatsApp só em teste controlado, sem enviar mensagem real.
6. Configurar a oferta (`src/data/campanha.js`) só depois de validar com a loja. O resgate continua bloqueado.
7. Revisar o showroom com as seis fotos (fidelidade visual, como pede `docs/DIRECAO-CRIATIVA.md`).
