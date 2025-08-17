import type { Args } from './types'

export default async function echo({ _ }: Args) {
  const fullText = _.slice(1).join(' ')

  const args = fullText.match(/(?:[^\s"]+|"[^"]*")+/g) || []
  const noQuoteArgs = args.map(arg => arg.replace(/"/g, ''))

  return noQuoteArgs.join('\n')
}
