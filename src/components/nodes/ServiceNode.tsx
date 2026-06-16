import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { AppNode } from '@/types';
import { useAppStore } from '@/store';
import { cn } from '@/lib/utils';
import { AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import AWSIcon from '@/assets/images/AWS.svg?react';
import { MapIcon } from '@/components/common/MapIcon';

const statusConfig = {
  Healthy: { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/30' },
  Degraded: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' },
  Down: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30' },
} as const;

const statusIcon = {
  Healthy: <CheckCircle2 className="h-4 w-4 text-green-500" />,
  Degraded: <AlertTriangle className="h-4 w-4 text-amber-500" />,
  Down: <XCircle className="h-4 w-4 text-red-500" />,
} as const;

export const ServiceNodeComponent = ({
  data,
  id,
}: NodeProps<AppNode>) => {
  const setSelectedNode = useAppStore((s) => s.setSelectedNode);
  const selectedNodeId = useAppStore((s) => s.selectedNodeId);
  const selected = selectedNodeId === id;
  const cfg = statusConfig[data.status];
  return (
    <div
      onClick={() => setSelectedNode(id)}
      className={cn(
        'min-w-[240px] rounded-xl border bg-app-elevated transition-all duration-150 cursor-pointer select-none',
        selected
          ? 'border-indigo-500/80 shadow-[0_0_0_1px_rgba(99,102,241,0.4),0_8px_32px_rgba(99,102,241,0.15)]'
          : 'border-app-border shadow-lg hover:border-app-border-strong'
      )}
    >
      <Handle type="target" position={Position.Top}
        className="!w-2 !h-2 !bg-indigo-400 !border-none" />

      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-app-border">
        <div className="flex items-center gap-2">
          <MapIcon name={data.icon} size="md" color={data.color} showBackground />

          <span className="text-sm font-medium text-app-text font-mono">{data.label}</span>
        </div>
        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
          {data.price}
        </span>
      </div>

      {/* Stats */}
      <div className="px-3 pt-2">
        <div className="flex justify-between text-[10px] text-app-secondary font-mono mb-1">
          <span>{data.cpuValue.toFixed(2)}</span>
          <span>{data.memoryGB} GB</span>
          <span>{data.diskGB.toFixed(2)} GB</span>
          <span>{data.region}</span>
        </div>
        <div className="flex justify-between mb-2">
          {(['CPU', 'Memory', 'Disk', 'Region'] as const).map((tab) => (
            <span key={tab} className={cn(
              'text-[9px] px-2 py-0.5 rounded border font-mono',
              tab === 'CPU'
                ? 'bg-app-muted border-app-border-strong text-app-text'
                : 'border-transparent text-app-muted-fg'
            )}>
              {tab}
            </span>
          ))}
        </div>

        {/* CPU bar */}
        <div className="relative h-1.5 rounded-full bg-app-muted mb-2 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${data.cpuValue}%`,
              background: `linear-gradient(90deg, #6366f1, ${data.cpuValue >= 80 ? '#ef4444' : '#22c55e'})`,
            }}
          />
        </div>
        <div className="text-right text-[10px] font-mono text-app-secondary mb-2">
          {(data.cpuValue * 0.001).toFixed(2)}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-3 pb-2">
        <span className={cn(
          'text-[10px] font-mono px-2 py-0.5 rounded-full border flex items-center gap-1',
          cfg.bg, cfg.text, cfg.border
        )}>
          <span>{statusIcon[data.status]}</span>
          {data.status}
        </span>
        <AWSIcon className='w-6 h-6' />
      </div>

      <Handle type="source" position={Position.Bottom}
        className="!w-2 !h-2 !bg-indigo-400 !border-none" />
    </div>
  );
}

export const ServiceNode = memo(ServiceNodeComponent);
