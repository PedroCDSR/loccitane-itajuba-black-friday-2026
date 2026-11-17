# A Última Aventura — Black Friday L’Occitane Itajubá 2026

Base independente de um jogo promocional de plataforma 2D, mobile-first, com Phaser 4.2.1 e Vite 8.3.5. Desenvolvida para continuação com Fable 5.2. **Não é a versão final de campanha nem está publicada.**

## Atualização: missão de Caju e Romã

O jogo agora inclui intro em três etapas, coleta dos produtos Caju/Romã pela cidade, modo fácil com cinco corações e montagem de três kits no showroom. Cidade, sprites e objetos novos integrados; posições dos marcos e extensão do percurso preservadas. **Não há limite de tempo** (pedido do Pedro, 17/11/2026): dá para passear pela cidade e pelo showroom, ir e voltar pela bandeira, e a partida termina ao sair do showroom com os três kits. Pedro possui interação por E/Enter ou toque. A invencibilidade e os avisos usam um relógio de jogo ativo interno, que não aparece no HUD.

Veja `docs/EVOLUCAO-MISSAO.md` e `docs/HANDOFF-CLAUDE.md` para a rodada atual. O teste em navegador desta versão está em `docs/QA-NAVEGADOR.md`. Ajustes de 17/11 (transição, tendas, abertura e showroom): `docs/RODADA-AJUSTES.md`. Build/testes Node passaram; esta rodada ainda precisa de teste completo em navegador. As capturas anteriores documentam a versão anterior. Assets originais e ZIPs preservados; versões de carregamento em WebP com manifesto em `docs/pacotes/runtime.json`.

## Executar

Node 22.12+ (ou Node 24). Use `npm ci`, `npm run dev` e abra o endereço informado pelo Vite. No celular na mesma rede, use o endereço Network. `npm test` executa verificações de oferta/privacidade e integridade dos assets. `npm run build` gera `dist/`; `npm run preview` permite conferir o build.

## O que já existe

- Percurso único por Itajubá com câmera e parallax e cena jogável do showroom (jardim, fachada, Pedro na porta, interior com mesa e produtos Caju e Romã). Ver `docs/SHOWROOM-JOGAVEL.md`.
- Exploradora original provisória; controles touch e teclado: setas/A/D, espaço/W/cima, X/J para caju.
- Pulo variável, aceleração, tolerância na borda, antecipação do pulo e recuperação após colisões.
- Presentes, frascos, capivaras alimentadas com caju e contador. Sem limite de tempo; o final mostra quanto durou o passeio.
- Telas inicial/final, pausa, áudio sintético original opcional e reinício.
- Compartilhamento direto pelo WhatsApp. Formulário de primeiro nome e consentimento para preparar mensagem de resgate.
- Eventos locais `campanha:metrica`: inicio, conclusao, clique_oferta, clique_compartilhar, encaminhamento_whatsapp. Sem provedor externo e sem dados pessoais.

## Configuração comercial

Edite `src/data/campanha.js`. O usuário autorizou desconto de **no máximo 10%**. A base propõe 10%, mas entrega `ativa: false`: configure WhatsApp, validade, condições, responsável, contato e retenção antes de ativar. Não foi presumido telefone do Instagram nem do projeto anterior.

O formulário permanece desativado enquanto a configuração estiver incompleta. Após ativado, os dados ficam apenas em memória e seguem na mensagem do WhatsApp, enviada pelo próprio visitante. Não existe banco de leads, CRM, comprovação de compra, cupom de uso único ou antifraude. Marketing é opcional. Para captura persistente, implementar servidor conforme docs/CONVERSAO.md.

## Onde alterar

| Área | Arquivo |
| --- | --- |
| Campanha, desconto, contato, condições | `src/data/campanha.js` |
| Física e tela | `src/game/config.js` |
| Mundo, colisões, showroom e coleta | `src/game/Aventura.js` |
| Texturas provisórias e animações | `src/game/arte.js` |
| Movimento reaproveitado | `src/game/Jogador.js` |
| Teclado e multitoque | `src/game/Entrada.js` |
| Funil, telas e formulário | `src/main.js`, `index.html`, `src/style.css` |
| Regras do resgate | `src/services/oferta.js` |
| Direção visual e referências | `docs/DIRECAO-CRIATIVA.md`, `references/showroom/` |
| Continuação no Fable 5.2 | `docs/HANDOFF-FABLE-5.2.md` |

## Publicação

Site estático. Importe este repositório no Netlify: build `npm run build`, saída `dist/`, Node 22. `netlify.toml` já preparado. Também pode publicar `dist/` em hospedagem estática com HTTPS. Nada foi publicado automaticamente. Antes de lançar, preencher oferta/privacidade e executar o checklist de docs/VALIDACAO.md.

## Limitações

Arte nova provisória; preservar a técnica e substituir pelo acabamento 16 bits final. Não há logo vetorial oficial: marca em texto. As seis fotos do showroom estão em `references/showroom/` (referência, sem uso direto no build). Falta revisar o showroom com elas. Navegador e aparelhos reais ainda precisam ser homologados.

Leia CREDITS.md para origem de código/arte e licenças; docs/AUDITORIA.md para o recorte da migração.
