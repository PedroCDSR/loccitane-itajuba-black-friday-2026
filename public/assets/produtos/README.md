# Produtos em pixel art

Artes com fundo transparente, geradas a partir das fotos oficiais do produto, preservando formato e características da embalagem. Não são fotografias nem arquivos oficiais de identidade visual.

| Arquivo | Produto / referência | Situação |
| --- | --- | --- |
| caju-sabonete-pixel-art.png | [Sabonete Líquido em Óleo Caju 250ml](https://br.loccitaneaubresil.com/pt-br/p/sabonete-liquido-em-oleo-caju/BROBVS100409.html) | Direção visual aprovada expressamente pelo usuário |
| roma-chantilly-pixel-art.png | [Chantilly de Banho Sabonete Líquido Romã](https://br.loccitaneaubresil.com/pt-br/p/chantilly-de-banho-sabonete-liquido-roma-175-ml/BROBVS100669.html) | Primeira versão para avaliação do usuário |

As duas primeiras artes são PNG RGBA de 793×1983 pixels. São artes-base em alta resolução: ainda não são sprites nativos de 24×32 ou spritesheets animadas. Desde 17/11/2026 o jogo usa derivados delas (`public/assets/showroom/caju.png` e `roma.png`, 78 px de altura) como coletáveis do showroom; os originais continuam intactos. Para novas versões, adaptar o detalhe à grade e dimensão final, conferir legibilidade e escala, e evitar simplesmente reduzir texto miúdo até ficar ilegível.

Caju: válvula branca, frasco alongado e levemente afunilado, líquido dourado, rótulo coral com medallhão creme. Romã: válvula rosa, corpo cilíndrico estreito e rótulo rosa com padrão de sementes. O texto de volume na foto de Romã é 180ml, embora a página utilize 175mL no nome; a imagem de referência foi seguida, sem presumir alteração comercial. Conferir a embalagem vigente antes do acabamento final.

Marca utilizada sob autorização expressa declarada pelo usuário. Imagens produzidas com a ferramenta de geração de imagens a partir das referências oficiais; pequenas diferenças de lettering podem permanecer. Não inventar novas embalagens nas próximas iterações.

## Colônia Capim-Limão

- `capim-limao-colonia-pixel-art.png`: arte em alta resolução com fundo transparente, fiel à silhueta do frasco oficial de vidro claro, relevo frontal e válvula prateada. Primeira versão para avaliação.
- `capim-limao-colonia-sprite.png`: derivado de32×78 px, nearest-neighbor, alfa binário e base na última linha. O relevo é representado por tons claros; em tamanho de jogo o texto pequeno não fica legível.
- Fonte: https://br.loccitaneaubresil.com/pt-br/p/deo-colonia-capim-limao/BROBVS100354.html . Fotografia consultada para criação, não publicada como asset.

O sprite ainda não foi adicionado à fase, à receita de kits ou ao contador de produtos. A missão continua Caju/Romã.
