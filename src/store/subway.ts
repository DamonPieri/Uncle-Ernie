// ─── Zustand Store — Subway State ─────────────────────────────────────────────
import { create } from 'zustand';
import { SubwayStop } from '@/constants/subway';

export type Trip = {
  id: string;
  name: string;
  createdAt: number;
  places: SavedPlace[];
};

export type SavedPlace = {
  id: string;
  name: string;
  category: string;
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
  trips: Trip[];

  setSelectedLine:     (line: string | null) => void;
  setCurrentStop:      (stop: SubwayStop | null) => void;
  saveStop:            (stop: SubwayStop) => void;
  unsaveStop:          (stopId: string) => void;
  isStopSaved:         (stopId: string) => boolean;
  savePlace:           (place: SavedPlace) => void;
  unsavePlace:         (placeId: string) => void;
  isPlaceSaved:        (placeId: string) => boolean;
  createTrip:          (name: string) => Trip;
  deleteTrip:          (tripId: string) => void;
  addPlaceToTrip:      (tripId: string, place: SavedPlace) => void;
  removePlaceFromTrip: (tripId: string, placeId: string) => void;
  isPlaceInTrip:       (tripId: string, placeId: string) => boolean;
  clearSelection:      () => void;
};

export const useSubwayStore = create<SubwayStore>((set, get) => ({
  selectedLine: null,
  currentStop:  null,
  savedStops:   [],
  savedPlaces:  [],
  trips:        [],

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

  createTrip: (name) => {
    const trip: Trip = { id: Date.now().toString(), name, createdAt: Date.now(), places: [] };
    set((state) => ({ trips: [trip, ...state.trips] }));
    return trip;
  },

  deleteTrip: (tripId) =>
    set((state) => ({ trips: state.trips.filter((t) => t.id !== tripId) })),

  addPlaceToTrip: (tripId, place) =>
    set((state) => ({
      trips: state.trips.map((t) =>
        t.id !== tripId ? t :
        t.places.some((p) => p.id === place.id) ? t :
        { ...t, places: [...t.places, place] }
      ),
    })),

  removePlaceFromTrip: (tripId, placeId) =>
    set((state) => ({
      trips: state.trips.map((t) =>
        t.id !== tripId ? t : { ...t, places: t.places.filter((p) => p.id !== placeId) }
      ),
    })),

  isPlaceInTrip: (tripId, placeId) =>
    get().trips.find((t) => t.id === tripId)?.places.some((p) => p.id === placeId) ?? false,

  clearSelection: () => set({ selectedLine: null, currentStop: null }),
}));
