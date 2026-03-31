export function success(message: string, data: unknown = null) {
  return { code: 200, status: 'success', message, data }
}

export function created(message: string, data: unknown = null) {
  return { code: 201, status: 'success', message, data }
}

export function error(code: number, message: string, data: unknown = null) {
  return { code, status: 'error', message, data }
}
