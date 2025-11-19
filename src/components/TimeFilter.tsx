import { type TimePeriod, type FilterOption, timeFilters } from '@/lib/types';
import { RefreshCw } from 'lucide-react';

interface TimeFilterProps {
  selectedPeriod: TimePeriod;
  onPeriodChange: (period: TimePeriod) => void;
  onRefresh?: () => void;
}

export function TimeFilter({ selectedPeriod, onPeriodChange, onRefresh }: TimeFilterProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center bg-black/[0.02] dark:bg-white/[0.02] rounded-lg p-1">
        {timeFilters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => onPeriodChange(filter.id)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
              selectedPeriod === filter.id
                ? 'bg-blue-500 text-white shadow-sm'
                : 'text-muted-foreground hover:text-foreground dark:text-white/70 dark:hover:text-white'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>
      {onRefresh && (
        <button
          onClick={onRefresh}
          className="p-2 rounded-md hover:bg-black/[0.02] dark:hover:bg-white/[0.02] text-muted-foreground hover:text-foreground dark:text-white/70 dark:hover:text-white transition-colors"
        >
          <RefreshCw size={20} />
        </button>
      )}
    </div>
  );
}