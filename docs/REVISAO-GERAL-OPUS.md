# Revisão geral — Claude Opus5.5, esforço extra

## Instrução para colar

Revise e faça o polimento do jogo existente no repositório PedroCDSR/loccitane-itajuba-black-friday-2026, branch dev. Use esforço extra. Leia primeiro AGENTS.md e docs/HANDOFF-CLAUDE.md, que é o estado atual e substitui os handoffs antigos. Confira https://dev--loccitane-itajuba.netlify.app/ e o código real antes de propor mudanças.

Quero preservar o projeto aprovado: não recrie cenários, sprites, personagens, história, mapa, interface ou arquitetura. Investigue e reproduza os problemas; faça apenas correções pontuais de bugs, legibilidade, fluidez, alinhamento, áudio e desempenho. Não mude as regras de recompensa sem me informar. Não implemente features novas ou refatorações grandes por iniciativa própria.

Execute a jornada completa em desktop e celular, da abertura ao resgate. Priorize: três conversas da Karina no lugar certo; conclusão após caixas sem saída; cupons de5/7/10% obedecendo vida e produtos externos; reinício repetido sem cenário vazio; toque e teclado; pausa/foco; trilha0,8; compartilhamento e links finais. Confirme assets e console sem erros, tamanhos dos personagens e ausência de manchas no recorte.

Antes de corrigir, identifique os achados com gravidade e evidências. Pode corrigir diretamente problemas pequenos e claros dentro desse escopo; apresente propostas maiores separadamente. Rode npm test e npm run build, registre o que realmente testou e os limites, faça commits na dev e confirme a atualização no Netlify. Preserve a main. Entregue uma lista curta do que corrigiu, riscos pendentes e decisões que dependem de mim.

## Prioridades e evidências esperadas

1. **Jornada e regressão de reinício:** concluir duas partidas, voltar e jogar novamente pelo menos3 vezes; repetir após pausa e troca de aba. Conferir texturas, animações, controles, pontuação e ausência de listeners/canvases duplicados. Não testar só o evento de conclusão simulado.
2. **Showroom:** Karina na porta, pedido ao entrar, caixas alcançáveis e recolhidas uma vez, kits automáticos sem consumir cosméticos, despedida antes do cupom e nenhuma placa/dica de saída. Reentrada não repete pedido nem duplica progresso.
3. **Recompensas:** testar cada faixa e limites; muita coleta com3 vidas não dá10%; muita coleta sem os2 externos não dá10%; vida recuperada não apaga mínimo; pouca coleta/pouca vida dá5%; kits não somam pontos. Conferir código e imagem corretos no link de resgate.
4. **Mobile e acesso:**390×844,360×640,412×915 e horizontal, além de desktop. Jogar na primeira dobra, texto legível sem sobrepor personagens, áreas de toque, dois dedos, pulo não disparado pelo avanço. Conferir movimento reduzido, foco de teclado e imagens alternativas. Testar em celular físico se disponível; distinguir emulação.
5. **Áudio e redes sociais:** reprodução0,8, mute, pausa/retomada e autoplay conforme permissão. Compartilhamento de imagem/texto nos dispositivos que suportarem; fallback e cancelamento. Não enviar mensagens nem publicar stories como parte do teste. Prévia do WhatsApp não é garantida pelo wa.me.
6. **Acabamento e performance:** consistência das escalas, recortes/halos, alinhamento de quadros, leves saltos na animação, loader com progresso real e erro recuperável. Medir transferência inicial/FPS antes de otimizar. Verificar se pré-carga por fetch e Phaser repetem transferência. Fazer somente ajustes comprovadamente úteis.
7. **Limpeza de manutenção:** há CSS acumulado e formulário comercial legado oculto. Remover apenas o que estiver comprovadamente morto, sem quebrar IDs, testes ou regras. Não transformar a revisão em reescrita.

## Pendências que dependem do dono antes de lançamento

- Confirmar validade real e condições do desconto em toda a loja, cumulatividade e eventuais regras de compra; atualizar artes e páginas conjuntamente.
- Aprovar aparência final e animações no celular, especialmente exportação da Marcela.
- Validar os três cupons com quem atende pelo WhatsApp e como registrar resgates. Imagem e código fixo não impedem compartilhamento/reutilização.
- Confirmar que a calibração é divertida com pessoas que não conhecem o jogo; qualquer mudança de critérios deve ser explícita.
- Revisar texto de privacidade/consentimento somente se o fluxo realmente coletar dados; não inventar cadastro inexistente.
- Publicação na main/produção só após pedido do dono; esta revisão é na dev.
