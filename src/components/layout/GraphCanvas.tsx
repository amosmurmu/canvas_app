import { useCallback, useEffect, useRef, useSyncExternalStore } from 'react';
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  type Connection,
  type NodeMouseHandler,
  type ReactFlowInstance,
} from '@xyflow/react';
import { useQuery } from '@tanstack/react-query';
import { Loader2, AlertTriangle, RefreshCw } from 'lucide-react';
import { ServiceNode } from '@/components/nodes/ServiceNode';
import { NodeInspector as FlowNodeInspector } from '@/components/devtools';
import { useAppStore } from '@/store';
import type { AppNode, AppEdge } from '@/types';
import { fetchGraph } from '@/api/mock';
import { cn } from '@/lib/utils';
import { getFlowColors } from '@/lib/app-theme';
import { useTheme } from 'next-themes';

const NODE_TYPES = { serviceNode: ServiceNode } as const;

function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(query);
      mq.addEventListener('change', onChange);
      return () => mq.removeEventListener('change', onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

interface GraphCanvasProps {
  onNodeSelect: (node: AppNode | undefined) => void;
  flowRef: React.MutableRefObject<ReactFlowInstance | null>;
  updateNodeRef: React.MutableRefObject<((id: string, patch: Partial<AppNode['data']>) => void) | null>;
}

export function GraphCanvas({ onNodeSelect, flowRef, updateNodeRef }: GraphCanvasProps) {
  const { selectedAppId, selectedNodeId, setSelectedNode, activeInspectorTab } = useAppStore();
  const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<AppEdge>([]);
  const didFit = useRef(false);
  const isCompact = useMediaQuery('(max-width: 1023px)');
  const isMobile = useMediaQuery('(max-width: 639px)');

  const minimapSize = isMobile
    ? { width: 88, height: 52 }
    : isCompact
      ? { width: 140, height: 84 }
      : { width: 200, height: 120 };

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ['graph', selectedAppId],
    queryFn: () => fetchGraph(selectedAppId),
    staleTime: 1000 * 60,
  });

  // Load graph when data arrives
  useEffect(() => {
    if (data) {
      setNodes(data.nodes);
      setEdges(data.edges);
      didFit.current = false;
      setSelectedNode(null);
    }
  }, [data, setNodes, setEdges, setSelectedNode]);

  // Propagate selected node to parent
  useEffect(() => {
    const node = nodes.find((n) => n.id === selectedNodeId);
    onNodeSelect(node);
  }, [selectedNodeId, nodes, onNodeSelect]);

  const updateNodeData = useCallback(
    (id: string, patch: Partial<AppNode['data']>) => {
      setNodes((ns) =>
        ns.map((n) =>
          n.id === id ? { ...n, data: { ...n.data, ...patch } } : n
        )
      );
    },
    [setNodes]
  );

  useEffect(() => {
    updateNodeRef.current = updateNodeData;
    return () => {
      updateNodeRef.current = null;
    };
  }, [updateNodeData, updateNodeRef]);

  const handleInit = useCallback(
    (instance: ReactFlowInstance) => {
      flowRef.current = instance;
      if (!didFit.current) {
        setTimeout(() => {
          instance.fitView({ padding: 0.15, duration: 400 });
          didFit.current = true;
        }, 150);
      }
    },
    [flowRef]
  );

  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  // Keyboard delete
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedNodeId) {
        setNodes((ns) => ns.filter((n) => n.id !== selectedNodeId));
        setEdges((es) => es.filter(
          (ed) => ed.source !== selectedNodeId && ed.target !== selectedNodeId
        ));
        setSelectedNode(null);
      }
    },
    [selectedNodeId, setNodes, setEdges, setSelectedNode]
  );

  const handleNodeClick: NodeMouseHandler<AppNode> = useCallback(
    (_e, node) => { setSelectedNode(node.id); },
    [setSelectedNode]
  );

  const handlePaneClick = useCallback(() => {
    setSelectedNode(null);
  }, [setSelectedNode]);

  const { resolvedTheme } = useTheme();
  const flowTheme = getFlowColors(resolvedTheme);
  const colorMode = resolvedTheme === 'light' ? 'light' : 'dark';

  return (
    <div
      className="flex-1 relative overflow-hidden bg-app-canvas outline-none"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      {/* Loading overlay */}
      {(isLoading || isFetching) && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-app-canvas/70 backdrop-blur-[2px]">
          <div className="flex items-center gap-2.5 bg-app-elevated border border-app-border rounded-xl px-5 py-3 shadow-2xl">
            <Loader2 size={15} className="animate-spin text-indigo-400" />
            <span className="text-xs font-mono text-app-secondary">Loading graph…</span>
          </div>
        </div>
      )}

      {/* Error state */}
      {isError && !isLoading && !isFetching && (
        <div className="absolute inset-0 z-50 flex items-center justify-center">
          <div className="bg-app-elevated border border-red-500/20 rounded-2xl px-6 py-5 shadow-2xl text-center max-w-xs">
            <AlertTriangle size={24} className="text-red-400 mx-auto mb-2.5" />
            <p className="text-sm font-mono font-medium text-app-text mb-1">Graph failed to load</p>
            <p className="text-[11px] font-mono text-app-muted-fg mb-4">Simulated network error — try again</p>
            <button
              onClick={() => void refetch()}
              className="flex items-center gap-1.5 mx-auto text-xs font-mono cursor-pointer text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/15 border border-indigo-500/25 px-3.5 py-1.5 rounded-lg transition-all"
            >
              <RefreshCw size={11} />
              Retry
            </button>
          </div>
        </div>
      )}

      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={NODE_TYPES}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={handleNodeClick}
        onPaneClick={handlePaneClick}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onInit={handleInit as any}
        fitView
        colorMode={colorMode}
        proOptions={{ hideAttribution: true }}
        defaultEdgeOptions={{
          style: { stroke: flowTheme.edge, strokeWidth: 1.5 },
          animated: true,
        }}
        style={{ background: 'transparent' }}
        className="graph-flow"
      >
        <Background variant={BackgroundVariant.Dots} gap={24} size={1.5} color={flowTheme.dot} />
        <Controls
          className={cn(
            'graph-flow-controls !shadow-lg',
            isMobile && 'graph-flow-controls--compact'
          )}
          position={isMobile ? 'top-left' : 'bottom-left'}
        />
        <MiniMap
          pannable
          zoomable
          nodeColor={flowTheme.minimapNode}
          maskColor={flowTheme.minimapMask}
          style={minimapSize}
          className={cn(
            'graph-flow-minimap !rounded-md overflow-hidden !border !border-app-border cursor-pointer',
            isMobile && 'graph-flow-minimap--compact'
          )}
          position={isMobile ? 'top-right' : 'bottom-right'}
        />
        {activeInspectorTab === 'devtools' && <FlowNodeInspector />}
      </ReactFlow>

      {/* Delete hint */}
      {selectedNodeId && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 pointer-events-none z-10">
          <div className="flex items-center bg-app-elevated/90 backdrop-blur-sm border border-app-border rounded-lg px-2 py-2">
            <span className="text-[10px] font-mono text-app-muted-fg">
              Press <kbd className="bg-app-muted text-app-secondary px-1.5 py-0.5 rounded text-[9px]">Del</kbd> <span> /</span>
              <kbd className="bg-app-muted text-app-secondary px-1.5 py-0.5 rounded text-[9px]">Backspace</kbd>
              to remove node
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
