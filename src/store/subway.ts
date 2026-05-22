// ─── Zustand Store — Subway State ─────────────────────────────────────────────
import { create } from 'zustand';
import { SubwayStop } from '@/constants/subway';

type SubwayStore = {
  // Selection state
  selectedLine: string | null;
  currentStop: SubwayStop | null;
  savedStops: SubwayStop[];

  // Actions
  setSelectedLine: (line: string | null) => void;
  setCurrentStop:  (stop: SubwayStop | null) => void;
  saveStop:        (stop: SubwayStop) => void;
  unsaveStop:      (stopId: string) => void;
  isStopSaved:     (stopId: string) => boolean;
  clearSelection:  () => void;
};

export const useSubwayStore = create<SubwayStore>((set, get) => ({
  selectedLine: null,
  currentStop:  null,
  savedStops:   [],

  setSelectedLine: (line) => set({ selectedLine: line }),
  setCurrentStop:  (stop) => set({ currentStop: stop }),

  saveStop: (stop) =>
    set((state) => ({
      savedStops: state.savedStops.some((s) => s.id === stop.id)
        ? state.savedStops
        : [stop, ...state.savedStops],
    })),

  unsaveStop: (stopId) =>
    set((state) => ({
      savedStops: state.savedStops.filter((s) => s.id !== stopId),
    })),

  isStopSaved: (stopId) => get().savedStops.some((s) => s.id === stopId),

  clearSelection: () => set({ selectedLine: null, currentStop: null }),
}));
