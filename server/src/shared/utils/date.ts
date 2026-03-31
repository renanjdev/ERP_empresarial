export function formatDateBR(date: Date | null): string {
  if (!date) return ''
  return date.toLocaleDateString('pt-BR')
}

export function parseDateBR(value: string): Date {
  const [day, month, year] = value.split('/')
  return new Date(Number(year), Number(month) - 1, Number(day))
}
