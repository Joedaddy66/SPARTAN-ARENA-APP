
export enum Player {
  Spartan = 'X',
  Persian = 'O',
  None = '',
}

export enum GameState {
    Playing = 'PLAYING',
    Won = 'WON',
    Lost = 'LOST',
    Draw = 'DRAW'
}

export type CellState = Player;

export type BoardState = CellState[];

export interface DailyOrder {
  id: number;
  description: string;
  target: number;
  progress: number;
  requiredPlayer?: Player;
  requiredOutcome?: 'win' | 'loss' | 'draw';
}
