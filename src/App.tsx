import { useCallback, useRef, useState } from 'react'
import { LeftRail } from './components/layout/LeftRail'
import { TopBar } from './components/layout/TopBar'
import { useAppStore } from './store'
import { ReactFlowProvider, type ReactFlowInstance } from '@xyflow/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { AppNode } from './types'
import { GraphCanvas } from './components/layout/GraphCanvas'
import { AppPanel } from './components/layout/AppPanel'
import { MobileDrawer } from './components/layout/MobileDrawer'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false
    }
  }
})

function InnerApp() {
  const { selectedAppId } = useAppStore();
  const flowRef = useRef<ReactFlowInstance | null>(null);
  const [selectedNode, setSelectedNode] = useState<AppNode | undefined>();

  const handleNodeSelect = useCallback((node: AppNode | undefined) => {
    setSelectedNode(node);
  }, []);

  const handleUpdateNode = useCallback(
    (id: string, patch: Partial<AppNode['data']>) => {
      setSelectedNode((prev) =>
        prev?.id === id ? { ...prev, data: { ...prev.data, ...patch } } : prev
      );
    },
    []
  );

  const handleFitView = useCallback(() => {
    flowRef.current?.fitView({ padding: 0.15, duration: 500 });
  }, []);

  return (
    <>
      <div className='flex flex-col h-screen bg-app-canvas text-app-text overflow-hidden'>
        <TopBar appName={selectedAppId} onFitView={handleFitView} />
        <div className='flex flex-1 min-h-0 relative'>
          <div className='hidden sm:flex'>
            <LeftRail />
          </div>
          <GraphCanvas onNodeSelect={handleNodeSelect} flowRef={flowRef} />
          <div className="hidden lg:flex">
            <AppPanel selectedNode={selectedNode} onUpdateNode={handleUpdateNode} />
          </div>
        </div>
        <MobileDrawer selectedNode={selectedNode} onUpdateNode={handleUpdateNode} />
      </div>
    </>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactFlowProvider>
        <InnerApp />
      </ReactFlowProvider>
    </QueryClientProvider>
  );
}
