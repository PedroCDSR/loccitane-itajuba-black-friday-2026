# Continuação para o Claude — decisões consolidadas em 17/11/2026

Este documento é a direção atual do usuário. Substitui os pedidos antigos de duração de 75s, HUD em faixa verde e propostas genéricas de arte. O handoff anterior está em HANDOFF-CLAUDE-HISTORICO.md apenas para histórico técnico, não como especificação atual.

## Primeiro: conferir o jogo real e as branches

1. Ler AGENTS.md, README.md, este handoff e docs/DIRECAO-CRIATIVA.md.
2. Atualizar refs Git, verificar mudanças locais e comparar main/dev. Em 17/11, a dev contém evolução de gameplay/Karina/Capim que não está toda na main. Não substituir src da dev pelo da main. Preservar contribuições e integrar apenas com comparação consciente; não usar force push.
3. Abrir https://dev--loccitane-itajuba.netlify.app/ no navegador em celular e desktop. As capturas do usuário mostram a implementação atual. Antes de propor UI, verificar esse enquadramento e seus assets reais.
4. Esta rodada do Codex entregou design/documentação, NÃO implementou as mudanças abaixo. Um estudo renderizado em HTML não é o HUD final nem uma alteração no jogo.

## Decisões aprovadas

### Tempo e percurso

- Sem limite de tempo: deixar jogar o quanto quiser. Retirar relógio, timeout como fim de partida, alertas de urgência e textos que prometem 75s. Atualizar testes que ainda exigem isso.
- Preservar a cidade, sua extensão e os marcos. Não encurtar trajeto. Manter modo fácil, teclado, multitoque, pausa, áudio e reinício.
- A missão e conclusão pela vitrine/showroom permanecem; remover timeout não significa encerrar automaticamente ou bloquear exploração. Preservar retorno à cidade que já existe na dev.

### HUD

- Remover faixa verde superior e barra bege de objetivo: HUD sobre o céu, ampliando a área visível de mapa conforme layout responsivo real. Não redesenhar cenário nem trocar personagem.
- Vida com cinco corações pixel art individuais cheios/vazios, sem “5 ♥”. Nome acessível informa vida atual.
- Cada produto revela seu contador somente após a primeira coleta daquele tipo. Mostrar apenas a quantidade coletada, nunca 0/3 ou total disponível. Não deduzir critérios de recompensa dessas contagens.
- Usar EXATAMENTE os pequenos sprites existentes: Caju `public/assets/showroom/caju.png` (32×78), Romã `public/assets/showroom/roma.png` (31×78), Capim `public/assets/produtos/capim-limao-colonia-sprite.png` (32×78). Não regenerar frascos, não usar artes grandes como ícones e não substituir por fruta/folha.
- Altura visual e base iguais: Caju tem conteúdo alfa em (4,4)-(27,71), Romã (4,5)-(24,72): ambos 67px visíveis; Capim (2,0)-(30,78): 78px visíveis. Portanto diminuir proporcionalmente Capim, em vez de igualar altura dos arquivos. Exemplo conferido em proposta05: Caju/Romã em caixas78px, Romã deslocado−1px; Capim altura67px, topo4px. Adaptar escala final mantendo essa relação.
- Pausa/som com símbolos discretos transparentes/translúcidos, contraste sobre céu e alvos touch de pelo menos44px. Preservar aria-label e aria-pressed.
- Mensagens de objetivo curtas e pontuais em creme/vinho. Evitar barra persistente e revelação de totais; não mostrar “Kits3/3” como contador de produtos.

### Diálogos

- Paleta escolhida explicitamente: CREME E VINHO. Fundo #F4EDDB, borda #942C39, texto marrom escuro; botão vinho com letras creme. Sem moldura dourada. Cantos em degraus e fonte pixel local com acentos.
- Texto curto em páginas; caixa menor. Revelação progressiva: primeiro toque completa texto, seguinte avança; teclado equivalente. Respeitar prefers-reduced-motion.
- AVANÇAR separado da caixa, acima dos botões Caju/Pular, aparece durante diálogo. Caixa não deve cobrir Karina, porta ou animação. Personagens aprovados preservados; não recortar retratos inventados das pranchas.
- Texto real no DOM ou mecanismo acessível, não rasterizado dentro da imagem. Ajustar tamanho de fonte ao celular antes de perseguir densidade de pixels.

### Abertura

- Sequência: fala curta → avanço oculta caixa → capivara anda e derruba cesto → reaparece continuação.
- No celular atual, capivara/cesto ficam fora do enquadramento. Ajustar câmera e/ou posições: exploradora um pouco à esquerda, cesto mais perto. Não basta esconder texto.
- Durante ação, evitar avanço duplicado; manter opção pular abertura e recuperação ao pausar. Fruta oferecida à capivara não é cosmético ingerido.

