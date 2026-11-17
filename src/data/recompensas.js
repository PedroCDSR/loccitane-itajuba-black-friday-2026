export const RECOMPENSAS = {
  roma: { codigo: 'ROMA-W3F', percentual: 5, imagem: 'cupom roma.png', nome: 'Romã' },
  caju: { codigo: 'CAJU-K8R', percentual: 7, imagem: 'cupom-caju-k8r.png', nome: 'Caju' },
  bresil: { codigo: 'BRESIL-N6X', percentual: 10, imagem: 'cupom-bresil-n6x.png', nome: 'Brésil' },
};
// Demonstração enquanto os critérios comerciais de cada faixa não forem definidos.
export const RECOMPENSA_FINAL = 'bresil';

// Tabela provisória de desempenho: coleta acumulada, sem penalizar o tempo ou dano.
export const PONTOS = { produto: 10, kit: 50 };
export const FAIXAS = [
  { chave: 'roma', minimo: 0, maximo: 299 },
  { chave: 'caju', minimo: 300, maximo: 399 },
  { chave: 'bresil', minimo: 400, maximo: Infinity },
];
export function desempenho(resultado = {}) {
  const numero = v => Number.isFinite(v) ? Math.max(0, Math.floor(v)) : 0;
  const produtos = numero(resultado.caju) + numero(resultado.roma) + numero(resultado.capim);
  const kits = Math.min(3, numero(resultado.kits));
  const pontosProdutos = produtos * PONTOS.produto, pontosKits = kits * PONTOS.kit;
  const total = pontosProdutos + pontosKits;
  const chave = [...FAIXAS].reverse().find(f => total >= f.minimo).chave;
  return { produtos, kits, pontosProdutos, pontosKits, total, chave };
}
