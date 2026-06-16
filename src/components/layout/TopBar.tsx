import { useAppStore } from '@/store';
import mortyPfp from '@/assets/images/morty-smith_pfp.jpg';

import { Share2, PanelRight, Maximize2, Ellipsis, Settings2, ChevronDown } from 'lucide-react';
import { ThemeToggle } from '../theme/ToggleTheme';

interface TopBarProps {
  appName: string;
  onFitView: () => void;
}

const actionBtnClass =
  'p-1.5 rounded-md cursor-pointer text-app-secondary hover:text-app-text hover:bg-app-muted transition-all';

export function TopBar({ appName, onFitView }: TopBarProps) {
  const toggleMobilePanel = useAppStore((s) => s.toggleMobilePanel);

  return (
    <div className="h-12 flex items-center justify-between px-4 border-b border-app-border bg-app-surface shrink-0 z-10">
      {/* Left: Brand + app selector */}
      <div className="flex items-center gap-3">
        {/* Brand mark */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <span className="text-[10px] text-white font-bold cursor-pointer">
              <Settings2 size={18} />
            </span>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 bg-app-muted rounded-lg px-3 py-1 border border-app-border-strong">
          <button className="w-5 h-5 rounded-full overflow-hidden cursor-pointer">
            <img src={mortyPfp} alt='morty pfp' className='w-full h-full object-cover' />
          </button>
          <span className="text-xs font-mono text-app-text">{appName}</span>
          <ChevronDown size={18} className="cursor-pointer text-app-secondary" />
          <Ellipsis size={18} className="cursor-pointer text-app-secondary" />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={onFitView}
          title="Fit view"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md cursor-pointer text-app-secondary hover:text-app-text hover:bg-app-muted transition-all text-xs font-mono"
        >
          <Maximize2 size={13} />
          <span className="hidden sm:block">Fit</span>
        </button>

        <div className="w-px h-5 bg-app-border" />

        <button className={actionBtnClass}>
          <Share2 size={15} />
        </button>
        <ThemeToggle />

        {/* Mobile panel toggle */}
        <button
          className={`lg:hidden ${actionBtnClass}`}
          onClick={toggleMobilePanel}
        >
          <PanelRight size={15} />
        </button>

        <button className="w-8 h-8 rounded-full overflow-hidden cursor-pointer">
          <img
            src={mortyPfp}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </button>
      </div>
    </div>
  );
}
