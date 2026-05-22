// ─── MTA Subway Lines ─────────────────────────────────────────────────────────
// All 24 lines displayed in the line selector grid.

export type SubwayLine = {
  id: string;
  color: string;
  darkText?: boolean; // true for yellow lines (N/Q/R/W)
};

export const SUBWAY_LINES: SubwayLine[] = [
  { id: '1', color: '#EE352E' },
  { id: '2', color: '#EE352E' },
  { id: '3', color: '#EE352E' },
  { id: '4', color: '#00933C' },
  { id: '5', color: '#00933C' },
  { id: '6', color: '#00933C' },
  { id: '7', color: '#B933AD' },
  { id: 'A', color: '#0039A6' },
  { id: 'C', color: '#0039A6' },
  { id: 'E', color: '#0039A6' },
  { id: 'B', color: '#FF6319' },
  { id: 'D', color: '#FF6319' },
  { id: 'F', color: '#FF6319' },
  { id: 'M', color: '#FF6319' },
  { id: 'G', color: '#6CBE45' },
  { id: 'J', color: '#996633' },
  { id: 'Z', color: '#996633' },
  { id: 'L', color: '#A7A9AC' },
  { id: 'N', color: '#FCCC0A', darkText: true },
  { id: 'Q', color: '#FCCC0A', darkText: true },
  { id: 'R', color: '#FCCC0A', darkText: true },
  { id: 'W', color: '#FCCC0A', darkText: true },
  { id: 'S', color: '#808183' },
  { id: 'SIR', color: '#0039A6' },
];

// ─── Sample Stop Data (placeholder until GTFS processing) ──────────────────
export type SubwayStop = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  lines: string[];
  borough: string;
  neighborhood: string;
};

export const SAMPLE_STOPS: SubwayStop[] = [
  { id: 'A31', name: 'Rockaway Blvd',    lat: 40.6651, lng: -73.8435, lines: ['A'],     borough: 'Queens',   neighborhood: 'Far Rockaway'       },
  { id: 'L06', name: 'Morgan Ave',       lat: 40.7061, lng: -73.9330, lines: ['L'],     borough: 'Brooklyn', neighborhood: 'East Williamsburg'  },
  { id: '701', name: 'Flushing–Main St', lat: 40.7596, lng: -73.8300, lines: ['7'],     borough: 'Queens',   neighborhood: 'Flushing'           },
  { id: 'D43', name: 'Brighton Beach',   lat: 40.5781, lng: -73.9612, lines: ['B','Q'], borough: 'Brooklyn', neighborhood: 'Brighton Beach'     },
  { id: 'G22', name: 'Bedford–Nostrand', lat: 40.6898, lng: -73.9551, lines: ['G'],     borough: 'Brooklyn', neighborhood: 'Bedford-Stuyvesant' },
  { id: 'J19', name: 'Cypress Hills',    lat: 40.6898, lng: -73.8703, lines: ['J'],     borough: 'Brooklyn', neighborhood: 'Cypress Hills'      },
  { id: '122', name: '191 St',           lat: 40.8558, lng: -73.9291, lines: ['1'],     borough: 'Manhattan', neighborhood: 'Washington Heights' },
  { id: 'N08', name: 'Ditmars Blvd',     lat: 40.7747, lng: -73.9123, lines: ['N','W'], borough: 'Queens',   neighborhood: 'Astoria'            },
];

export function getRandomStop(line?: string): SubwayStop {
  const pool = line
    ? SAMPLE_STOPS.filter((s) => s.lines.includes(line))
    : SAMPLE_STOPS;
  const candidates = pool.length > 0 ? pool : SAMPLE_STOPS;
  return candidates[Math.floor(Math.random() * candidates.length)];
}
