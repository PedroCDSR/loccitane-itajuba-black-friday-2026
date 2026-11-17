# Resgate e leads

## Base entregue

`src/data/campanha.js` guarda a única fonte de dados comerciais. Teto de 10%; valor proposto de 10% desativado até preencher validade, condições, WhatsApp e informações de privacidade. Não copiar ofertas do e-commerce nacional. Não definir validade, exclusões ou compra mínima por conta própria.

Funil: início → coleta → conclusão → ver benefício → primeiro nome + confirmação de atendimento → abrir mensagem no WhatsApp → visitante confirma o envio. A mensagem inclui intenção de resgate e número de presentes; não comprova compra ou elegibilidade. Não há códigos únicos nem controle de resgates repetidos.

A base não captura leads em banco: prepara contato iniciado pelo próprio visitante. Nome fica em memória do formulário, não em localStorage, analytics, logs ou repositório. WhatsApp é o canal de conversa e aplica sua própria política. O telefone do visitante não precisa ser solicitado: já acompanha a conversa quando ele a inicia. Marketing tem opção separada, opcional e desmarcada.

Eventos locais não provam envio da mensagem nem venda: `encaminhamento_whatsapp` significa apenas navegação para o destino. Analytics externo ainda precisa ser configurado. Nomes e mensagens nunca entram nos eventos.

## Para captura persistente futura

Implementar endpoint HTTPS no servidor, validação e limites de requisição, banco com acesso restrito, consentimentos versionados, política de retenção e exclusão, contato do responsável e integração autenticada com CRM. Chaves só no servidor. Exibir sucesso apenas após resposta confirmada; em falha não fingir cadastro. Não publicar planilhas com dados pessoais nem enviar nome na URL de analytics. Antes de habilitar marketing automático, definir finalidade e operação com a loja.

Se quiser cupom único ou prêmio vinculado à pessoa, adicionar emissão e validação no servidor. A pontuação atual é totalmente manipulável pelo cliente; não deve ser tratada como prova antifraude. As decisões comerciais e os textos finais de privacidade precisam ser fornecidos pela loja.
