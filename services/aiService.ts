
import { GoogleGenAI } from "@google/genai";
import { BoardState, Player } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAIMove = async (board: BoardState, playerMark: Player, aiMark: Player): Promise<number> => {
  const prompt = `
    You are an expert Tic-Tac-Toe AI opponent.
    The user is playing as '${playerMark}'. You are playing as '${aiMark}'.
    The board is represented as a 9-element array. The indices are 0-8, from top-left to bottom-right.
    Here is the current board state: ${JSON.stringify(board)}.
    An empty string "" means the cell is empty.
    
    Your task is to return the index of the single best move for you ('${aiMark}') to make.
    Analyze the board to win if possible. If you cannot win, block the user from winning. 
    If neither is possible, make a strategic move (e.g., take the center or a corner).
    
    Return only a single number from 0 to 8 representing the index of your chosen cell. Do not return any other text or explanation.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        // Disable thinking for low-latency game moves
        thinkingConfig: { thinkingBudget: 0 },
        // Ensure response is a plain string
        responseMimeType: "text/plain",
      },
    });

    const moveText = response.text.trim();
    const move = parseInt(moveText, 10);

    if (isNaN(move) || move < 0 || move > 8) {
      console.error(`Gemini returned an invalid move index: "${moveText}"`);
      throw new Error("Invalid move from AI");
    }

    if (board[move] !== Player.None) {
      console.warn(`Gemini chose an already occupied cell: ${move}. This is a hallucination.`);
      // If the AI hallucinates, we can find the first available spot as a fallback.
      const firstEmptyCell = board.findIndex(cell => cell === Player.None);
      if (firstEmptyCell !== -1) return firstEmptyCell;
      throw new Error("AI chose occupied cell and no other moves are available.");
    }
    
    return move;

  } catch (error) {
    console.error("Error generating AI move:", error);
    // As a last resort, return the first available empty cell.
    const fallbackMove = board.findIndex(cell => cell === Player.None);
    if (fallbackMove !== -1) {
        return fallbackMove;
    }
    throw new Error("AI failed to generate a move and board is full.");
  }
};
