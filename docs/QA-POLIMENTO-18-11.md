# QA da revisão de polimento — 18/11/2026

Base: dev `ea31951`. Ambiente: Chromium headless (Playwright) neste container, renderização por software (~34 FPS, não representa celular). **Nenhum teste em aparelho físico.** Celular = emulação de viewport, toque e multitoque via CDP.

## O que foi jogado

| Teste | Como | Resultado |
| --- | --- | --- |
| Jornada completa | Teclado real (robô segurando setas/Espaço/E/Enter) da abertura até a cidade inteira, Pedro, Mariana, Marcela, fachada, Karina na porta, 2 produtos externos, porta, pedido no interior. Caixas: teletransporte até cada uma (coleta pela sobreposição real) | Passou. 170 pts, 5 vidas → 7% CAJU-K8R, imagem e link corretos. Despedida da Karina dentro do showroom antes do cupom; sem placa de saída |
| Reinício | 5 partidas seguidas por "Voltar ao início" → Jogar (2 com abertura completa, 3 pulando), pausa por Esc e aba oculta emulada em 4 delas; repetido com a correção do tutorial (4 partidas) | Passou. Cenário, capivaras, itens e controles em todas; 1 canvas, 1 elemento de áudio, 1 AudioContext; heap 24→25,5 MB após GC |
| Faixas | 7 cenários com coleta e dano reais (encostando na capivara): 250 pts/1 dano/2 externos → 10%; 290/2 danos → 7%; 270 sem externos → 7%; 150/vida 3 → 7%; 150/vida 2 → 5%; 140 → 5%; 290 com vida zerada e recuperada → 7% | Todos corretos (código, imagem e página do cupom) |
| Áudio | Faixa interceptada: volume, loop, estado | 0,8, loop, uma única faixa; para com mute, pausa, aba oculta e no encerramento; volta com Continuar e Voltar ao início. Headless permite autoplay, então o bloqueio real do celular não foi reproduzido |
| Compartilhar | `navigator.share` simulado: sucesso com arquivo, cancelamento, erro e ausência de suporte | Sucesso envia PNG 2,5 MB + texto; cancelar não mostra nada; erro e falta de suporte mostram "Salvar imagem" (200, image/png); sem suporte abre wa.me só com texto. Nada foi enviado |
| Links finais | Atributos | Resgate wa.me/553598137549 com código e página; Instagram e WhatsApp corretos em nova aba |
| Layout | 360×640, 390×844, 412×915, 844×390, 640×360, 1366×768 | Jogar sem rolar em todos (após correção do deitado). Botões ≥ 44 px. Sem rolagem horizontal |
| Multitoque | Dois toques simultâneos (direita + pular) via CDP | Anda e pula juntos; nenhum botão fica preso; toque em AVANÇAR não faz pular |
| Recortes e alturas | Ampliação 4× dos quadros | Alturas: Marcela ≈ exploradora, Mariana menor, Karina menor que ambas. Halo e vão corrigidos (ver abaixo) |

## Medições de desempenho (dev publicado)

- Antes: ~12 MB transferidos até o Jogar. 3,3 MB eram os 5 frascos do loading (PNG até 793×1983 exibidos a 300 px; o primeiro, 873 KB, antes de qualquer progresso aparecer) e 2,5 MB a arte promocional.
- Assets pré-carregados por `fetch` e depois pelo Phaser vêm do cache do navegador (sem nova transferência).
- Reinícios: único vazamento observado é 1 ouvinte `visibilitychange` por partida, criado pelo próprio Phaser e nunca removido; efeito desprezível (≈0,3 MB por partida).

## Corrigido nesta rodada

1. Dicas do tutorial voltavam em toda partida (o registry morria com o motor recriado). Flag booleana no módulo; nada do Phaser é reaproveitado.
2. Aviso "Caixas no alto das estantes!" aparecia por baixo da fala da Karina.
3. Celular deitado: painel empilhado deixava 110–250 px de jogo; a fala cobria PULAR ABERTURA em 640×360; Jogar ficava abaixo da dobra; a dica cobria a exploradora.
4. Contorno de foco no título "Vitrine pronta!".
5. Páginas de cupom declaravam 1536×1136 para imagens 1254×1254.
6. Frascos do loading em WebP (~260 KB); arte promocional baixada só depois de começar a partida.
7. Recortes da Mariana e da Marcela: halo claro, vão cinza entre as pernas e sombra bege entre os tênis (ferramentas/limpar_convidadas.py).

## Limitações

- Sem celular físico: Safari/iOS (que ignora `volume` em `<audio>`), autoplay real, menu nativo de compartilhamento e desempenho em aparelho não foram verificados.
- A coleta das caixas e alguns trajetos usaram teletransporte; o percurso da cidade e a entrada pela porta foram feitos com teclado.
- Prévia de link (Open Graph) só conferida no HTML; a arte promocional tem 2,5 MB e o WhatsApp costuma falhar com imagens grandes — conferir colando o link.
