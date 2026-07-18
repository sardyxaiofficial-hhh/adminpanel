import { create } from 'zustand';

export type DateRangeType = 'today' | '7days' | '30days' | '90days' | 'custom';

interface BranchFilterState {
  selectedBranch: string; // 'all' or branch ID
  selectedDateRange: DateRangeType;
  customStartDate: string | null;
  customEndDate: string | null;
  setSelectedBranch: (branchId: string) => void;
  setSelectedDateRange: (range: DateRangeType) => void;
  setCustomDateRange: (start: string | null, end: string | null) => void;
}

export const useBranchFilter = create<BranchFilterState>((set) => ({
  selectedBranch: 'all',
  selectedDateRange: '30days',
  customStartDate: null,
  customEndDate: null,
  setSelectedBranch: (branchId) => set({ selectedBranch: branchId }),
  setSelectedDateRange: (range) => set({ selectedDateRange: range }),
  setCustomDateRange: (start, end) => set({ customStartDate: start, customEndDate: end }),
}));
