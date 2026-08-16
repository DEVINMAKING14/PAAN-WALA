export interface Track {
  id: string;
  title: string;
  artist: string;
  youtubeId: string;
  duration: string;
  coverImage?: string;
}

export type CursorState = {
  active: boolean;
  label: string;
  variant: 'default' | 'paan' | 'music' | 'link' | 'explore' | 'flame';
};

export interface PaanFlavor {
  id: string;
  name: string;
  hindiName: string;
  description: string;
  price: string;
  specialty: string;
  ingredients: string[];
  color: string;
  isFire?: boolean;
}

export interface InteractiveHotspot {
  id: string;
  title: string;
  hindiTitle: string;
  x: number; // percentage
  y: number; // percentage
  width: number;
  height: number;
  cursorLabel: string;
  action: () => void;
  tooltip: string;
}
