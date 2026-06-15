import type { Edge, Node } from '@xyflow/react'

export type ServiceStatus = 'Healthy' | 'Degraded' | 'Down'

export interface ServiceNodeData extends Record<string, unknown> {
  label: string
  description?: string
  status: ServiceStatus
  cpuValue: number
  memoryGB: number
  diskGB: number
  region: string
  price: number
  icon: string
  color: string
}

export interface App {
  id: string
  name: string
  icon: string
  color: string
}

export interface GraphData {
  nodes: AppNode[]
  edges: AppEdge[]
}

export type AppNode = Node<ServiceNodeData, 'serviceNode'>
export type AppEdge = Edge
