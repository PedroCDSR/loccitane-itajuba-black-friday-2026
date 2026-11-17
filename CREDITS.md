# Créditos, origem e permissões

| Material | Origem / licença / observação |
| --- | --- |
| Phaser 4.2.1 | Phaser Studio, MIT, licença na dependência npm |
| Vite 8.3.5 | Evan You e colaboradores, MIT, licença na dependência npm |
| Press Start 2P | CodeMan38, SIL OFL 1.1; texto em public/assets/fonts/OFL-PressStart2P.txt |
| Movimento, renderizador de matrizes, capivara e cidade | Reaproveitados do projeto do usuário PedroCDSR/jogo-aladdin-paula-de-marco, commit 5271c734f39476ecd842e1b013a4a278af356ac5, sob instrução expressa de reutilização nesta conversa. Sem licença geral na raiz original; não se declara licença MIT desses materiais por inferência. Confirmar titularidade antes de redistribuir como biblioteca genérica. |
| Exploradora, presente, frasco, caju, chão, caixa e showroom procedurais | Criados para esta base. Arte provisória original. Sem sprites ou referências Disney transferidos. |
| Efeitos sonoros e música de fundo | Gerados em código por síntese Web Audio própria (`src/services/som.js`), escrita para esta base. Sem ZzFX, sem arquivos de áudio, sem material de terceiros nem do projeto anterior. A melodia de 8 compassos é original. |
| Marca L’Occitane au Brésil | Autorização expressa declarada pelo usuário nesta conversa. Marca usada em texto, sem arquivo de logo oficial fornecido. |
| Fundos e sprites do showroom (`public/assets/showroom/`) | Derivados das artes do repositório (propostas, produtos, Pedro) por `ferramentas/preparar_showroom.py`. |
| Seis fotos do showroom | Enviadas pelo Pedro na conversa; cópias originais em references/showroom (referência, não entram no build). Três são capturas com atribuição Google Street View, preservada no arquivo. Uso comercial depende da autorização da marca. |

Não há assets do pacote 14collective, personagens Disney, músicas, fotos de pessoas ou logos G9 neste repositório. O histórico Git do outro projeto não foi copiado. Nenhuma licença global de código aberto foi atribuída ao conjunto de marca/arte/código por conta própria.

## Novas artes de produtos

`public/assets/produtos/caju-sabonete-pixel-art.png` e `roma-chantilly-pixel-art.png`: conversões estilizadas por geração de imagem, guiadas por fotos oficiais da marca. Fontes, aprovação e limitações técnicas no README da pasta. Caju aprovado pelo usuário; Romã em avaliação. Não são sprites nativos nem estão integrados ao gameplay.

## Pedro — personagem do showroom

`public/assets/personagens/pedro-pixel-art.png`: arte em pixel art gerada a pedido do usuário com base na fotografia de Pedro, funcionário da loja, enviada na conversa. Uma pose com fundo transparente, sem integração ou animação automática. Foto original não incluída neste commit. Orientações em `public/assets/personagens/README.md` e handoff para Fable.

Spritesheet de Pedro: 14 poses geradas a partir da arte-base, com atlas de recortes e parâmetros de animação. Mesma origem visual da pose original. Alinhamento por metadados, sem importação de assets de terceiros. Ainda requer revisão de continuidade no gameplay.

## Pacotes de sprites e cidade ao entardecer

Artes geradas com a ferramenta de imagens e referências visuais do showroom, exploradora e fotos dos marcos de Itajubá já presentes no projeto-base. Exportação técnica por recorte, nearest-neighbor, alfa binário, centralização e repetição por espelhamento. Fontes em references/gerados-pacote; medidas exatas em public/assets/sprites-nativos e public/assets/cidade-entardecer. Identificação Esso adicionada por pedido posterior do usuário. Pedro preservado. Não se afirma homologação de animações ou fidelidade arquitetônica/lettering perfeita.

Runtime integrado: versões WebP dos assets novos, sprites sem redução de cores e cidade quantizada para128 cores sem dithering antes da codificação lossless. Os PNGs entregues permanecem intactos. Física/estrutura reaproveitadas; modo fácil conserva os cinco corações do ajuste do projeto-base, sem copiar seu mapa curto ou dados do espetáculo.

## Carina — dona do showroom

Coleção em `public/assets/personagens/carina/`, com fontes e dois rostos aprovados em `references/carina/`. Arte gerada a partir da direção aprovada pelo usuário (duas opções de rosto da coluna esquerda), usando as fotografias enviadas somente como referência de aparência e roupa; fotos pessoais não publicadas.14 quadros, normalização técnica nearest-neighbor e alfa binário. Helper opcional, sem alteração automática da cena. A coleção final ainda requer avaliação de semelhança/continuidade.
