const FRACTIONS: [number, string][] = [
  [0.25, '¼'],
  [0.33, '⅓'],
  [0.5, '½'],
  [0.67, '⅔'],
  [0.75, '¾'],
]

export function formatQuantidade(valor: number | null, unidade: string, observacao?: string): string {
  if (valor === null) return observacao || 'a gosto'

  const inteiro = Math.floor(valor)
  const decimal = valor - inteiro

  let texto: string

  if (decimal < 0.05) {
    texto = String(inteiro)
  } else {
    const fracao = FRACTIONS.find(([f]) => Math.abs(decimal - f) < 0.08)
    if (fracao) {
      texto = inteiro > 0 ? `${inteiro} ${fracao[1]}` : fracao[1]
    } else {
      texto = valor % 1 === 0 ? String(valor) : valor.toFixed(1).replace('.0', '')
    }
  }

  return unidade ? `${texto} ${unidade}` : texto
}

export function scaleQuantidade(base: number | null, basePorcoes: number, novaPorcoes: number): number | null {
  if (base === null) return null
  return (base / basePorcoes) * novaPorcoes
}
