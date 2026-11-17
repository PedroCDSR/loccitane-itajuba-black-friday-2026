# A Última Aventura — instruções para agentes

Leia README.md, docs/DIRECAO-CRIATIVA.md, docs/HANDOFF-FABLE-5.2.md e references/showroom/README.md antes de alterar.

- Este é um repositório novo e independente. Nunca importar o histórico ou o elenco do projeto anterior.
- Usuário informou autorização expressa para a marca L’Occitane. Não inventar manual oficial, telefone ou condições comerciais.
- Preservar a identidade de Itajubá: Mantiqueira, praça, fonte, Clube Itajubense, Café do Vadinho e Igreja Matriz.
- Trocar completamente o antigo espaço de dança pelo showroom: pedras, toldo vermelho, jardim, madeira clara, frascos e presentes.
- Não reintroduzir personagens Disney, dança, sapatilhas, bilhetes de espetáculo, logos G9 ou pessoas da escola.
- Arte atual é provisória. Meta final: pixel art de plataforma 16 bits, animação fluida e parallax detalhado, com design original.
- Caju arremessado alimenta a capivara; não há morte nem violência gráfica. Romã é opção futura de skin.
- Preservar teclado, multitoque, pausa ao perder foco e reinício. Decisão mais recente: SEM limite de tempo; remover cronômetro/timeout na próxima implementação, inclusive textos e testes antigos.
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
