# Prompt para Fable 5.2 — cena jogável do showroom com Pedro

Copie o texto abaixo para continuar o projeto.

---

Trabalhe no repositório https://github.com/PedroCDSR/loccitane-itajuba-black-friday-2026 . Atualize o checkout preservando alterações existentes. Sua missão é implementar UMA CENA JOGÁVEL dentro do showroom L’Occitane Itajubá, aproveitando ao máximo as artes e a base Phaser 4 + Vite existentes. Não entregue só uma imagem, mockup ou plano.

## Leia e examine

Leia AGENTS.md, README.md, docs/DIRECAO-CRIATIVA.md, docs/SMOKE-TEST.md, docs/REVISAO-QUALIDADE.md, references/propostas/README.md e os READMEs de produtos/personagens. Abra os arquivos reais das imagens, não apenas nomes e descrições.

Assets disponíveis:
- `references/propostas/showroom-pixel-art-moderno.png`: conceito de fachada/interior com jardim.
- `references/propostas/showroom-interior-exploradora-andando.png`: referência principal de composição do interior, luz e exploradora.
- `public/assets/produtos/caju-sabonete-pixel-art.png`: produto Caju, direção visual aprovada pelo usuário.
- `public/assets/produtos/roma-chantilly-pixel-art.png`: produto Romã, primeira versão para avaliação.
- `public/assets/personagens/pedro-pixel-art.png`: Pedro, funcionário real da loja, representado em pixel art a partir de foto enviada pelo usuário.
- As seis fotos reais em `references/showroom/`, com manifesto e hashes.

Não presumir outros assets publicados. A arte externa fechada foi gerada na conversa, mas não consta nesta lista: confira a árvore do repositório antes de referenciá-la.

## Pedro dentro da cena

Use Pedro como NPC que recebe a exploradora no showroom. Preserve cabelo curto escuro, barba, camiseta preta, avental vermelho da marca, tênis claros e gesto acolhedor. A exploradora continua jogável; Pedro não a substitui automaticamente.

Posicione Pedro perto da entrada ou atendimento, sem bloquear a circulação. Ao chegar perto, ofereça interação clara por toque e tecla E/Enter. Exemplo de mensagem funcional proposta: “Bem-vinda ao showroom! Vamos encontrar seu próximo presente?”. Use diálogo curto e que possa ser dispensado. Impeça que a tecla/toque de fechar o diálogo cause um salto involuntário.

O PNG de Pedro tem uma única pose em 887×1774, com transparência: não é spritesheet animada. Prepare um derivado na escala do jogo. Pode começar com a pose estática bem integrada; animações de idle/aceno só devem ser apresentadas como prontas quando realmente existirem. Não esticar a imagem para simular caminhada. Preserve o original e documente o que foi criado.

Pedro não confirma desconto, estoque, validade ou resgate por fala inventada. Não encaminhe dados pessoais ao NPC ou às métricas.

## Reaproveitamento visual

Priorize reutilizar arquivos existentes; depois recortar/separar camadas quando houver qualidade; adaptar escala/transparência; criar somente partes ausentes. As propostas do showroom são imagens achatadas, não tilemaps. É possível aproveitá-las como fundo ou reconstruí-las em camadas com alterações mínimas.

A imagem do interior já contém uma exploradora: remova/reconstrua essa região ou use outra composição para não duplicar personagem desenhada e jogável. Evite emendas aparentes e elementos cortados. Pedro também deve aparecer uma única vez na cena.

Mantenha estantes de madeira clara, parede de madeira, produtos variados, sacolas vermelhas, kits, piso terracota, cestos, plantas e quadros botânicos, com iluminação quente e profundidade. Caju e Romã devem preservar embalagens reais, não virar garrafas genéricas.

Produtos também são artes-base em alta resolução, não sprites nativos. Crie versões derivadas adequadas à grade e tamanho de exibição, com legibilidade de silhueta e cores; não depender de letras minúsculas. Verifique alpha, contornos e escala em contexto. Nearest-neighbor quando apropriado. Preserve os originais.

## Gameplay

- Resolver antes as falhas de bloqueio registradas no smoke test.
- Integrar entrada no showroom ao percurso por Itajubá e saída à tela final existente.
- Reutilizar movimento, pulo, câmera, controles touch/teclado, pausa, contador e coleta.
- Espalhar presentes e produtos em locais alcançáveis; poucas plataformas coerentes, percurso principal legível.
- Separar imagens e colisões: fundo desenhado não cria física automaticamente.
- Preservar a experiência total de 60–90 segundos, ajustando o percurso para incluir o showroom.
- Destacar personagens do cenário com contraste, escala e profundidade consistentes.

## Limites

Não reescrever o projeto nem adicionar dependências sem necessidade. Não copiar personagens ou assets de Magical Delicacy: a inspiração é de atmosfera. Não reintroduzir Disney, dança ou contatos do espetáculo anterior. Usuário declarou autorização expressa para marca L’Occitane.

Preserve teto absoluto de 10% e configuração em src/data/campanha.js. Não inventar telefone, validade ou condições nem ativar resgate incompleto. O formulário atual prepara mensagem revisável no WhatsApp; não é CRM ou cadastro persistente. Não criar cupons únicos sem validação de servidor. Não publicar site nesta etapa.

## Valide e entregue

Execute npm ci se necessário, npm test e npm run build. Quando houver navegador, teste entrada, percurso inteiro, Pedro/interação/fechar diálogo, coleta, colisões, saltos, saída, reinício, touch e teclado, perda de foco, console e assets sem 404. Registre o que realmente foi testado; não presuma homologação de Android/iPhone pela emulação.

Salve no repositório uma captura REAL da cena implementada, não a proposta original apresentada como screenshot. Documente em docs/ o que foi reutilizado, adaptado/criado, acesso à cena e limitações.

Faça commit e push sem sobrescrever alterações existentes. Retorne link do commit, link da captura real e instruções curtas de teste. Conduza decisões rotineiras com autonomia até a cena funcionar, sem parar só em plano.
