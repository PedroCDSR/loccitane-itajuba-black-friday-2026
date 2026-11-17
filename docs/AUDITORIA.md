# Auditoria e migração

Base inspecionada: https://github.com/PedroCDSR/jogo-aladdin-paula-de-marco — commit `5271c734f39476ecd842e1b013a4a278af356ac5` da main. Original preservado, sem commits, pushes ou alterações. Novo repositório vazio clonado sem histórico do anterior.

- Stack: JavaScript ES modules, Phaser 4.2.1/Arcade Physics, Vite 8.3.5, Node 22. Não há backend.
- Estrutura anterior: scenes, objects, ui, levels, art, audio e data; quatro fases, mapas em texto, interfaces em canvas/HTML.
- Reaproveitado diretamente: classe de movimento Jogador (renomeada a mecânica de fruta), renderizador de matrizes, somente a arte original da capivara, fonte Press Start 2P com OFL e 12 PNGs de cidade/natureza locais.
- Adaptado conceitualmente: câmera com folga à frente, parallax, coletáveis, colisões, pausa por foco, configuração central e controles unificados.
- Novo: fase única, exploradora, presentes, frasco, caju, showroom, menus, formulário WhatsApp e eventos locais. Sem refatorar a base inteira nem copiar dependências de cenas antigas.
- Excluído: elenco Aladdin/Abu/Jasmine/Gênio/Sultão/Jafar, chefe, tapete, screenshots Disney, referências de figurino, pessoas da escola, logo G9, músicas, sapatilhas, ingressos e metadados do espetáculo.
- Música original `tema.m4a`: documentação anterior diz própria/autorizada, mas não comprova extensão à campanha; não transferida.
- Imagem de divulgação 14collective: pacote não comprado segundo suas notas; não transferida. Capivara vem da matriz original do código, não dessa imagem.
- Licenças: Phaser/Vite MIT; Press Start 2P OFL preservada. Não havia licença geral do código próprio; origem registrada em CREDITS.md, sem atribuir MIT ao conjunto por conta própria.
- Contatos/integrações: WhatsApp e Instagram da escola e GoatCounter configurado para outro projeto removidos.
- Segredos: busca textual por padrões comuns no estado auditado não encontrou candidatos. Não é auditoria de todo o histórico Git.

Na cópia isolada do original, npm ci e build passaram em Node 24; npm audit retornou zero vulnerabilidades naquele momento. Build anterior gerou bundle de cerca de 1,59 MB e aviso de tamanho. Não havia npm test; havia um robô Playwright não executado. Não se presume sua homologação para o novo jogo.

Arquivos finais e regras do novo projeto estão documentados no README. Histórico novo, com primeiro commit próprio. Não transferir permissões ou automações específicas do CLAUDE.md anterior.
