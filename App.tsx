

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Player, BoardState, DailyOrder, GameState } from './types';
import { getAIMove } from './services/aiService';
import {
  playPlaceMarkSound,
  playWinSound,
  playLoseSound,
  playDrawSound,
  playResetSound,
} from './services/audioService';
import GameBoard from './components/GameBoard';
import GameStatus from './components/GameStatus';
import DailyOrders from './components/DailyOrders';

const INITIAL_BOARD: BoardState = Array(9).fill(Player.None);

const INITIAL_ORDERS: DailyOrder[] = [
  { id: 1, description: 'Win 1 Game as Spartan', target: 1, progress: 0, requiredPlayer: Player.Spartan, requiredOutcome: 'win' },
  { id: 2, description: 'Play 3 Games', target: 3, progress: 0 },
  { id: 3, description: 'Achieve a Draw', target: 1, progress: 0, requiredOutcome: 'draw' },
];

const checkWinner = (board: BoardState): Player | null => {
  const winningCombos = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6]             // diagonals
  ];

  for (const combo of winningCombos) {
    const [a, b, c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }

  return null;
};

const App: React.FC = () => {
  const [board, setBoard] = useState<BoardState>(INITIAL_BOARD);
  const [currentPlayer, setCurrentPlayer] = useState<Player>(Player.Spartan);
  const [gameState, setGameState] = useState<GameState>(GameState.Playing);
  const [dailyOrders, setDailyOrders] = useState<DailyOrder[]>(INITIAL_ORDERS);
  const [isAiThinking, setIsAiThinking] = useState<boolean>(false);
  const [playerSide] = useState<Player>(Player.Spartan);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  const prevBoardRef = useRef<BoardState>(board);
  const aiSide = playerSide === Player.Spartan ? Player.Persian : Player.Spartan;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientWidth, clientHeight } = e.currentTarget;
    const { clientX, clientY } = e;
    
    // Get mouse position relative to the element's center
    const rect = e.currentTarget.getBoundingClientRect();
    const x = clientX - rect.left - clientWidth / 2;
    const y = clientY - rect.top - clientHeight / 2;
    
    const maxRotation = 12; // degrees
    
    // Calculate rotation based on mouse position
    const newRotationY = (x / (clientWidth / 2)) * maxRotation;
    const newRotationX = (-y / (clientHeight / 2)) * maxRotation;

    setRotation({ x: newRotationX, y: newRotationY });
  };

  const handleMouseLeave = () => {
      // Reset rotation with a smooth transition
      setRotation({ x: 0, y: 0 });
  };


  const updateDailyOrders = useCallback((outcome: 'win' | 'loss' | 'draw') => {
    setDailyOrders(prevOrders => {
      return prevOrders.map(order => {
        if (order.progress >= order.target) return order;

        let progressIncrement = 0;
        if (!order.requiredOutcome && !order.requiredPlayer) {
          progressIncrement = 1;
        }
        else if (order.requiredOutcome === outcome) {
            if(order.requiredPlayer) {
                if(outcome === 'win' && playerSide === order.requiredPlayer) {
                    progressIncrement = 1;
                }
            } else {
                progressIncrement = 1;
            }
        }
        
        const newProgress = Math.min(order.progress + progressIncrement, order.target);
        return { ...order, progress: newProgress };
      });
    });
  }, [playerSide]);

  const handleGameEnd = useCallback((winner: Player | null) => {
    if (winner) {
      // FIX: Corrected typo from `playerside` to `playerSide`.
      const isWin = winner === playerSide;
      setGameState(isWin ? GameState.Won : GameState.Lost);
      updateDailyOrders(isWin ? 'win' : 'loss');
      if (isWin) playWinSound(); else playLoseSound();
    } else {
      setGameState(GameState.Draw);
      updateDailyOrders('draw');
      playDrawSound();
    }
  }, [playerSide, updateDailyOrders]);
  
  const processBoardChange = useCallback((newBoard: BoardState) => {
    const winner = checkWinner(newBoard);
    const isDraw = !newBoard.includes(Player.None);

    if (winner || isDraw) {
      handleGameEnd(winner);
    } else {
      setCurrentPlayer(prev => (prev === Player.Spartan ? Player.Persian : Player.Spartan));
    }
  }, [handleGameEnd]);
  
  const handleCellClick = (index: number) => {
    if (board[index] !== Player.None || gameState !== GameState.Playing || currentPlayer !== playerSide) {
      return;
    }
    const newBoard = [...board];
    newBoard[index] = playerSide;
    setBoard(newBoard);
    processBoardChange(newBoard);
  };

  const resetGame = () => {
    playResetSound();
    setBoard(INITIAL_BOARD);
    setCurrentPlayer(Player.Spartan);
    setGameState(GameState.Playing);
  };

  useEffect(() => {
    const currentMarks = board.filter(cell => cell !== Player.None).length;
    const prevMarks = prevBoardRef.current.filter(cell => cell !== Player.None).length;
    if (currentMarks > prevMarks) playPlaceMarkSound();
    prevBoardRef.current = board;
  }, [board]);

  useEffect(() => {
    if (currentPlayer === aiSide && gameState === GameState.Playing) {
      const performAiMove = async () => {
        setIsAiThinking(true);
        try {
          const move = await getAIMove(board, playerSide, aiSide);
          if (board[move] === Player.None) {
            const newBoard = [...board];
            newBoard[move] = aiSide;
            setBoard(newBoard);
            processBoardChange(newBoard);
          } else {
            const fallbackMove = board.findIndex(cell => cell === Player.None);
            if (fallbackMove !== -1) {
                const newBoard = [...board];
                newBoard[fallbackMove] = aiSide;
                setBoard(newBoard);
                processBoardChange(newBoard);
            }
          }
        } catch (error) {
          console.error("Error getting AI move:", error);
        } finally {
          setIsAiThinking(false);
        }
      };
      
      const timeoutId = setTimeout(performAiMove, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [currentPlayer, gameState, board, aiSide, playerSide, processBoardChange]);


  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center p-4 bg-cover bg-center" style={{backgroundImage: "url('https://picsum.photos/seed/spartan/1920/1080')"}}>
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <div className="relative z-10 w-full max-w-4xl flex flex-col md:flex-row gap-8 items-center">
            
            <div 
              className="w-full md:w-2/3 h-[550px] flex items-center justify-center" 
              style={{ perspective: '1200px' }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <main 
                className="w-full flex flex-col items-center bg-slate-900/60 backdrop-blur-sm p-6 rounded-2xl border border-yellow-600/30 shadow-2xl shadow-yellow-900/50"
                style={{
                  transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
                  transition: 'transform 0.2s cubic-bezier(0.23, 1, 0.32, 1)',
                  transformStyle: 'preserve-3d',
                }}
              >
                  <h1 className="text-4xl md:text-5xl font-bold text-yellow-500 tracking-wider mb-2 uppercase" style={{transform: 'translateZ(40px)'}}>Spartan Arena</h1>
                  <GameStatus gameState={gameState} currentPlayer={currentPlayer} playerSide={playerSide} isAiThinking={isAiThinking} />
                  <GameBoard board={board} onCellClick={handleCellClick} disabled={gameState !== GameState.Playing || currentPlayer !== playerSide || isAiThinking} />
                  {gameState !== GameState.Playing && (
                      <button 
                          onClick={resetGame}
                          className="mt-6 px-8 py-3 bg-yellow-600 text-gray-900 font-bold rounded-md hover:bg-yellow-500 transition-colors duration-300 uppercase tracking-widest text-lg shadow-lg hover:shadow-yellow-500/50"
                          style={{transform: 'translateZ(40px)'}}
                      >
                          New Battle
                      </button>
                  )}
              </main>
            </div>

            <aside className="w-full md:w-1/3">
                <DailyOrders orders={dailyOrders} />
            </aside>
        </div>
    </div>
  );
};

export default App;