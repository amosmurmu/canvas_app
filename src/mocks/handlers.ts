import { http, HttpResponse, delay } from 'msw'
import type { App, GraphData } from '@/types'

const APPS: App[] = [
  {
    id: 'supertokens-golang',
    name: 'supertokens-golang',
    icon: 'golang',
    color: '#6366f1',
  },
  {
    id: 'supertokens-java',
    name: 'supertokens-java',
    icon: 'java',
    color: '#6366f1',
  },
  {
    id: 'supertokens-python',
    name: 'supertokens-python',
    icon: 'python',
    color: '#6366f1',
  },
  {
    id: 'supertokens-ruby',
    name: 'supertokens-ruby',
    icon: 'ruby',
    color: '#6366f1',
  },
  {
    id: 'supertokens-typescript',
    name: 'supertokens-typescript',
    icon: 'typescript',
    color: '#6366f1',
  },
]

const GRAPH_DATA: Record<string, GraphData> = {
  'supertokens-golang': {
    nodes: [
      {
        id: 'postgres-1',
        type: 'serviceNode',
        position: { x: 400, y: 80 },
        data: {
          label: 'Postgres',
          description: 'Primary relational database',
          status: 'Healthy',
          cpuValue: 32,
          memoryGB: 8,
          diskGB: 10.0,
          region: 'us-east',
          price: '$0.03/HR',
          icon: 'postgresql',
          color: '#336791',
        },
      },
      {
        id: 'redis-1',
        type: 'serviceNode',
        position: { x: 100, y: 310 },
        data: {
          label: 'Redis',
          description: 'In-memory cache & session store',
          status: 'Down',
          cpuValue: 45,
          memoryGB: 2,
          diskGB: 10.0,
          region: 'us-west',
          price: '$0.03/HR',
          icon: 'redis',
          color: '#dc382d',
        },
      },
      {
        id: 'mongodb-1',
        type: 'serviceNode',
        position: { x: 580, y: 320 },
        data: {
          label: 'MongoDB',
          description: 'Document store for analytics',
          status: 'Down',
          cpuValue: 68,
          memoryGB: 8,
          diskGB: 10.0,
          region: 'eu-east',
          price: '$0.03/HR',
          icon: 'mongodb',
          color: '#4db33d',
        },
      },
    ],
    edges: [
      { id: 'e1', source: 'postgres-1', target: 'redis-1', animated: true },
      { id: 'e2', source: 'postgres-1', target: 'mongodb-1', animated: true },
    ],
  },
  'supertokens-java': {
    nodes: [
      {
        id: 'api-gateway',
        type: 'serviceNode',
        position: { x: 300, y: 80 },
        data: {
          label: 'API Gateway',
          description: 'Ingress & routing layer',
          status: 'Healthy',
          cpuValue: 20,
          memoryGB: 4,
          diskGB: 5.0,
          region: 'us-west',
          price: '$0.05/HR',
          icon: 'settings',
          color: '#f59e0b',
        },
      },
      {
        id: 'auth-svc',
        type: 'serviceNode',
        position: { x: 100, y: 280 },
        data: {
          label: 'Auth Service',
          description: 'OAuth2 & JWT management',
          status: 'Healthy',
          cpuValue: 35,
          memoryGB: 8,
          diskGB: 2.0,
          region: 'eu-west',
          price: '$0.04/HR',
          icon: 'puzzle',
          color: '#6366f1',
        },
      },
      {
        id: 'db-primary',
        type: 'serviceNode',
        position: { x: 500, y: 280 },
        data: {
          label: 'MySQL',
          description: 'Managed relational database',
          status: 'Degraded',
          cpuValue: 78,
          memoryGB: 4,
          diskGB: 50.0,
          region: 'us-west',
          price: '$0.08/HR',
          icon: 'mongodb',
          color: '#00758f',
        },
      },
    ],
    edges: [
      { id: 'e1', source: 'api-gateway', target: 'auth-svc', animated: true },
      { id: 'e2', source: 'api-gateway', target: 'db-primary' },
    ],
  },
}

// Fill remaining apps with golang graph
for (const app of APPS.slice(2)) {
  GRAPH_DATA[app.id] = GRAPH_DATA['supertokens-golang']!
}

export const handlers = [
  // GET /apps
  http.get('/api/apps', async () => {
    await delay(600)
    if (Math.random() < 0.05) {
      return HttpResponse.json({ error: 'Network error' }, { status: 500 })
    }
    return HttpResponse.json(APPS)
  }),

  // GET /api/apps/:appId/graph
  http.get('/api/apps/:appId/graph', async ({ params }) => {
    await delay(800)
    if (Math.random() < 0.1) {
      return HttpResponse.json(
        { error: 'Failed to load graph' },
        { status: 500 }
      )
    }
    const appId = params['appId'] as string
    const data = GRAPH_DATA[appId] ?? GRAPH_DATA['supertokens-golang']!

    return HttpResponse.json(JSON.parse(JSON.stringify(data)))
  }),
]
