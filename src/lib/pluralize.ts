export function foundCount(n: number, kind: 'notes' | 'exercises'): string {
  if (n === 0) return 'Ничего не нашлось.'
  if (kind === 'notes') {
    const counted = ruCount(n, ['тема', 'темы', 'тем'])
    const singular = n % 10 === 1 && n % 100 !== 11
    return singular ? `Нашлась ${counted}.` : `Нашлось ${counted}.`
  }
  return `Нашлось ${ruCount(n, ['упражнение', 'упражнения', 'упражнений'])}.`
}

export function ruCount(n: number, forms: [string, string, string]): string {
  const abs = Math.abs(n) % 100
  const last = abs % 10
  const word =
    abs > 10 && abs < 20 ? forms[2] : last === 1 ? forms[0] : last > 1 && last < 5 ? forms[1] : forms[2]
  return `${n} ${word}`
}
