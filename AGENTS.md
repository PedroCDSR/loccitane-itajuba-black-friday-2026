# A Última Aventura — instruções para agentes

Leia README.md, docs/DIRECAO-CRIATIVA.md, docs/HANDOFF-FABLE-5.2.md e references/showroom/README.md antes de alterar.

- Este é um repositório novo e independente. Nunca importar o histórico ou o elenco do projeto anterior.
- Usuário informou autorização expressa para a marca L’Occitane. Não inventar manual oficial, telefone ou condições comerciais.
- Preservar a identidade de Itajubá: Mantiqueira, praça, fonte, Clube Itajubense, Café do Vadinho e Igreja Matriz.
- Trocar completamente o antigo espaço de dança pelo showroom: pedras, toldo vermelho, jardim, madeira clara, frascos e presentes.
- Não reintroduzir personagens Disney, dança, sapatilhas, bilhetes de espetáculo, logos G9 ou pessoas da escola.
- Arte atual é provisória. Meta final: pixel art de plataforma 16 bits, animação fluida e parallax detalhado, com design original.
- Caju arremessado alimenta a capivara; não há morte nem violência gráfica. Romã é opção futura de skin.
- Preservar teclado, multitoque, pausa ao perder foco e reinício. **Sem limite de tempo** (pedido do Pedro, 17/11/2026, substitui a regra antiga dos 75 segundos): a partida só termina saindo do showroom com os três kits; nada de contagem regressiva nem urgência artificial. A pessoa pode ir e voltar entre cidade e showroom sem perder a missão.
- Máximo absoluto de desconto: 10%. Configuração comercial em src/data/campanha.js. Nunca usar dados do outro negócio.
- Sem cupons de uso único no cliente. Sem alegar validação antifraude ou cadastro persistente inexistente.
- Leads na base seguem via mensagem revisável no WhatsApp. Não armazenar PII no navegador nem enviar PII nas métricas. Marketing opcional e desmarcado.
- As seis fotos estão em references/showroom/ (status present no manifest.json, com SHA-256). Não as use como fundo do jogo nem as coloque em public/.
- O repositório é público: não commitar leads, segredos ou credenciais. .env* está ignorado.
- Antes de entregar: npm test e npm run build; registrar quais testes de navegador realmente foram feitos. Não dizer que arte ou mobile estão homologados sem conferir.
- Usuário pretende continuar com Fable 5.2. Manter módulos simples e evitar refatoração sem necessidade.
- Pedro, funcionário da loja: arte-base em `public/assets/personagens/pedro-pixel-art.png`. Papel proposto de NPC acolhedor do showroom; não substituir a exploradora. Leia o README da pasta e o handoff atualizado para integração e limitações da pose única.

- Direção atual aprovada: manter cidade em SHOWROOM.x=5216, mundo5856, SEM limite de tempo (pedido atualizado). Modo fácil tem5 corações, sem encurtar percurso. Intro explica missão fictícia de reunir Caju/Romã para três kits no showroom. Leia docs/EVOLUCAO-MISSAO.md e docs/HANDOFF-CLAUDE.md antes de retomar.

- Direção visual aprovada e handoff atual em docs/HANDOFF-CLAUDE.md: creme/vinho, HUD sobre o céu, corações individuais, contadores somente após coleta com sprites PEQUENOS originais e alturas visuais iguais; Avançar acima de Caju/Pular. Não implementar a prancha antiga rejeitada. Conferir dev e site publicado antes de editar; esta rodada adicionou propostas/documentação, sem implementar essas mudanças no runtime.

## Estado atual e revisão de polimento (precedência sobre histórico)

Ler docs/HANDOFF-CLAUDE.md e docs/REVISAO-GERAL-OPUS.md antes da próxima rodada. Implementação atual já está na dev e publicada. Pedido do usuário: polir arestas e corrigir bugs, sem recriar partes importantes. Karina recebe na porta, pede caixas dentro e agradece após a última caixa; não exigir receita de cosméticos nem saída para concluir. Preservar pontuação e restrições de vida/extras em src/data/recompensas.js. Trilha instrumental0,8. Reinício destrói e recria o Phaser.Game; não restaurar reaproveitamento quebrado. Documentos de propostas e relatos de75s são históricos. Não sobrescrever dev com main. Revisão/publicação na dev; promoção à main depende de instrução do usuário.
