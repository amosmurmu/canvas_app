import { useEffect } from 'react';
import { useAppStore } from '@/store';
import { AppPanel } from './AppPanel';
import type { AppNode } from '@/types';
import { cn } from '@/lib/utils';

interface MobileDrawerProps {
  selectedNode: AppNode | undefined;
  onUpdateNode: (id: string, data: Partial<AppNode['data']>) => void;
}

export function MobileDrawer({ selectedNode, onUpdateNode }: MobileDrawerProps) {
  const { isMobilePanelOpen, setMobilePanelOpen } = useAppStore();

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobilePanelOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [setMobilePanelOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-30 bg-black/60 backdrop-blur-sm transition-opacity lg:hidden',
          isMobilePanelOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={() => setMobilePanelOpen(false)}
      />
      {/* Drawer */}
      <div
        className={cn(
          'fixed right-0 top-0 bottom-0 z-40 w-80 transition-transform duration-300 lg:hidden',
          isMobilePanelOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <AppPanel
          selectedNode={selectedNode}
          onUpdateNode={onUpdateNode}
          isMobile
          onClose={() => setMobilePanelOpen(false)}
        />
      </div>
    </>
  );
}
