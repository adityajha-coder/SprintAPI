import apisRaw from '@/data/apis.json'
import toolsRaw from '@/data/tools.json'
import extensionsRaw from '@/data/extensions.json'
import chromeExtensionsRaw from '@/data/chrome-extensions.json'

export type ApiEntry = {
  name: string
  desc: string
  url: string
  category: string
  auth: string
  cors: boolean
  pricing: string
}

export type ToolEntry = {
  name: string
  desc: string
  url: string
  category: string
}

export type ExtensionEntry = {
  name: string
  desc: string
  id: string
  category: string
  icon?: string
}

type Group<T> = { cat: string; items: T[] }

export const apis: ApiEntry[] = (apisRaw as ApiEntry[]).slice()

export const tools: ToolEntry[] = (toolsRaw as Group<Omit<ToolEntry, 'category'>>[]).flatMap(
  (group) => group.items.map((item) => ({ ...item, category: group.cat })),
)

export const extensions: ExtensionEntry[] = (
  extensionsRaw as Group<Omit<ExtensionEntry, 'category'>>[]
).flatMap((group) => group.items.map((item) => ({ ...item, category: group.cat })))

export const chromeExtensions: ExtensionEntry[] = (
  chromeExtensionsRaw as Group<Omit<ExtensionEntry, 'category'>>[]
).flatMap((group) => group.items.map((item) => ({ ...item, category: group.cat })))

function uniqueSorted(values: string[]): string[] {
  return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b))
}

export const apiCategories = uniqueSorted(apis.map((a) => a.category))
export const apiAuthTypes = uniqueSorted(apis.map((a) => a.auth))
export const apiPricingTypes = uniqueSorted(apis.map((a) => a.pricing))

export const toolCategories = uniqueSorted(tools.map((t) => t.category))
export const extensionCategories = uniqueSorted(extensions.map((e) => e.category))
export const chromeExtensionCategories = uniqueSorted(chromeExtensions.map((e) => e.category))

export const counts = {
  apis: apis.length,
  tools: tools.length,
  extensions: extensions.length,
  chromeExtensions: chromeExtensions.length,
}
