import type { Args } from './types'

export default async function curl({ _ }: Args) {
  const response = await fetch(_[1])
  return response.text()
}
