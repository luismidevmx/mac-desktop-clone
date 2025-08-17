import type { Args } from '../terminalHandlers/types'

export default async function mathjs({ _ }: Args) {
  const { evaluate } = await import('mathjs')
  const expr = _.slice(1).join(' ')

  return '' + evaluate(expr)
}
