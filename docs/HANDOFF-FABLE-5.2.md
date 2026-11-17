# Continuação com Fable 5.2

## Prompt pronto

Você está no repositório `PedroCDSR/loccitane-itajuba-black-friday-2026`, um jogo próprio de plataforma com Phaser 4 e Vite. Leia AGENTS.md, README.md e docs/DIRECAO-CRIATIVA.md. O usuário autorizou a marca L’Occitane. Melhore esta base sem importar o histórico ou personagens Disney e sem reintroduzir dança.

Priorize acabamento visual e diversão: cidade de Itajubá reconhecível, exploradora original com animação fluida, kits/frascos/sacolas coletáveis, caju para alimentar capivaras, fachada de pedra e toldo vermelho com jardim, interior com estantes de madeira clara. Preserve controles touch/teclado e partida de 60–90 segundos. Use as seis fotos em references/showroom/ (manifest.json, status present).

A arte atual é provisória, com sprites procedurais em src/game/arte.js. Troque por spritesheets de alta qualidade mantendo nomes de texturas, tamanhos de quadros e hitboxes, ou ajuste o carregador de forma mínima. Cidade reaproveitada está em public/assets/cidade. O desenho da fachada/interior fica em Aventura.js/arte.js; leve a um módulo próprio somente se ajudar a substituição por assets finais. Não invente manual de marca ou logo vetorial.

Mantenha o teto absoluto de 10%. Campanha e WhatsApp em src/data/campanha.js. Não ativar oferta sem validade, condições, contato e informações de privacidade reais. Não existe backend de leads: base encaminha primeiro nome e consentimento por mensagem revisável no WhatsApp. Se implementar CRM, faça integração real de servidor, com dados protegidos e confirmação real de sucesso. Nunca registrar dados pessoais em métricas.

Execute npm ci, npm test e npm run build. Homologue console, carregamento de assets, mobile e desktop em navegador. Registre capturas comparativas do cenário e showroom, teste uma partida inteira e diferencie testes reais de revisão estática. Documente o que permanece provisório. Não publicar campanha comercial incompleta.

## Prioridades

1. Adicionar as seis fotos originais ao catálogo, atualizar hashes e conferir detalhes arquitetônicos.
2. Substituir arte procedural por pixel art detalhada, com sombras, volumes, plantas, produtos e animações autorais.
3. Melhorar layout da fase e distribuição de presentes; medir tempo com jogadores sem depender só da conta distância/velocidade.
4. Homologar Android/Chrome e iPhone/Safari, especialmente multitoque, safe areas, áudio e perda de foco.
5. Receber dados comerciais e concluir conversão, analytics e eventual captura persistente.

## Conhecido

Não há navegador controlável fornecido para QA nesta execução. A build não confirma renderização nem jogabilidade. Testes Node cobrem limites comerciais e assets, não uma partida real. Não apresentar a base como arte final, campanha pronta ou CRM funcional.
