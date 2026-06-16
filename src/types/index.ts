import type { Edge, Node } from '@xyflow/react'

export type ServiceStatus = 'Healthy' | 'Degraded' | 'Down'

// extended with record temp for dev
export interface ServiceNodeData extends Record<string, unknown> {
  label: string
  description?: string
  status: ServiceStatus
  cpuValue: number
  memoryGB: number
  diskGB: number
  region: string
  price: string
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
