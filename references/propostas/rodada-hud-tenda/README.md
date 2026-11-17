# Rodada de propostas — HUD, diálogos e tenda

Referências de design, geradas com IA a pedido do usuário em 17/11/2026. Não implementadas no jogo. Não carregar estas pranchas no runtime.

## Imagens

1. `01-tenda-compacta-estudo.png`: primeira tenda, proporções preferidas; produtos ainda genéricos.
2. `02-tenda-larga-produtos.png`: estudo mais largo com os três produtos referenciados nos sprites originais. Largura não escolhida.
3. `03-tenda-exploradora-produtos-menores.png`: composição compacta com produtos menores e exploradora ao lado para comparar escala. Recriada nesta entrega a partir da última imagem no chat porque o arquivo exibido anteriormente não ficou disponível no ambiente. É nova versão equivalente, não o arquivo idêntico anterior.
4. `04-estudo-ui-creme-vinho.png`: nova síntese do estudo de cores e HUD; a prancha anterior de cores e os mockups recentes de HUD não ficaram disponíveis como arquivos. Escolha do usuário: CREME E VINHO. Os frascos desenhados nesta prancha são ilustrativos e têm rótulos incorretos: NÃO os recortar, usar os PNGs originais.

## Direção atual — prevalece sobre propostas anteriores

- Usuário retirou o limite de tempo: jogo sem cronômetro visível e sem término por tempo. Isso ainda precisa ser implementado; código e regras antigas de 75s não foram alterados nesta entrega de design.
- HUD sobreposto ao céu, removendo faixa verde e barra bege. Layout deve partir do jogo real https://dev--loccitane-itajuba.netlify.app/ e das capturas do usuário, sem redesenhar cenário ou personagens.
- Cinco corações pixelados individuais em vez de “5 ♥”. Pausa e áudio com fundo transparente/translúcido e alvos touch confortáveis.
- Cada contador só aparece após a primeira coleta do respectivo produto. Mostrar quantidade coletada inteira, nunca “0/3” ou total disponível.
- Usar EXATAMENTE os sprites dos produtos existentes em public/assets/produtos: caju-sabonete-pixel-art.png, roma-chantilly-pixel-art.png, capim-limao-colonia-pixel-art.png (ou derivados runtime fiéis). Não usar frutas, folhas ou frascos genéricos como ícones desses produtos.
- Diálogos compactos creme #F4EDDB com borda vinho #942C39, texto marrom escuro, cantos escalonados e fonte pixel legível. Sem moldura dourada. Falas curtas paginadas, revelação progressiva; primeiro toque completa texto, seguinte avança.
- Botão AVANÇAR separado da caixa e posicionado acima dos botões Caju/Pular. Aparece apenas durante diálogo; não cobrir personagem, porta ou ação.
- Abertura: fala → caixa oculta durante ação da capivara → continuação. Ajustar enquadramento mobile para mostrar exploradora, cesto próximo e capivara; só esconder texto não basta.
- Tenda: proporções compactas da primeira; três produtos menores da versão mais recente; madeira detalhada, toldo listrado creme/vermelho.
- Logos: aplicar os arquivos originais de public/assets/showroom diretamente. Marca branca sobre vermelho; selo circular com fundo vermelho e arte branca, sem deformar. As marcas geradas nas imagens são apenas estudo, não substituem os originais.
- A exploradora desta composição é referência de escala, não um novo sprite aprovado para substituir a personagem do jogo.

## Para o Claude

Ler a branch dev e o jogo publicado antes de implementar: mudanças recentes de gameplay estão em dev. Preservar contribuições existentes. Não importar as propostas antigas com relógio ou “0/3”. Distribuição dos produtos equilibrada, sem exigir três em toda tenda, permanece pedido pendente de implementação.

Esta rodada adiciona apenas imagens e documentação. Nenhuma mudança no gameplay, deploy ou homologação mobile. Testes Node e build devem passar; validar depois a implementação em celular e desktop.

## Correção dos produtos do HUD

`05-hud-sprites-originais.html` e sua captura PNG usam diretamente os três PNGs originais do projeto em elementos img, sem regenerar as embalagens. Substituem os ícones incorretos da prancha 04. Estudo isolado de interface, não integrado ao jogo. Abrir o HTML por servidor na raiz do repositório para carregar imagens e fonte. Contadores exemplificam produtos já coletados; lógica de exibição após coleta ainda pertence à implementação futura.

### Ajuste final: sprites pequenos

A proposta 05 agora referencia `public/assets/showroom/caju.png` (32×78), `public/assets/showroom/roma.png` (31×78) e `public/assets/produtos/capim-limao-colonia-sprite.png` (32×78). Substituem as artes grandes da versão anterior. Preservar pixels com image-rendering: pixelated e proporção original, sem regenerar embalagens. Captura conferida em navegador headless; jogo continua sem alterações nesta entrega.

Altura visual corrigida: Caju/Romã têm 67px de conteúdo visível dentro do PNG de 78px, enquanto Capim ocupa 78px. A proposta reduz proporcionalmente Capim para 67px e alinha os três conteúdos visíveis à mesma base e topo. Arquivos fonte preservados.
