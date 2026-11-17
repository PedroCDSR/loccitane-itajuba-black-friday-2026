# Passagem para o Claude

## Estado atual

O usuário autorizou evolução e deu35 minutos para esta rodada do Codex. Preservar mapa/tempo atuais: showroom5216, mundo5856, corrida140 e75s. Não reduzir ainda mais a cidade. A proposta anterior de encurtá-la foi corrigida pelo usuário.

Leia AGENTS.md e docs/EVOLUCAO-MISSAO.md. A integração já foi feita: não recriar do zero nem reaplicar o antigo prompt de assets como se estivessem apenas em references.

- `src/game/assets.js`: carregador dos novos assets, versões WebP de runtime.
- `src/game/arte.js`: animações a partir das folhas nativas de exploradora/capivara.
- `src/game/missao.js`: inventário, estoque, três estações e kits; funções puras com testes.
- `src/game/Aventura.js`: cidade com marcos novos, produtos Caju/Romã coletáveis, Pedro, conversa e bancada.
- `src/data/campanha.js`: três etapas da intro e dados comerciais ainda incompletos.
- `src/main.js`/`index.html`/`src/style.css`: intro, HUD, diálogo e controles sobre o canvas.

## Sua primeira tarefa

Execute npm test e npm run build; depois faça QA real em navegador. Esta rodada não teve navegador controlável. Testes anteriores de Chromium não validam a nova versão. Faça uma partida completa com cidade e showroom, usando teclado e toque emulado. Verifique console, 404, novas animações, body do jogador/capivara, pulo sobre cestos, alcance dos produtos e interação com as três estações.

A intro é ficção de jogo: uma entrega de Caju/Romã se espalhou pela cidade e Pedro precisa de ajuda para preparar a vitrine da última Black Friday. Coletar na rua, conversar opcionalmente e montar3 kits na bancada é o objetivo. Cada kit usa1 Caju e1 Romã, sem duplicação da mesma estação. O botão Caju oferece fruta separada, não cosmético. A conversa não consome tempo; verificar fechamento sem salto/interação duplicada. Sair com3 kits dá final de vitrine; timeout dá final parcial sem fingir sucesso.

Mantenha a duração e extensão. Se uma falha impedir acesso ao showroom, ajuste obstáculos/assistência e alcance, não encurte o mapa sem nova direção do usuário. Preserve os cinco corações e a ausência de perda de produtos em dano.

## Atenção visual

PNG exatos solicitados em public/assets/sprites-nativos e cidade-entardecer. Fontes preservadas em references/gerados-pacote. Sprites têm pequenas variações de pose/proporção da geração: avaliar em movimento. Runtime da cidade reduz paleta a128 cores; sprites codificados lossless. Dimensões/alpha preservados. Não confundir WebP lossless de imagem quantizada com fidelidade integral de cores da fonte.

Pedro usa o atlas de14 quadros existente, sem ser recriado. Fundos de showroom do outro agente preservados. Recursos de runtime novos somam~1,95MB, além de Pedro, fundos e bundle. Melhorar performance somente após medir, sem descartar os originais.

## Entrega esperada

Corrigir problemas reproduzidos e salvar capturas reais em docs/capturas com nomes novos. Registrar versão, testes e limitações. Commit/push sem sobrescrever alterações. Nenhum deploy nesta etapa. Não ativar oferta, inventar contato, validade, condições, CRM ou cupom único; teto10% permanece.
