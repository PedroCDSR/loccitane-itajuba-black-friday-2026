# Propostas de carregamento — Caju

Artes geradas com IA a pedido do usuário em 17/11/2026. Frasco Caju com percentual no lugar do nome e líquido dourado como indicador de progresso.

| Arquivo | Estado | Dimensões |
| --- | --- | --- |
| caju-000.png | 0% | 793×1983 |
| caju-020.png | 20% | 793×1983 |
| caju-050.png | 50% | 512×1024 |
| caju-070.png | 70% | 512×1024 |
| caju-100.png | 100% | 512×1024 |
| caju-050-070-100-folha.png | Folha fonte dos três últimos estados | 1536×1024 |

Os três recortes preservam os pixels da folha fonte. Esta folha foi gerada novamente porque a versão anteriormente mostrada no chat não ficou salva no ambiente.

## Integração futura

Ainda não conectados ao loader. Usar progresso real do carregamento para selecionar o estado, sem temporizador fictício; mostrar 100% somente ao concluir. Pré-carregar estes próprios indicadores antes dos assets principais, com fallback simples de texto.

São propostas visuais, não uma animação normalizada: escalas e margens de 0/20 e 50/70/100 diferem e precisam de alinhamento antes da integração. A folha tripla contém halo semitransparente em torno dos frascos; revisar sobre o fundo verde e remover o halo antes do acabamento final. Os níveis de líquido são ilustrativos, sem medição geométrica exata. Nenhum teste visual em navegador foi feito nesta rodada.

## Versões de runtime (18/11/2026)

O loader usa `caju-000.webp` … `caju-100.webp`: as mesmas artes reduzidas para 900 px de altura (LANCZOS, WebP q88). Exibidas a 300 px de altura no máximo, ficam idênticas na tela e somam ~260 KB contra ~3,3 MB dos PNG, que eram baixados antes do primeiro indicador aparecer. Os PNG acima continuam como fonte.
