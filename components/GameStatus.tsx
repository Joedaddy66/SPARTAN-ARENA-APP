
import React from 'react';
import { GameState, Player } from '../types';

interface GameStatusProps {
  gameState: GameState;
  currentPlayer: Player;
  playerSide: Player;
  isAiThinking: boolean;
}

const GameStatus: React.FC<GameStatusProps> = ({ gameState, currentPlayer, playerSide, isAiThinking }) => {
  const getStatusMessage = () => {
    switch (gameState) {
      case GameState.Won:
        return "Victory is Yours, Spartan!";
      case GameState.Lost:
        return "Defeated... Return Stronger!";
      case GameState.Draw:
        return "A Stalemate in the Arena!";
      case GameState.Playing:
        if (isAiThinking) {
          return "The Enemy Strategizes...";
        }
        return currentPlayer === playerSide ? "Your Move, Warrior" : "Awaiting Enemy Move";
      default:
        return "The Arena Awaits";
    }
  };

  const getStatusColor = () => {
    switch (gameState) {
        case GameState.Won: return 'text-green-400';
        case GameState.Lost: return 'text-red-500';
        case GameState.Draw: return 'text-gray-400';
        default: return 'text-yellow-400';
    }
  }

  return (
    <div className={`text-center mt-4 p-2 rounded-lg`}>
      <p className={`text-xl md:text-2xl font-semibold tracking-wider transition-colors duration-300 ${getStatusColor()}`}>
        {getStatusMessage()}
      </p>
    </div>
  );
};

export default GameStatus;
