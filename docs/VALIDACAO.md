# Validação desta base

## Executado

- Instalação de dependências com lockfile próprio e versões diretas fixadas.
- `npm test`: sete testes passaram, cobrindo teto de desconto, bloqueio por configuração incompleta, dados necessários ao resgate, codificação da mensagem, marketing opcional, limpeza de URL compartilhada, assinaturas PNG e viabilidade geométrica do percurso.
- `npm run build`: passou em Node 24.22.1. Bundle JS ~1,39 MB, ~365 KB gzip. Build estático completo ~1,50 MB, incluindo cidade e fonte.
- `node --check` nos módulos: passou.
- Busca no código/runtime por referências do espetáculo, personagens Disney, sapatilhas, telefone anterior e GoatCounter: sem resultados.
- Somente doze PNGs de cidade/natureza selecionados e a capivara original foram reaproveitados; os assets do elenco não foram copiados.
- Original sem alterações, histórico novo independente.

## Não executado — pendências explícitas

O ambiente gerenciado não disponibilizou `cua_repl.js` nem ferramenta de navegador controlável. Não foi iniciado servidor alternativo nem instalação de navegador. Portanto **console, renderização, carregamento em navegador, inputs touch/teclado e partida completa não estão homologados**. Testes de assinatura de arquivo não equivalem a teste de carregamento no navegador. Conta distância/velocidade não equivale a medição com jogadores.

## Checklist para a próxima execução

1. `npm ci`, `npm test`, `npm run build`, depois abrir o jogo com o servidor apropriado.
2. Conferir título, início, coleta, cenário, showroom, timeout de 75 s, chegada antecipada, final e reinício. Ausência de 404 e erros no console.
3. Teclado: setas e A/D, espaço/W/cima com pulo curto/longo e X/J para caju. Não prender personagem nas caixas.
4. Android Chrome e iPhone Safari: testar dois/três dedos, pointercancel, giro, retrato/paisagem e barras do navegador. Verificar leitura e áreas de toque.
5. Trocar de aba/aplicativo: timer e física pausam; voltar apenas pelo botão Continuar. Testar Escape, botão de pausa e áudio liberado por gesto.
6. Concluir e recomeçar duas vezes: sem duplicar listeners, presentes zerados, capivaras e controles reiniciados.
7. Estado entregue: resgate bloqueado, sem formulário utilizável para coleta; compartilhamento funciona independentemente da oferta.
8. Configurar oferta em ambiente de teste: validar no máximo 10%, destino e mensagem corretos, checkbox de marketing opcional/desmarcado. Não enviar mensagens reais sem ação do visitante.
9. Escutar `window.addEventListener('campanha:metrica', e => console.log(e.detail))`: início, conclusão e cliques sem dados pessoais. Não confundir encaminhamento com mensagem enviada.
10. Adicionar as seis fotos originais, revisar fidelidade do showroom e produzir capturas para o Fable 5.2.

Não há deploy ou teste de integração com CRM, WhatsApp comercial ou analytics externo nesta base.