### Produtos na cidade

- Quantidades de Caju, Romã e Capim-Limão aproximadamente equilibradas pelo percurso; mais Capim em locais diferentes.
- Não obrigar os três juntos sobre toda tenda: alternar individuais/pares e distribuir entre rua, cestos e tendas.
- Alturas aparentes coerentes também no mundo. Não trocar a silhueta original do Capim por outro frasco.
- Não alterar silenciosamente ingredientes/regras dos kits: conferir a dev e preservar o objetivo existente.

### Tenda e marca

- Proporções compactas da primeira tenda são preferidas à versão alargada. Produtos menores no balcão; exploradora ao lado serve para avaliar escala.
- Referência mais recente: references/propostas/rodada-hud-tenda/03-tenda-exploradora-produtos-menores.png. É estudo recriado, não sprite runtime homologado; preservar sprites atuais da exploradora e dos produtos na integração.
- Reutilizar acabamento de madeira/toldo da proposta, preparar sprite final independente ou adaptar o desenho atual. Se alterar geometria visual, verificar colisão/quique do toldo em vez de assumir que tudo encaixa.
- Aplicar os logos ORIGINAIS de public/assets/showroom: `logo em alta resolução.png` e `SELO_REVENDEDOR.pdf.png`. Marca branca no vermelho, selo circular vermelho e marca branca, sem distorcer. Não usar as letras/emblemas regenerados nas imagens como fonte final. Preservar arquivos fonte.

## Quais estudos aproveitar

- `references/propostas/rodada-hud-tenda/05-hud-sprites-originais.html` + PNG: referência atual dos contadores com sprites pequenos e alturas aprovadas; HTML confere posicionamento e fontes em navegador. É estudo isolado, ainda precisa de layout real mobile e botão acima das ações.
- `04-estudo-ui-creme-vinho.png`: aproveitar caixa/paleta; IGNORAR os frascos incorretos desenhados nessa prancha.
- `03-tenda-exploradora-produtos-menores.png`: escala/composição compacta recente, não novo sprite de exploradora.
- `01-tenda-compacta-estudo.png`: proporção; seus produtos são antigos/genéricos.
- `02-tenda-larga-produtos.png`: estudo de embalagem; largura não escolhida.
- `references/propostas/ui/hud-dialogos-abertura-proposta.png`: REJEITADA como distante do jogo real; não implementar a partir dela.
- Não reconstruir gameplay a partir das pranchas: usar o código atual e os assets existentes.

## Outros assets/decisões preservados

- Nome correto: KARINA. Referências aprovadas em references/karina, coleção e helper existentes. Pedro continua funcionário/NPC; manter os papéis que a dev já implementou.
- Loader Caju em0/20/50/70/100 está em public/assets/carregamento com limitações no README: normalizar margens, limpar halo da folha e dirigir por progresso real. Essa porcentagem é carregamento de assets, não tempo de jogo.
- Card10% em public/assets/recompensas. Cards3%/5% ainda pendentes: usuário indicou3% para terminar sem coletar nada; critérios5%/10% não definidos. Não inventar faixas nem ativar oferta. Teto10%, contato/validade/condições configuráveis, sem cupom único no cliente.

## Ordem de execução sugerida

1. Conferir dev/site e capturar estado inicial em390×844,412×915 e desktop.
2. Remover limite de tempo/textos/testes antigos; preservar conclusão e passeio.
3. Refazer HUD com sprites originais e mostrar/ocultar cada contador por coleta.
4. Diálogo creme/vinho compacto e Avançar acima das ações; rever abertura/câmera.
5. Tenda com logos originais; equilibrar distribuição de produtos sem refatoração desnecessária.
6. Testar e documentar antes/depois, commitar e subir no GitHub. Sem deploy automático nesta tarefa.

## Validação exigida

- npm test e npm run build; testes significativos para ausência de timeout, revelação dos contadores e fluxo de avanço, sem testes que apenas dupliquem CSS.
- Conferir console e assets em navegador; touch e teclado, dois toques simultâneos, pausa/retomada, texto com acentos, avanço sem acionar pulo, abertura pulada e completa.
- Verificar HUD sobre céu/cenário escuro, safe areas, ausência de sobreposição na Karina e tela pequena. Contadores zero ocultos; três tipos ao coletar, altura visual igual.
- Confirmar que a pessoa pode continuar explorando além do limite antigo. Registrar o que foi de fato testado; não alegar homologação de aparelho real por screenshot headless.
