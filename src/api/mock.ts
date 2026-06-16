import type { App, GraphData } from '@/types'

export async function fetchApps(): Promise<App[]> {
  const res = await fetch('/api/apps')
  if (!res.ok) throw new Error('Failed to fetch apps')
  return res.json() as Promise<App[]>
}

export async function fetchGraph(appId: string): Promise<GraphData> {
  const res = await fetch(`/api/apps/${appId}/graph`)
  if (!res.ok) throw new Error(`Failed to load graph for ${appId}`)
  return res.json() as Promise<GraphData>
}
