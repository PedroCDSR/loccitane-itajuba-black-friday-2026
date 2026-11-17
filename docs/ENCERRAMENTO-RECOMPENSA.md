# Encerramento com Karina e recompensa

Ao sair do showroom com os três kits, a conclusão abre três páginas de agradecimento da Karina. O último avanço revela o cupom com entrada animada, confetes finitos e resgate abaixo da imagem. Arte pré-carregada na conversa; erro mostra nova tentativa, sem liberar um botão de resgate sem imagem. Movimento reduzido respeitado. Sem envio automático de mensagem ou dados pessoais.

Placar provisório configurável em `src/data/recompensas.js`: cada Caju, Romã ou Capim coletado vale 10 pontos; cada kit montado vale 50. Caixas não contam novamente, nem tempo ou dano. Maior faixa atingida: 0–299 → ROMA-W3F 5%; 300–399 → CAJU-K8R 7%; 400+ → BRESIL-N6X 10%. Os valores são proposta para teste, ainda sujeitos ao ajuste do usuário.

Botão inicial “Testar final e recompensa” permite escolher os três exemplos sem iniciar Phaser. Exibe o mesmo encerramento da partida real. Páginas estáticas /recompensas/roma/, /caju/ e /bresil/ contêm suas imagens e metadados para prévia no WhatsApp. Validade das artes continua ilustrativa 26/11/26.

Validação em Chrome local: atalho, três falas, revelação, placar 420 pontos, imagem Brésil e link para o número fornecido com código/percentual corretos. Não foi enviada mensagem. Não se afirma teste em aparelho real ou nova homologação do jogo completo. Testes Node e build executados antes do push.

## Abertura e alcance do desconto

Abertura em pergaminho com história familiar iniciada em 2023, capítulo final do showroom de Itajubá e botão Jogar. Loading anterior usa os cinco estados de Caju do GitHub e progresso por arquivos concluídos, sem cronômetro fictício. Os próprios indicadores são pré-carregados; erro de preparação permite tentar novamente. O carregamento restante do Phaser também mostra Caju e seu progresso real.

Música agendada já na história; o navegador só libera áudio após primeiro gesto, respeitando som desligado. Sem contornar autoplay. Comunicação do encerramento, texto alternativo, páginas de cupom e mensagem do WhatsApp explicita desconto em toda a loja; as artes aprovadas foram preservadas.

61 testes Node e build passaram. Chrome local: loading visível em 97%, transição ao pergaminho, texto e botão Jogar, loading do Phaser em 98% e abertura jogável apareceram corretamente. Sem teste em celular físico ou nova partida completa.

## Simplificação após revisão por screenshots

Título grande e textos auxiliares removidos da abertura, junto com todo o teste inicial. Frase final em negrito com destaques vinho; história compacta e estilos menores para telas curtas, buscando manter Jogar na primeira dobra. Final remove frase repetida, confirmação de imagem pronta e repetição do código; indicador de carregamento/erro continua funcional. A despedida acontece antes de emitir a conclusão, dentro do showroom, usando `mostrarFala`, paginação e botão REVELAR CUPOM existentes. O teste de exploração agora confirma que a conclusão espera terminar essa fala. Volume da trilha configurado em 1; tentativa de autoplay ao revelar a abertura, com retomada por gesto caso o navegador bloqueie.

Verificação desta rodada: 61 testes e build passaram; navegador indisponível por erro de conexão do serviço, sem nova homologação visual ou de autoplay em celular.

## Showroom acolhedor e pontuação calibrada

Mariana agora referencia explicitamente o showroom da L’Occitane e convida a seguir em frente. Karina dá boas-vindas na porta; após atravessar a porta há uma segunda cena de conversa, com Karina esperando perto da entrada interior. Ao encerrar o pedido, ela segue para a bancada. O jogador recolhe três caixas, Karina monta os kits automaticamente e inicia o agradecimento dentro do showroom. Não exige combinações de cosméticos, passagem em estações nem busca pela saída. Placa SAÍDA, seta e instruções antigas removidas. O último avanço revela o cupom.

Pontuação:10 por produto cosmético; kits e caixas obrigatórios não rendem pontos. 10% requer250+ pontos, vida mínima na partida >=4 e os dois produtos externos da fachada. 7% requer150+ pontos e vida final >=3; demais resultados liberam5%. A menor vida é registrada antes de qualquer reposicionamento, para que perder vidas e recuperar a personagem não permita contornar a regra. Os dois itens extras usam marca própria e conjunto por tipo, evitando contar um mesmo item duas vezes. Valores configurados em src/data/recompensas.js. Placar final mostra pontos, vida atual/mínima e coleta externa0/2. Faixas são condicionais, não apenas números.

Testes cobrem término após caixas sem saída e sem consumir produtos da cidade, agradecimento antes da recompensa, limites de pontos e bloqueio de10% por vida/extra faltante. Esta rodada não homologou nova partida completa em navegador.

## Reinício e ações secundárias

Mariana mudou para x2650, antes da igreja em x2750. Sua fala menciona o showroom uma vez, mantendo o convite para continuar. Karina passa de52 para55 unidades de altura visível.

O reinício agora destrói a instância anterior do Phaser e aguarda seu evento destroy antes de criar outra. Não reutiliza mundo pausado, caches de textura ou renderer da conclusão. O retorno ao início restaura estado da interface e música; cliques duplicados de início são bloqueados enquanto o motor está sendo criado. Tentativa após falha de assets segue o mesmo ciclo.

CTA principal “Resgatar meu prêmio” preservado. Abaixo dele: Compartilhe, Instagram e WhatsApp. Compartilhe usa o menu nativo com uma imagem real do jogo e convite quando o navegador aceita arquivos; a disponibilidade do Instagram nesse menu depende do celular/aplicativo. Sem Web Share, abre convite de WhatsApp e permite salvar a imagem. Instagram abre o perfil da loja, WhatsApp abre a conversa da loja. Nenhuma publicação ou mensagem enviada automaticamente.

63 testes e build passaram. Teste de regressão em Chrome local com página auxiliar não publicada: iniciou a primeira partida, simulou o evento de conclusão e parada da cena, verificou os novos botões finais, voltou ao início e iniciou a segunda partida. Screenshot confirmou cenário, exploradora, capivara e caixa de diálogo renderizados na segunda abertura. Não foi uma segunda partida completa nem teste em aparelho físico. A página auxiliar permanece apenas em work/ e não integra o build.
