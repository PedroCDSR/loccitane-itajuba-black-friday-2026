# Handoff atual — revisão e polimento

Atualizado em17/11/2026. Este documento substitui a direção histórica de HANDOFF-ANTES-DO-POLIMENTO.md, HANDOFF-CLAUDE-HISTORICO.md e HANDOFF-FABLE-5.2.md quando houver conflito. A implementação existe: não reconstruir o jogo a partir das propostas antigas.

## Base e limite da próxima rodada

- Repositório PedroCDSR/loccitane-itajuba-black-friday-2026, branch **dev**. Base de implementação desta entrega:5e5499d. Main tem histórico antigo; não copiá-la sobre dev nem fazer merge automático para produção.
- Ambiente publicado: https://dev--loccitane-itajuba.netlify.app/ . Atualizações da branch dev disparam publicação no Netlify.
- Pedido atual: revisão geral com esforço extra, corrigindo bugs e polindo arestas. Preservar identidade, artes, mapa, personagens, história, mecânica e estrutura. Sem redesenho amplo, migração de framework ou reescrita arquitetural. Ajustes maiores exigem proposta separada.
- Ler AGENTS.md, este handoff e REVISAO-GERAL-OPUS.md antes de editar. Arquivos antigos são referência histórica, não backlog atual.

## Experiência implementada

- Loading Caju0/20/50/70/100 com progresso real de arquivos e nova tentativa em falha; depois pergaminho curto sobre família itajubense em2023 e capítulo final. Sem título grande nem botão de teste no produto. Frase final em negrito e vinho, Jogar como foco, alvo: caber na primeira dobra móvel.
- Cidade completa, sem limite de tempo; exploradora, capivaras não violentas, coleta, showroom em duas telas. Preservar percurso, teclado, multitoque e pausa.
- Pedro na praça com fala afetiva. Mariana em x2650, pouco antes da igreja em x2750; fala menciona showroom uma vez e incentiva seguir. Marcela em x4200, com fala criativa. Não inserir “irmã/noiva do Pedro” nas falas.
- Alturas visíveis: exploradora64, Marcela64, Mariana57, Karina55. Mariana e Marcela possuem poses e fundo recortado. Ferramenta de preparo em ferramentas/preparar_convidadas.py; não reintroduzir preenchimento global de buracos da máscara, que criava manchas brancas nos braços.
- Mariana: prancha aprovada preservada. Marcela: runtime usa uma nova exportação baseada na folha aprovada, porque o arquivo original exibido no chat não ficou disponível; essa diferença está documentada em references/personagens/README.md.
- Karina acolhe na porta. Ao entrar, espera perto da entrada e pede ajuda com caixas nas prateleiras. Depois segue à bancada. A exploradora pega3 caixas, Karina monta kits automaticamente. Cosméticos não são consumidos. Última caixa inicia agradecimento com caixa de diálogo padrão dentro do showroom; último avanço revela prêmio.
- Não existe placa/objetivo de saída nem obrigação de caminhar até saída para concluir. Manter retorno à cidade durante a exploração.
- Final: cupom quadrado como recompensa, breve comemoração, resgate abaixo da imagem em destaque. Desconto explicitamente em toda a loja. Placar detalhado e ações Compartilhe, Instagram, WhatsApp são secundários. Nenhum envio automático de mensagem.

## Pontuação atual

10 pontos por Caju, Romã ou Capim-Limão coletado. Caixas e kits obrigatórios rendem0 pontos.

| Cupom | Regra |
| --- | --- |
| ROMA-W3F ·5% | Concluir, sem atingir as condições superiores |
| CAJU-K8R ·7% |150+ pontos e vida final >=3 |
| BRESIL-N6X ·10% |250+ pontos, vida mínima durante a partida >=4 e os2 cosméticos externos da fachada |

Mínimo de vida é registrado antes de reposicionar a exploradora, evitando contornar a regra por recuperação. Extras externos são os dois cosméticos da fachada além da porta; cada tipo conta uma vez. Regras em src/data/recompensas.js. Auditar passagem das métricas até o final e não alterar critérios silenciosamente.

## Áudio e resgate

- Instrumental enviado pelo usuário, MP3 192kbps,104,64s, em loop, **volume0,8**. Substituiu MIDI sintetizado. Efeitos curtos continuam em Web Audio.
- Música tenta tocar já na abertura; navegador pode exigir primeiro gesto. Não contornar política de autoplay. Pausa, foco e som desligado devem suspender e retomar coerentemente.
- WhatsApp da loja:553598137549, exatamente o número fornecido. Instagram: https://www.instagram.com/loccitane.itajuba/ . Não inventar outro contato.
- Resgate abre conversa com código e link da página do cupom. Open Graph estático nas páginas /recompensas/roma/, /caju/, /bresil/. Usuário confirmou prévia ao colar manualmente; preenchimento via wa.me pode não gerar prévia automaticamente. Não prometer anexo automático.
- Compartilhe usa menu nativo com imagem real do jogo e convite, quando suportado. Instagram pode ou não aparecer como destino no dispositivo. Fallback: WhatsApp por texto e download da imagem. Botão Instagram abre perfil da loja.
- Cupons são fixos; não há antifraude, banco, CRM ou uso único. Validade26/11/26 é ilustrativa nas artes. Condições oficiais ainda pendentes e oferta.ativa permanece false para o fluxo comercial antigo. Fluxo de demonstração dos cupons já funciona em dev; isto não valida campanha para lançamento.

## Reinício — regressão prioritária

Antes, a cena reiniciava no mesmo Phaser.Game e podia mostrar apenas fundo/HUD. Agora cada início após uma partida destrói o motor anterior, aguarda evento destroy e cria motor novo. Não restaurar reaproveitamento da instância sem prova de correção. Bloqueio de início simultâneo em src/main.js. Voltar ao início também restaura interface e música.

Última checagem:63 testes Node e build passaram. Chrome local com página auxiliar fora do produto: primeira partida → conclusão simulada e scene.stop → final → voltar → segunda partida. Screenshot confirmou cenário, exploradora, capivara e diálogo na segunda abertura. Isto não substitui duas partidas completas em celular físico.

## O que falta

Ver REVISAO-GERAL-OPUS.md: jornada completa real, sequência de Karina, três faixas, reinícios repetidos, celulares, áudio, compartilhamento e performance. Registrar navegador, resolução, ações e falhas realmente observadas. Não apresentar mockups como screenshots do jogo. Manter correções na dev, commits pequenos, testes/build e confirmação da publicação.
