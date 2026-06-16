import { useCallback, useState, useEffect } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import * as Slider from '@radix-ui/react-slider';
import { useAppStore } from '@/store';
import type { AppNode, ServiceStatus } from '@/types';
import { cn } from '@/lib/utils';
import { MapIcon } from '@/components/common/MapIcon';

interface NodeInspectorProps {
  node: AppNode;
  onUpdateNode: (id: string, data: Partial<AppNode['data']>) => void;
}

const statusColors: Record<ServiceStatus, string> = {
  Healthy: 'bg-green-500/15 text-green-400 border-green-500/30',
  Degraded: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  Down: 'bg-red-500/15 text-red-400 border-red-500/30',
};

const inputClass =
  'w-full bg-app-input border border-app-border-strong rounded-md px-3 py-1.5 text-xs font-mono text-app-text focus:outline-none focus:border-indigo-500 transition-colors';

export function NodeInspector({ node, onUpdateNode }: NodeInspectorProps) {
  const { activeInspectorTab, setActiveInspectorTab } = useAppStore();
  const [labelValue, setLabelValue] = useState(node.data.label);
  const [descValue, setDescValue] = useState(node.data.description ?? '');
  const [cpuInput, setCpuInput] = useState(String(node.data.cpuValue));

  // Sync when node changes
  useEffect(() => {
    setLabelValue(node.data.label);
    setDescValue(node.data.description ?? '');
    setCpuInput(String(node.data.cpuValue));
  }, [node.id, node.data.label, node.data.description, node.data.cpuValue]);

  const handleSliderChange = useCallback(
    (values: number[]) => {
      const val = values[0] ?? 0;
      setCpuInput(String(val));
      onUpdateNode(node.id, { cpuValue: val });
    },
    [node.id, onUpdateNode]
  );

  const handleCpuInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setCpuInput(e.target.value);
      const parsed = parseFloat(e.target.value);
      if (!isNaN(parsed) && parsed >= 0 && parsed <= 100) {
        onUpdateNode(node.id, { cpuValue: parsed });
      }
    },
    [node.id, onUpdateNode]
  );

  const handleLabelBlur = useCallback(() => {
    onUpdateNode(node.id, { label: labelValue });
  }, [node.id, labelValue, onUpdateNode]);

  const handleDescBlur = useCallback(() => {
    onUpdateNode(node.id, { description: descValue });
  }, [node.id, descValue, onUpdateNode]);

  const handleStatusChange = useCallback(
    (status: ServiceStatus) => {
      onUpdateNode(node.id, { status });
    },
    [node.id, onUpdateNode]
  );
  return (
    <div className="flex flex-col h-full">
      {/* Inspector Header */}
      <div className="px-4 py-3 border-b border-app-border">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <MapIcon name={node.data.icon} size="lg" color={node.data.color} showBackground />
            <span className="text-sm font-mono font-semibold text-app-text">
              {node.data.label}
            </span>
          </div>
          <span
            className={cn(
              'text-[10px] font-mono px-2 py-0.5 rounded-full  border',
              statusColors[node.data.status]
            )}
          >
            {node.data.status}
          </span>
        </div>
        {/* Status switcher */}
        <div className="flex gap-1 mt-2">
          {(['Healthy', 'Degraded', 'Down'] as ServiceStatus[]).map((s) => (
            <button
              key={s}
              onClick={() => handleStatusChange(s)}
              className={cn(
                'text-[9px] font-mono px-2 py-1 rounded-md cursor-pointer border transition-all',
                node.data.status === s
                  ? statusColors[s]
                  : 'border-app-border text-app-muted-fg hover:border-app-border-strong'
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <Tabs.Root
        value={activeInspectorTab}
        onValueChange={(v: string) => setActiveInspectorTab(v as 'config' | 'runtime' | 'devtools')}
        className="flex flex-col flex-1 min-h-0"
      >
        <Tabs.List className="flex px-4 pt-2 border-b border-app-border gap-4">
          {(['config', 'runtime', 'devtools'] as const).map((tab) => (
            <Tabs.Trigger
              key={tab}
              value={tab}
              className={cn(
                'pb-2 text-xs font-mono capitalize cursor-pointer border-b-2 transition-all -mb-px',
                activeInspectorTab === tab
                  ? 'border-indigo-500 text-app-text'
                  : 'border-transparent text-app-muted-fg hover:text-app-secondary'
              )}
            >
              {tab}
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        {/* Config Tab */}
        <Tabs.Content
          value="config"
          className="flex-1 overflow-y-auto px-4 py-3 space-y-4"
        >
          {/* Node name */}
          <div>
            <label className="block text-[10px] font-mono text-app-secondary mb-1 uppercase tracking-wider">
              Service Name
            </label>
            <input
              value={labelValue}
              onChange={(e) => setLabelValue(e.target.value)}
              onBlur={handleLabelBlur}
              className={inputClass}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-[10px] font-mono text-app-secondary mb-1 uppercase tracking-wider">
              Description
            </label>
            <textarea
              value={descValue}
              onChange={(e) => setDescValue(e.target.value)}
              onBlur={handleDescBlur}
              rows={2}
              className={`${inputClass} resize-none`}
            />
          </div>

          {/* CPU Slider */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[10px] font-mono text-app-secondary uppercase tracking-wider">
                CPU Usage
              </label>
              <input
                type="number"
                min={0}
                max={100}
                value={cpuInput}
                onChange={handleCpuInputChange}
                className="w-16 text-right bg-app-input border border-app-border-strong rounded px-2 py-0.5 text-xs font-mono text-app-text focus:outline-none focus:border-indigo-500"
              />
            </div>
            <Slider.Root
              min={0}
              max={100}
              step={1}
              value={[node.data.cpuValue]}
              onValueChange={handleSliderChange}
              className="relative flex items-center w-full h-5 select-none touch-none"
            >
              <Slider.Track className="relative bg-app-muted rounded-full h-1.5 flex-1">
                <Slider.Range
                  className="absolute h-full rounded-full"
                  style={{
                    background: `linear-gradient(90deg, #6366f1, #22c55e)`,
                  }}
                />
              </Slider.Track>
              <Slider.Thumb
                className="block w-4 h-4 bg-white rounded-full shadow-md border-2 border-indigo-500 focus:outline-none hover:scale-110 transition-transform cursor-grab active:cursor-grabbing"
              />
            </Slider.Root>
          </div>

          {/* Pricing */}
          <div>
            <label className="block text-[10px] font-mono text-app-secondary mb-1 uppercase tracking-wider">
              Hourly Cost
            </label>
            <div className="bg-app-input border border-app-border-strong rounded-md px-3 py-1.5 text-xs font-mono text-emerald-400">
              {node.data.price}
            </div>
          </div>
        </Tabs.Content>

        {/* Runtime Tab */}
        <Tabs.Content
          value="runtime"
          className="flex-1 overflow-y-auto px-4 py-3 space-y-4"
        >
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Memory', value: `${node.data.memoryGB} GB` },
              { label: 'Disk', value: `${node.data.diskGB} GB` },
              { label: 'Region', value: `${node.data.region}` },
              { label: 'Provider', value: 'AWS' },
            ].map(({ label, value }) => (
              <div key={label} className="bg-app-muted rounded-lg p-3">
                <div className="text-[9px] font-mono text-app-muted-fg uppercase tracking-wider mb-1">
                  {label}
                </div>
                <div className="text-xs font-mono text-app-text">{value}</div>
              </div>
            ))}
          </div>

          {/* Metrics */}
          <div>
            <label className="block text-[10px] font-mono text-app-secondary mb-2 uppercase tracking-wider">
              Live Metrics
            </label>
            <div className="space-y-2">
              {[
                { name: 'CPU', val: node.data.cpuValue, max: 100, unit: '%' },
                { name: 'Memory', val: Math.round(node.data.memoryGB * 1000), max: 512, unit: 'MB' },
              ].map(({ name, val, max, unit }) => (
                <div key={name}>
                  <div className="flex justify-between text-[9px] font-mono text-app-muted-fg mb-1">
                    <span>{name}</span>
                    <span>{val}{unit} / {max}{unit}</span>
                  </div>
                  <div className="h-1 bg-app-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${(val / max) * 100}%`,
                        background: val / max > 0.8
                          ? 'linear-gradient(90deg,#f59e0b,#ef4444)'
                          : 'linear-gradient(90deg,#6366f1,#22c55e)',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Node ID */}
          <div>
            <label className="block text-[10px] font-mono text-app-secondary mb-1 uppercase tracking-wider">
              Node ID
            </label>
            <div className="bg-app-input border border-app-border-strong rounded-md px-3 py-1.5 text-[10px] font-mono text-app-muted-fg truncate">
              {node.id}
            </div>
          </div>
        </Tabs.Content>

        {/* Devtools Tab */}
        <Tabs.Content
          value="devtools"
          className="flex-1 overflow-y-auto px-4 py-3"
        >
          <p className="text-xs font-mono text-app-secondary leading-relaxed">
            Node debug overlays are shown on the canvas below each node. Switch back to Config or Runtime to hide them.
          </p>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}
