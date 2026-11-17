# Pacote de sprites nas dimensões solicitadas

Pedro foi preservado: este pacote contém somente exploradora, capivara e objetos.

| PNG | Quadro | Quadros | Folha |
| --- | --- | --- | --- |
| exploradora-parada.png | 144×192 | 4 | 576×192 |
| exploradora-corrida.png | 144×192 | 8 | 1152×192 |
| exploradora-salto.png | 144×192 | 6 | 864×192 |
| exploradora-fruta.png | 144×192 | 3 | 432×192 |
| exploradora-susto.png | 144×192 | 1 | 144×192 |
| capivara-andando.png | 96×72 | 4 | 384×72 |
| capivara-comendo.png | 96×72 | 4 | 384×72 |
| kit-presente.png | 60×72 | 1 | 60×72 |
| sacola-vermelha.png | 60×72 | 1 | 60×72 |
| caixa-presente.png | 60×60 | 1 | 60×60 |
| caju-fruta.png | 48×54 | 1 | 48×54 |
| cesto-palha.png | 96×96 | 1 | 96×96 |

PNG RGBA, alfa binário 0/255 (sem suavização de borda), sem margem ou espaçamento entre células. Cada célula tem pixels opacos na última linha. Reamostragem técnica nearest-neighbor e centralização inferior. Não usar filtros LINEAR. Manifesto contém dimensões, número de quadros e SHA-256. Folha de salto: índices 0–1 subida, 2–3 queda, 4–5 aterrissagem. Susto seleciona a pose final inclinada para trás. Objetos são arquivos próprios, não a folha-fonte.

## Uso

`load.spritesheet('exploradora-corrida', 'assets/sprites-nativos/exploradora-corrida.png', { frameWidth: 144, frameHeight: 192 })`. Usar origem `.5,1` e escala inicial `1/3` para o mundo atual; revisar o corpo físico separado da textura. Não mudar automaticamente a física ao integrar.

Arte criada com geração de imagem guiada pelo showroom. As fontes estão em references/gerados-pacote/sprites. A normalização corrige medidas, alfa e linha de base; não garante cabeça matematicamente idêntica, anatomia contínua ou ciclo perfeito entre imagens geradas. Persistem pequenas variações de desenho entre poses, a revisar em movimento. Não houve homologação de animação ou integração automática no gameplay nesta entrega. A capivara mantém patas curtas, olha à direita e come caju sentada. Não há texto nos arquivos PNG individuais.
