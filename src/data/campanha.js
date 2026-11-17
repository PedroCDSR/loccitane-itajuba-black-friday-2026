// Preencher antes de publicar. Os 10% são a proposta de MVP, dentro do teto autorizado.
export const CAMPANHA = {
  titulo: 'A Última Aventura',
  subtitulo: 'Última Black Friday L’Occitane Itajubá',
  periodo: 'Novembro de 2026',
  despedida: 'Nossa loja vai encerrar este ciclo. Vamos celebrar os encontros e os presentes que fizeram parte dessa história.',
  // Conversas do jogo. Pedro: texto dele mesmo (17/11/2026). Karina: texto ditado pelo Pedro (pedido de ajuda com os kits).
  conversas: {
    pedro: { titulo: 'PEDRO · L’OCCITANE ITAJUBÁ', texto: 'Oi! Eu sou o Pedro. Em janeiro de 2023 nós trouxemos a L’Occitane para Itajubá, com o objetivo de trazer uma nova forma de autocuidado para a cidade.', botao: 'Continuar →' },
    karina: { titulo: 'KARINA · SHOWROOM ITAJUBÁ', botao: 'Vamos montar os kits →', texto: 'Que bom que você chegou! Preciso da sua ajuda para montar os kits de presente: cada um leva um Caju, uma Romã e uma caixa. As caixas estão no alto das estantes, lá dentro. Você consegue pegar para mim, por favor? Depois é só passar na bancada.' },
  },
  // Abertura encenada no jogo. Ficção de jogo: não descreve um incidente real da loja.
  // A abertura só conta a história e dá a missão da rua. As instruções aparecem ao longo da jornada, na hora de usar:
  // toldo, capivaras e dano nas dicas da rua (src/game/Tutorial.js); caixas e bancada com a Karina, no showroom.
  introCena: [
    { titulo: 'ITAJUBÁ · NOVEMBRO DE 2026', texto: 'Fim de tarde em Itajubá. Hoje é a última Black Friday do showroom L’Occitane au Brésil, e a entrega de Caju e Romã acabou de chegar!' },
    { titulo: 'OPA!', texto: 'Uma capivara curiosa sentiu o cheirinho de caju e derrubou a entrega. Os produtos da L’Occitane se espalharam pela cidade!' },
    { titulo: 'SUA MISSÃO', texto: 'Recupere os produtos espalhados por Itajubá e leve tudo ao showroom da L’Occitane. É só seguir sempre em frente. Sem pressa!' },
  ],
  instagram: 'https://www.instagram.com/loccitane.itajuba/',
  whatsapp: '', // DDI + DDD + número. Nunca usar o contato do espetáculo anterior.
  oferta: { ativa: false, descontoPercentual: 10, validade: '', condicoes: '' },
  privacidade: { responsavel: '', contato: '', retencao: '' },
};
