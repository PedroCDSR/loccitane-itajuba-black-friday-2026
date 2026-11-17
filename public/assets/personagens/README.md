# Pedro — funcionário do showroom

![Pedro em pixel art](pedro-pixel-art.png)

Arte criada a pedido do usuário a partir da foto de Pedro enviada na conversa: cabelo escuro curto, barba e bigode, camiseta preta, avental vermelho da L’Occitane au Brésil, relógio, tênis claros e aceno de boas-vindas.

`pedro-pixel-art.png`: PNG RGBA de 887×1774, fundo transparente, corpo inteiro, uma única pose. Arte-base estilizada de personagem, não spritesheet ou animação pronta. Integrado como NPC na porta do showroom pela spritesheet abaixo (`src/game/Aventura.js`). A fotografia original não está incluída neste arquivo nem neste commit.

Papel proposto: NPC que recebe a exploradora dentro do showroom. Preservar aparência, roupa e identidade ao preparar versões menores e animações. Não substituir automaticamente a exploradora jogável por Pedro. Não inventar falas atribuídas à pessoa real além de mensagens funcionais de boas-vindas da campanha.

Para integrar: conservar este original, criar derivados com grade de pixels e escala coerente com a exploradora, conferir alpha/contorno em fundos claros e escuros e criar animações de idle/aceno separadas quando necessário. A aprovação da arte e as animações finais permanecem para avaliação do usuário.

## Spritesheet de 14 quadros

- `pedro-spritesheet.png`: folha PNG RGBA de 1659×948 com 14 poses (7 por linha).
- `pedro-atlas.json`: recortes nomeados, com posição lógica normalizada em 256×400 e base dos pés em y=380. A distribuição gerada não é uma grade de passos iguais: usar **load.atlas**, não load.spritesheet com divisão uniforme.
- `pedro-animacoes.json`: 4 quadros parado (3 fps), 6 de aceno (6 fps, uma vez), 4 de conversa/gesto (5 fps). Velocidades iniciais ajustáveis.
- `pedro-preview.html`: prévia animada das três sequências, com botão de pausa e fundos claro/escuro. Execute `npm run dev` e abra `/assets/personagens/pedro-preview.html`.
- `src/game/pedro-animacoes.js`: helper opcional de preload/criação, sem mudanças automáticas no gameplay.

Exemplo na cena Phaser:

```js
import { carregarPedro, criarPedro } from './pedro-animacoes.js';
// preload():
carregarPedro(this);
// create():
this.pedro = criarPedro(this, 500, 240, 0.2);
this.pedro.play('pedro-aceno');
// Durante diálogo:
this.pedro.play('pedro-conversa');
// Ao terminar diálogo:
this.pedro.play('pedro-parado');
```

Estes são quadros gerados, não animação pixel a pixel homologada. A conversa usa expressão/gesto discreto, sem sincronização labial. A folha permanece em resolução alta, com bordas semitransparentes e pequenas variações de proporção que devem ser avaliadas em movimento e em tamanho de jogo. O atlas corrige posicionamento e linha dos pés, não redesenha a anatomia. Nesta entrega foram verificadas estrutura PNG, limites dos recortes, base dos pés e referências de animações; o preview no navegador e a integração na cena ainda não foram homologados. Originais preservados.

## Carina

Coleção separada da dona do showroom em `carina/`:14 quadros de parada, aceno e conversa, folhas de90×180 por célula e helper opcional. Leia `carina/README.md`. As bases dos rostos aprovadas estão em `references/carina`; Pedro e gameplay não foram substituídos.
