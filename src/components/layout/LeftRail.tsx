import { cn } from "@/lib/utils";
import { Network } from 'lucide-react';
import GithubIcon from '@/assets/images/GitHub.svg?react';
import PostgresIcon from '@/assets/images/PostgresSQL.svg?react';
import RedisIcon from '@/assets/images/Redis.svg?react';
import MongoDBIcon from '@/assets/images/MongoDB.svg?react';
import PackagesIcon from '@/assets/images/bulb.svg?react';
import LayoutIcon from '@/assets/images/layout-template.svg?react';

const NAV_ITEMS = [
  {
    icon: GithubIcon,
    label: 'GitHub',
    bgClass: 'bg-zinc-800',
    iconClass: 'text-foreground',
    active: false
  },
  { icon: PostgresIcon, label: 'Postgres', active: false },
  { icon: RedisIcon, label: 'Redis', active: false },
  { icon: MongoDBIcon, label: 'MongoDB', active: false },
  {
    icon: PackagesIcon,
    label: 'Packages',
    iconClass: 'text-amber-500',
    active: false
  },
  {
    icon: LayoutIcon,
    label: 'Dashboard',
    bgClass: 'bg-yellow-500/20',
    iconClass: 'text-yellow-400',
    active: false
  },
  {
    icon: Network,
    label: 'Network',
    bgClass: 'bg-green-500/20',
    iconClass: 'text-green-400',
    active: false
  },
];

// TODO
const handleNewNode = () => {

}

export function LeftRail() {
  return (
    <div className="absolute left-1 top-58 -translate-y-1/2 z-30">
      <div className="w-12 flex flex-col items-center py-2 gap-2 border-r rounded-sm border-app-border bg-app-surface shrink-0">
        {NAV_ITEMS.map(({ icon: Icon, label, active, iconClass }) => (
          <button
            key={label}
            title={label}
            onClick={handleNewNode}
            className={cn(
              'w-8 h-8 flex items-center justify-center rounded-lg text-base cursor-pointer transition-all hover:bg-app-muted text-app-secondary',
              active ? 'bg-app-muted ring-1 ring-indigo-500/40' : ''
            )}
          >
            <Icon size={18} className={iconClass} />
          </button>
        ))}
      </div>
    </div>
  );
}
