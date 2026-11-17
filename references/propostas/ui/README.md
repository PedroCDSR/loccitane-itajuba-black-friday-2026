# Proposta de HUD, diálogos e abertura

Prancha conceitual gerada com IA em 17/11/2026. Proposta para avaliação do usuário, não componentes já recortados ou UI implementada. O jogo não foi alterado nesta entrega.

## Direção para Claude

- Remover a faixa verde superior. HUD absoluto sobre o céu, sem reduzir a área do mapa. Respeitar safe areas e manter alvos touch de pelo menos 44px mesmo com ícones pequenos.
- Vida: cinco corações pixel art individuais, cheios/vazios, sem o número 5. Manter nome acessível com quantidade atual de vidas.
- Contadores: miniaturas dos TRÊS produtos aprovados com números contrastantes. A prancha simplifica os frascos: NÃO substituir os produtos existentes por esses desenhos. Capim-Limão usa seu frasco original e precisa ter altura aparente comparável à dos demais.
- Tempo, pausa e som: símbolos pixelados sobre fundos transparentes ou discretamente translúcidos; contorno/sombra escura para legibilidade no céu. Preservar teclado e aria-label/aria-pressed.
- Diálogo: borda escalonada vinho/dourada, interior creme, fonte pixel local já disponível com acentos. Máximo de duas ou três linhas por página; texto real no DOM, não rasterizado na imagem. Tipografia legível no celular prevalece sobre densidade de pixels.
- Revelação progressiva do texto: primeiro toque completa a frase, próximo avança; teclado também. Reduzir movimento respeita preferência do sistema. Dividir falas longas em páginas, nunca cortar informação.
- Caixa compacta: meta de 18–22% da altura do palco, com adaptação mobile. Posicionar abaixo dos personagens ou em área livre sem cobrir Karina, porta ou controles. O retrato da prancha não é aprovado: usar as referências de rosto de Karina já aprovadas.
- Abertura em três momentos: fala curta; avançar esconde caixa e encena capivara; ao acabar a animação reaparece a fala seguinte. Bloquear avanço duplicado durante a ação e preservar pular abertura. Não consumir o relógio de jogo.
- Exploradora um pouco à esquerda; cesto próximo; capivara e frascos visíveis no enquadramento mobile. A cena inferior é storyboard, não troca de cenário: abertura permanece na cidade existente.
- Caju/Romã/Capim distribuídos em quantidades próximas pelo trajeto, alternando pares e produtos individuais nas tendas; não colocar sempre os três juntos. Não mudar silenciosamente ingredientes dos kits.
- Logos: usar os arquivos originais em public/assets/showroom (logo em alta resolução e SELO_REVENDEDOR.pdf.png). Fundo vermelho com marca branca; selo circular vermelho com marca branca. Os logos ilustrados na prancha NÃO são fontes oficiais nem devem ser recortados.
- Paleta aproximada do projeto: creme #F4EDDB, vinho #942C39, verde #304F3D, dourado #B18B45. Os códigos escritos na imagem são ilustrativos, usar estes do projeto.

## Entrega

`hud-dialogos-abertura-proposta.png`: prancha de direção. Não carregar a prancha inteira no jogo. Recriar UI responsiva com CSS/SVG ou sprites próprios, mantendo texto selecionável/acessível. A fonte pixel existente pode ser reutilizada.

Verificar em 390×844, 412×915, paisagem e desktop: HUD sem sobreposição, Karina visível, animação do cesto sem texto por cima, acentos, quebra de linhas, touch e teclado. Esta proposta não foi homologada em navegador.
