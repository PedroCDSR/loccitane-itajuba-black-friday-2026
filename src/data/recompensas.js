export const RECOMPENSAS = {
  roma: { codigo: 'ROMA-W3F', percentual: 5, imagem: 'cupom roma.png', nome: 'Romã' },
  caju: { codigo: 'CAJU-K8R', percentual: 7, imagem: 'cupom-caju-k8r.png', nome: 'Caju' },
  bresil: { codigo: 'BRESIL-N6X', percentual: 10, imagem: 'cupom-bresil-n6x.png', nome: 'Brésil' },
};
// Demonstração enquanto os critérios comerciais de cada faixa não forem definidos.
export const RECOMPENSA_FINAL = 'bresil';

// Kits e caixas são a missão obrigatória; só cosméticos somam pontos.
export const PONTOS = { produto: 10, kit: 0 };
export const FAIXAS = [
  { chave: 'roma', minimo: 0, regra: 'Concluir a missão' },
  { chave: 'caju', minimo: 150, regra: '150 pontos + pelo menos 3 vidas' },
  { chave: 'bresil', minimo: 250, regra: '250 pontos + manter 4 vidas + os 2 produtos fora do showroom' },
];
export function desempenho(resultado = {}) {
  const numero = v => Number.isFinite(v) ? Math.max(0, Math.floor(v)) : 0;
  const produtos = numero(resultado.caju) + numero(resultado.roma) + numero(resultado.capim);
  const kits = Math.min(3, numero(resultado.kits));
  const vida = Math.min(5, numero(resultado.vida));
  const vidaMinima = Math.min(vida, numero(resultado.vidaMinima ?? resultado.vida));
  const brindes = Math.min(2, numero(resultado.brindesShowroom));
  const pontosProdutos = produtos * PONTOS.produto, pontosKits = 0, total = pontosProdutos;
  const chave = total >= 250 && vidaMinima >= 4 && brindes === 2 ? 'bresil' : total >= 150 && vida >= 3 ? 'caju' : 'roma';
  return { produtos, kits, pontosProdutos, pontosKits, total, vida, vidaMinima, brindes, chave };
}
