export type TimePeriod = 'day' | 'week' | 'month' | 'quarter' | 'year';

export type FilterOption = {
  id: TimePeriod;
  label: string;
};

export const timeFilters: FilterOption[] = [
  { id: 'day', label: 'هذا اليوم' },
  { id: 'week', label: 'هذا الأسبوع' },
  { id: 'month', label: 'هذا الشهر' },
  { id: 'quarter', label: 'هذا الربع' },
  { id: 'year', label: 'هذا العام' },
];