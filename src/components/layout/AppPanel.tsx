import { useState } from 'react';
import { Search, Plus, ChevronRight, Loader2, AlertTriangle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchApps } from '@/api/mock';
import { useAppStore } from '@/store';
import type { AppNode } from '@/types';
import { cn } from '@/lib/utils';
import { MapIcon } from '@/components/common/MapIcon'
import { NodeInspector } from '../inspector/NodeInspector';

interface AppPanelProps {
  selectedNode: AppNode | undefined;
  onUpdateNode: (id: string, data: Partial<AppNode['data']>) => void;
  isMobile?: boolean;
  onClose?: () => void;
}

export function AppPanel({ selectedNode, onUpdateNode, isMobile, onClose }: AppPanelProps) {
  const { selectedAppId, setSelectedApp } = useAppStore();
  const [search, setSearch] = useState('');

  const { data: apps, isLoading, isError, refetch } = useQuery({
    queryKey: ['apps'],
    queryFn: fetchApps,
    retry: 1,
  });

  const filtered = apps?.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      className={cn(
        'flex flex-col bg-app-surface border-l border-app-border h-full overflow-hidden',
        isMobile ? 'w-full' : 'w-72'
      )}
    >
      {/* Section: App selector */}
      <div className="px-3 py-2 border-b border-app-border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono font-semibold text-app-text">Application</span>
          {isMobile && (
            <button onClick={onClose} className="text-app-muted-fg hover:text-app-text text-xs">✕</button>
          )}
        </div>

        {/* Search */}
        <div className="flex gap-1.5">
          <div className="relative flex-1">
            <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-app-muted-fg" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full pl-7 pr-2 py-1.5 bg-app-input border border-app-border-strong rounded-md text-xs font-mono text-app-text placeholder:text-app-muted-fg focus:outline-none focus:border-indigo-500/60 transition-colors"
            />
          </div>
          <button className="w-7 h-7 flex items-center justify-center cursor-pointer bg-indigo-600 hover:bg-indigo-500 rounded-md transition-colors shrink-0">
            <Plus size={13} className="text-white" />
          </button>
        </div>
      </div>

      {/* App list */}
      <div className="overflow-y-auto" style={{ maxHeight: '280px' }}>
        {isLoading && (
          <div className="flex items-center justify-center py-8 gap-2">
            <Loader2 size={14} className="animate-spin text-indigo-400" />
            <span className="text-xs font-mono text-app-muted-fg">Loading apps…</span>
          </div>
        )}

        {isError && (
          <div className="px-3 py-4">
            <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/20 rounded-md p-2.5">
              <AlertTriangle size={12} className="text-red-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-[10px] font-mono text-red-400">Failed to load apps</p>
                <button
                  onClick={() => void refetch()}
                  className="text-[10px] font-mono cursor-pointer text-indigo-400 hover:underline mt-0.5"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        )}

        {filtered?.map((app) => (
          <button
            key={app.id}
            onClick={() => setSelectedApp(app.id)}
            className={cn(
              'w-full flex items-center gap-2.5 px-3 py-2 cursor-pointer hover:bg-app-muted transition-colors text-left group',
              selectedAppId === app.id ? 'bg-app-muted' : ''
            )}
          >
            <MapIcon name={app.icon} size="lg" color={app.color} showBackground />
            <span className="flex-1 text-xs font-mono text-app-text truncate">{app.name}</span>
            <ChevronRight
              size={12}
              className={cn(
                'text-app-muted-fg transition-transform',
                selectedAppId === app.id ? 'text-indigo-400' : 'opacity-0 group-hover:opacity-100'
              )}
            />
          </button>
        ))}

      </div>

      {/* Divider */}
      <div className="h-px bg-app-border mx-3" />

      {/* Node inspector */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        {selectedNode ? (
          // node inspect 
          // <>
          // <span>node insepct comp</span>
          // </>
          <NodeInspector node={selectedNode} onUpdateNode={onUpdateNode} />
        ) : (
          <div className="flex flex-col items-center justify-center h-full py-8 px-4 text-center">
            <div className="w-10 h-10 rounded-full bg-app-muted flex items-center justify-center mb-3">
              <span className="text-lg">🔍</span>
            </div>
            <p className="text-xs font-mono text-app-muted-fg leading-relaxed">
              Select a node on the canvas to inspect its configuration and runtime metrics.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
