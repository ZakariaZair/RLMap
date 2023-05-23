export interface Player {
  position: {
    x: number;
    y: number;
  };
  velocity?: {
    x: number;
    y: number;
  };
  height?: number;
  hitbox?: {
    L: number;
    l: number;
    h: number;
  };
}

export interface Ball {
  position: {
    x: number;
    y: number;
  };
  velocity: {
    x: number;
    y: number;
  };
  height: number;
  radius: number;
}
