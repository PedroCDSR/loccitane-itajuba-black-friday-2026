# Encerramento com Karina e recompensa

Ao sair do showroom com os três kits, a conclusão abre três páginas de agradecimento da Karina. O último avanço revela o cupom com entrada animada, confetes finitos e resgate abaixo da imagem. Arte pré-carregada na conversa; erro mostra nova tentativa, sem liberar um botão de resgate sem imagem. Movimento reduzido respeitado. Sem envio automático de mensagem ou dados pessoais.

Placar provisório configurável em `src/data/recompensas.js`: cada Caju, Romã ou Capim coletado vale 10 pontos; cada kit montado vale 50. Caixas não contam novamente, nem tempo ou dano. Maior faixa atingida: 0–299 → ROMA-W3F 5%; 300–399 → CAJU-K8R 7%; 400+ → BRESIL-N6X 10%. Os valores são proposta para teste, ainda sujeitos ao ajuste do usuário.

Botão inicial “Testar final e recompensa” permite escolher os três exemplos sem iniciar Phaser. Exibe o mesmo encerramento da partida real. Páginas estáticas /recompensas/roma/, /caju/ e /bresil/ contêm suas imagens e metadados para prévia no WhatsApp. Validade das artes continua ilustrativa 26/11/26.

Validação em Chrome local: atalho, três falas, revelação, placar 420 pontos, imagem Brésil e link para o número fornecido com código/percentual corretos. Não foi enviada mensagem. Não se afirma teste em aparelho real ou nova homologação do jogo completo. Testes Node e build executados antes do push.
