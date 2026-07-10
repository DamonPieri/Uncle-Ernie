// ─── Zustand Store — Subway State ─────────────────────────────────────────────
import { create } from 'zustand';
import { SubwayStop } from '@/constants/subway';

export type SavedPlace = {
  id: string;
  name: string;
  emoji: string;
  tag: string;
  rating: number;
  dist: string;
  open: boolean;
  // subway context
  line: string;
  stopName: string;
  stopId: string;
  savedAt: number;
};

type SubwayStore = {
  selectedLine: string | null;
  currentStop: SubwayStop | null;
  savedStops: SubwayStop[];
  savedPlaces: SavedPlace[];

  setSelectedLine: (line: string | null) => void;
  setCurrentStop:  (stop: SubwayStop | null) => void;
  saveStop:        (stop: SubwayStop) => void;
  unsaveStop:      (stopId: string) => void;
  isStopSaved:     (stopId: string) => boolean;
  savePlace:       (place: SavedPlace) => void;
  unsavePlace:     (placeId: string) => void;
  isPlaceSaved:    (placeId: string) => boolean;
  clearSelection:  () => void;
};

export const useSubwayStore = create<SubwayStore>((set, get) => ({
  selectedLine: null,
  currentStop:  null,
  savedStops:   [],
  savedPlaces:  [],

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

  savePlace: (place) =>
    set((state) => ({
      savedPlaces: state.savedPlaces.some((p) => p.id === place.id)
        ? state.savedPlaces
        : [place, ...state.savedPlaces],
    })),

  unsavePlace: (placeId) =>
    set((state) => ({
      savedPlaces: state.savedPlaces.filter((p) => p.id !== placeId),
    })),

  isPlaceSaved: (placeId) => get().savedPlaces.some((p) => p.id === placeId),

  clearSelection: () => set({ selectedLine: null, currentStop: null }),
}));
