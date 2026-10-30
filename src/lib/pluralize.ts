export function ruCount(n: number, forms: [string, string, string]): string {
  const abs = Math.abs(n) % 100
  const last = abs % 10
  const word =
    abs > 10 && abs < 20 ? forms[2] : last === 1 ? forms[0] : last > 1 && last < 5 ? forms[1] : forms[2]
  return `${n} ${word}`
}
