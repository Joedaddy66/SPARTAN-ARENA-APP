
import React from 'react';
import { BoardState, Player } from '../types';
import SpartanIcon from './icons/SpartanIcon';
import PersianIcon from './icons/PersianIcon';

interface GameBoardProps {
  board: BoardState;
  onCellClick: (index: number) => void;
  disabled: boolean;
}

const GameBoard: React.FC<GameBoardProps> = ({ board, onCellClick, disabled }) => {
  const renderCellContent = (player: Player) => {
    switch (player) {
      case Player.Spartan:
        return <SpartanIcon className="w-12 h-12 md:w-16 md:h-16 text-red-500 filter drop-shadow-lg" />;
      case Player.Persian:
        return <PersianIcon className="w-12 h-12 md:w-16 md:h-16 text-blue-400 filter drop-shadow-lg" />;
      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-3 gap-3 md:gap-4 mt-6" style={{ transformStyle: 'preserve-3d', transform: 'translateZ(20px)' }}>
      {board.map((cell, index) => (
        <button
          key={index}
          onClick={() => onCellClick(index)}
          disabled={disabled || cell !== Player.None}
          className={`
            w-24 h-24 md:w-32 md:h-32 
            bg-slate-800/40 backdrop-blur-sm
            border border-yellow-700/30
            flex items-center justify-center 
            rounded-lg
            transition-all duration-300 
            focus:outline-none focus:ring-2 focus:ring-yellow-500
            ${!disabled && cell === Player.None ? 'cursor-pointer hover:border-yellow-500 hover:[transform:translateZ(40px)]' : 'cursor-not-allowed'}
          `}
          style={{
            transformStyle: 'preserve-3d',
            transform: 'translateZ(20px)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
          }}
        >
          <div className="transform scale-100 transition-transform duration-300 ease-out">
            {renderCellContent(cell)}
          </div>
        </button>
      ))}
    </div>
  );
};

export default GameBoard;