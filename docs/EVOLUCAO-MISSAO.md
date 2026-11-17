# Rodada: produtos por Itajubá e kits no showroom

## Escopo atendido

A pedido do usuário, cidade e tempo foram preservados: showroom em x=5216, mundo5856, velocidade140 e 75 segundos de jogo ativo. Não foi aplicado o encurtamento do modo fácil antigo. Foram reaproveitados seus cinco corações, com tolerância de salto de160ms, invencibilidade1,8s, capivaras mais lentas e checkpoints a cada400 unidades. Não se perdem produtos ao receber dano.

Abertura em três etapas: última Black Friday do showroom → história fictícia da seleção de Caju e Romã espalhada durante a entrega → levar ao showroom e montar três kits com Pedro. É uma premissa de jogo, não notícia de incidente real com a loja. Intro pode ser pulada; não usa o cronômetro.

## Gameplay

Caju e Romã usam os frascos aprovados/gerados, derivados em public/assets/showroom. Há pares pelo caminho acessível da cidade e produtos adicionais no showroom. A fruta oferecida às capivaras é um item separado e ilimitado; não consome cosméticos do inventário.

Pedro acena e oferece interação por E/Enter, botão de toque ou clique nele quando próximo. A conversa pausa física e o relógio ativo, e o fechamento descarta as teclas/toques anteriores para não virar salto. A ação da vitrine fica nos três pontos da bancada: um Caju + uma Romã por kit. Cada ponto só pode ser usado uma vez. HUD mostra coleta por produto e kits0/3. Com três kits, a saída à direita conclui a vitrine; ao acabar o tempo, a tela informa progresso real e permite tentar de novo.

Cidade, exploradora, capivaras, caju-fruta, cestos e presentes agora usam as artes novas. Filtros NEAREST; física separada das imagens. Os cestos têm colisão apenas na parte visível. A rua mantém todos os marcos. O showroom já montado pelo outro agente foi preservado.

## Carregamento e mobile

25 texturas runtime WebP, cerca de1,95MB: sprites em codificação lossless e cidade limitada a128 cores sem dithering, então codificada lossless. Dimensões e canal alfa preservados. PNGs originais e ZIPs não alterados. Manifesto de bytes em docs/pacotes/runtime.json. Pedro e fundos do showroom são cargas adicionais; esta medida não é o tamanho total do jogo.

Indicador de progresso e opção de tentar novamente em falha de assets. Controles sobre o canvas; em celular deitado, HUD/objetivo também sobrepostos. Botão de pausa permanece no HUD. Últimos15s destacados. Fontes são resolvidas no build com hash. Nenhum serviço comercial/CRM ou analytics externo foi ativado.

## Verificação desta rodada

Build e testes Node executados. Testes de missão cobrem inventários independentes, produtos válidos, consumo de pares, bloqueio fora do showroom, estação única, estoque não negativo e preservação das medidas/tempo atuais. Texturas runtime conferidas contra medidas dos PNGs. Alfa e pixels visíveis dos sprites lossless conferidos; cidade preserva alfa mas possui redução de paleta documentada.

**Não houve navegador controlável disponível para esta rodada do Codex.** Portanto não foram homologados console, colisões em partida real, fluidez, posição dos novos assets, layout de celular, tempo real de conclusão ou áudio. Os resultados de Chromium nos documentos anteriores pertencem à versão anterior testada pelo outro agente, não provam esta integração.

## Próximo teste prioritário

1. Abrir intro, avançar e pular; cronômetro começa só na cidade.
2. Conferir cenário novo sem 404 e exploradora com hitbox alinhada.
3. Jogar a cidade por inteiro com teclado e touch, oferecendo fruta e coletando cosméticos.
4. Conversar com Pedro; conferir pausa do tempo/física e ausência de salto ao fechar.
5. Montar três kits em pontos distintos da bancada, verificar decremento de estoque e sair.
6. Conferir timeout parcial, reinício, pausa por foco e nova tentativa de carregamento.
7. Capturar cidade, diálogo, bancada e final em desktop e celular emulado. Não apresentar conceitos como capturas reais.

Oferta permanece desativada e limitada a10%, aguardando dados reais. Não foi feito deploy.
