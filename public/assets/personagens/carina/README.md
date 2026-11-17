# Carina — coleção de sprites

Carina é a dona do showroom e a principal pessoa no atendimento, conforme informado pelo usuário. A direção do rosto foi aprovada nas duas opções da coluna esquerda; a superior esquerda é a base principal e a inferior esquerda orienta pequenas variações de ângulo. Referências aprovadas preservadas em `references/carina/`. As fotos pessoais originais não foram adicionadas.

Roupa: blusa preta com gola e botões claros, calça preta ampla, óculos escuros de armação e cabelo castanho ondulado. Sem avental. Calçado escuro discreto é detalhe provisório porque não aparece claramente nas fotos.

| PNG | Célula | Quadros | Dimensão total |
| --- | --- | --- | --- |
| carina-parada.png | 90×180 | 4 | 360×180 |
| carina-aceno.png | 90×180 | 6 | 540×180 |
| carina-conversa.png | 90×180 | 4 | 360×180 |
| carina-spritesheet.png | 90×180 | 14 | 1260×180 |

PNG RGBA, alfa binário0/255, pixels nítidos, uma única linha, sem espaçamento entre células. Pés na última linha de pixels. Recortes técnicos e redução nearest-neighbor, alinhamento pela cabeça, origem recomendada(.5,1). As três folhas separadas usam índices0 a3/5/3; a conjunta usa0–3 parada,4–9 aceno,10–13 conversa.

`carina-animacoes.json` registra dimensões, quadros, hashes e velocidades propostas: parada4fps, aceno6fps uma vez, conversa5fps. Ajustar após conferir no jogo. `carina-preview.html` permite ver as sequências: execute `npm run dev` e abra `/assets/personagens/carina/carina-preview.html`.

## Phaser

Helper opcional em `src/game/carina-animacoes.js`:

```js
import { carregarCarina, criarCarina } from './carina-animacoes.js';
// preload
carregarCarina(this);
// create
this.carina = criarCarina(this, x, y);
this.carina.play('carina-aceno'); // retorna a parada ao completar
this.carina.play('carina-conversa');
this.carina.play('carina-parada');
```

A coleção não substitui Pedro, a exploradora ou a cena automaticamente. Nome e papel registrados conforme o usuário; não inventar falas pessoais, contatos ou condições comerciais atribuídas à Carina.

## Limites e validação

Os rostos-base foram aprovados; a coleção de poses é nova e ainda precisa da avaliação do usuário. Imagens-fonte em alta resolução preservadas para refinamento de semelhança. Quadros gerados podem ter pequenas variações de anatomia e proporções entre poses; o empacotamento não torna a identidade pixel a pixel idêntica. A conversa representa boca/gestos, não sincronização labial. Não houve homologação de animação em navegador ou aparelhos reais nesta entrega.

Verificados: dimensões,14 quadros, canal alfa binário, pés na base, referências/hashes e helper. ZIP em `docs/pacotes/carina-sprites.zip`.
