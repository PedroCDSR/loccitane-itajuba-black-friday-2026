// Preencher antes de publicar. Os 10% são a proposta de MVP, dentro do teto autorizado.
export const CAMPANHA = {
  titulo: 'A Última Aventura',
  subtitulo: 'Última Black Friday L’Occitane Itajubá',
  periodo: 'Novembro de 2026',
  despedida: 'Nossa loja vai encerrar este ciclo. Vamos celebrar os encontros e os presentes que fizeram parte dessa história.',
  // Títulos em maiúsculas e minúsculas: na fonte pixel o acento das maiúsculas quase some (1 pixel).
  // Conversas do jogo. Pedro: texto dele mesmo (17/11/2026). Karina: texto ditado pelo Pedro (pedido de ajuda com os kits).
  conversas: {
    pedro: { titulo: 'Pedro · L’Occitane Itajubá', texto: 'Sabe o que fez esse lugar especial? Cada pessoa que entrou, escolheu um presente e levou um pouquinho da nossa história.\n\nHoje é a sua vez de fazer parte dela. Leve os produtos até a Karina. Ainda temos uma última lembrança para criar juntos.', botao: 'VAMOS LÁ' },
    mariana: { titulo: 'Mariana · L’Occitane Itajubá', texto: 'Oi! Sou a Mariana. Esse cantinho foi um projeto da nossa família… e acabou fazendo parte da história de tanta gente!\n\nVivemos muitas coisas boas aqui. Que bom ter você nessa última aventura!', botao: 'ATÉ JÁ' },
    marcela: { titulo: 'Marcela · L’Occitane Itajubá', texto: 'Sou a Marcela! Adorei colocar um pouquinho da minha criatividade nas campanhas da loja. Foi muito especial fazer parte disso tudo.\n\nAgora corre lá! A Karina já está te esperando. Ainda tem uma surpresa pra você!', botao: 'VAMOS LÁ' },
    karina: { titulo: 'Karina · Showroom Itajubá', botao: 'VAMOS LÁ', texto: 'Que bom que você chegou! Preciso da sua ajuda para montar os kits de presente: cada um leva um Caju, uma Romã e uma caixa. As caixas estão no alto das estantes, lá dentro. Você consegue pegar para mim, por favor? Depois é só passar na bancada.' },
  },
  // Abertura encenada no jogo. Ficção de jogo: não descreve um incidente real da loja.
  // acao 'derrubar': antes desta fala a caixa some e a capivara derruba o cesto (a fala aparece depois da cena).
  // A abertura só conta a história e dá a missão da rua. As instruções aparecem ao longo da jornada, na hora de usar:
  // toldo, capivaras e dano nas dicas da rua (src/game/Tutorial.js); caixas e bancada com a Karina, no showroom.
  introCena: [
    { titulo: 'Itajubá · novembro de 2026', texto: 'Fim de tarde em Itajubá. Hoje é a última Black Friday do showroom L’Occitane au Brésil, e a entrega de Caju e Romã acabou de chegar!' },
    { titulo: 'Opa!', acao: 'derrubar', texto: 'Uma capivara curiosa sentiu o cheirinho de caju e derrubou a entrega. Os produtos da L’Occitane se espalharam pela cidade!' },
    { titulo: 'Sua missão', texto: 'Recupere os produtos espalhados por Itajubá e leve tudo ao showroom da L’Occitane. É só seguir sempre em frente. Sem pressa!' },
  ],
  instagram: 'https://www.instagram.com/loccitane.itajuba/',
  whatsapp: '553598137549', // Número informado pelo usuário, com DDI + DDD.
  oferta: { ativa: false, descontoPercentual: 10, validade: '', condicoes: '' },
  privacidade: { responsavel: '', contato: '', retencao: '' },
};
