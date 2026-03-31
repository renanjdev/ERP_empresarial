import { Decimal } from '@prisma/client/runtime/library'

export function formatMoney(value: Decimal | number | null): string {
  if (value === null) return '0,00'
  const num = typeof value === 'number' ? value : Number(value)
  return num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export function parseMoney(value: string): Decimal {
  const cleaned = value.replace(/\./g, '').replace(',', '.')
  return new Decimal(cleaned)
}
