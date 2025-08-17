export type Args = Record<string, string> & {
  _: string[]
}

export type Handler = (args: Args) => Promise<string>
