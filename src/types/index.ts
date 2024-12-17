export type CommandItem = {
  name: string
  title: string
  subtitle: string
  description: string
  icon?: string | Record<string, string>
  code?: string
  runtime: 'iframe' | 'worker'
  framework: 'vue' | 'react' | 'solid' | 'svelte'
}

export type Manifest = {
  name: string
  title: string
  version: string
  description: string
  main: string
  code: string
  icon: string | Record<string, string>
  commands: CommandItem[]
  screenshots: Record<string, string>
}

export type Env = 'local' | 'dev' | 'prod'

export type User = any // TODO: handle user type

export type Space = {
  id: string
  name: string
  description: string
  editorMode: string
  sort: number
  color: string
  activeNodeIds: any[]
  pageSnapshot: any
  createdAt: string
  updatedAt: string
  userId: string
}

export interface Config {
  env: Env
  token: string
  user: User
  space: Space
}
