import type { Args } from './types'

export default async function inspect(args: Args) {
  console.log(args)
  return JSON.stringify(args)
}
