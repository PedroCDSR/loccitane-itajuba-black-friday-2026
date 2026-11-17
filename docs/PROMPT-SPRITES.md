# Prompt para gerar as spritesheets que faltam

Anexe ao pedido: `references/propostas/showroom-interior-exploradora-andando.png` (referência da exploradora e do estilo), `public/assets/personagens/pedro-pixel-art.png` e `docs/capturas/showroom-interior.png`. Peça uma folha por vez.

---

Crie spritesheets de pixel art para um jogo de plataforma 2D de vista lateral, no mesmo estilo, paleta e iluminação quente da imagem de referência anexada (interior de loja com estantes de madeira). Regras para TODAS as folhas:

- PNG com fundo 100% transparente (canal alfa real, sem fundo xadrez, branco ou colorido).
- Pixel art com pixels nítidos: sem suavização, sem desfoque, sem brilho externo, sem sombra projetada no chão.
- Quadros de tamanho idêntico, lado a lado em uma única linha horizontal, sem margem nem espaço entre eles, sem grade, sem números e sem texto.
- A personagem olha para a direita. Mesma escala, mesmas cores e mesma posição da cabeça em todos os quadros. Os pés tocam sempre a mesma linha de base, na última linha de pixels do quadro, e o corpo fica centralizado na horizontal.
- Contorno escuro colorido (marrom), não preto puro. Luz vinda de cima e da frente.
- Personagens originais: não copiar personagens de outros jogos, filmes ou marcas.

FOLHA 1, exploradora (quadro de 144×192 px). Mulher adulta igual à da referência: chapéu de palha com fita vermelha, cabelo castanho-escuro cacheado até o ombro, jaqueta verde-oliva com bordado amarelo, blusa creme, calça creme larga até a canela, botas marrons de cadarço, bolsa vermelha a tiracolo. Uma folha por animação:
a) parada, respirando: 4 quadros (576×192);
b) corrida em ciclo fechado: 8 quadros (1152×192);
c) pulo subindo: 2 quadros; queda: 2 quadros; aterrissagem agachando: 2 quadros (6 quadros, 864×192);
d) oferecendo uma fruta com o braço direito estendido para a frente: 3 quadros (432×192);
e) levando um susto, inclinada para trás: 1 quadro (144×192).

FOLHA 2, Pedro (quadro de 90×180 px), exatamente como no arquivo anexado: homem de cabelo escuro curto, barba, camiseta preta, avental vermelho, tênis claros, de frente levemente virado para a esquerda.
a) parado, respirando: 4 quadros (360×180);
b) acenando com a mão direita: 4 quadros (360×180).

FOLHA 3, capivara (quadro de 96×72 px), fofa e simpática, vista de lado, olhando para a direita.
a) andando: 4 quadros (384×72);
b) sentada comendo um caju: 4 quadros (384×72).

FOLHA 4, objetos, um quadro cada, cada um em arquivo próprio:
- kit de presente vermelho com janela transparente mostrando frascos (60×72);
- sacola de papel vermelha com alça (60×72);
- caixa de presente estampada com laço vermelho (60×60);
- caju, a fruta: pseudofruto laranja-avermelhado com a castanha (48×54);
- cesto de palha trançada, visto de frente, com topo plano (96×96).

Entregue cada folha como um PNG separado, nas dimensões exatas indicadas.

---

Ao receber os arquivos, salve em `public/assets/sprites/` e confira: dimensões exatas, alfa real e pés na mesma linha em todos os quadros. Geradores de imagem costumam errar o tamanho e o alinhamento dos quadros; se errarem, é preciso recortar e alinhar antes de usar.
