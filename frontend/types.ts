export type Point = {
  x: number;
  y: number;
};

export enum Direction {
  UP = 'UP',
  DOWN = 'DOWN',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT'
}

export type Track = {
  id: string;
  title: string;
  duration: string;
};

export type GameState = {
  snake: Point[];
  food: Point;
  direction: Direction;
  gameOver: boolean;
  score: number;
  isPlaying: boolean;
};
