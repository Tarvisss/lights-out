import React, { useState } from "react";
import Cell from "./Cell";
import "./Board.css";

/** 
 * Game board of Lights out.
 *
 * Properties:
 * - nrows: number of rows of the board
 * - ncols: number of columns of the board
 * - chanceLightStartsOn: float, chance any cell is lit at the start of the game
 *
 * State:
 * - board: array of arrays of true/false (indicating whether each cell is lit or unlit)
 *    Example:
 *    .  .  .
 *    O  O  .    (where . is off, and O is on)
 *    .  .  .
 *    This corresponds to: [[false, false, false], [true, true, false], [false, false, false]]
 *
 *  This renders an HTML table of individual <Cell /> components.
 **/

function Board({ nrows, ncols, chanceLightStartsOn }) {
  const [board, setBoard] = useState(createBoard());

  /** 
   * Create a board of size nrows by ncols, with each cell randomly lit or unlit 
   * based on the given chanceLightStartsOn (probability that each cell starts as lit).
   */
  function createBoard() {
    let initialBoard = [];
    for (let y = 0; y < nrows; y++) {
      let row = [];
      for (let x = 0; x < ncols; x++) {
        row.push(Math.random() < chanceLightStartsOn); // Randomly set cell state
      }
      initialBoard.push(row);
    }
    return initialBoard;
  }

  /** 
   * Check if all cells are off (false). If so, the player has won.
   */
  function hasWon() {
    for (let y = 0; y < nrows; y++) {
      for (let x = 0; x < ncols; x++) {
        if (board[y][x] === true) { // If any cell is lit, the game isn't won
          return false;
        }
      }
    }
    return true; // All cells are off (game won)
  }

  /** 
   * Flip the clicked cell and its adjacent cells (up, down, left, right) on the board.
   */
  function flipCellsAround(coord) {
    setBoard(oldBoard => {
      const [y, x] = coord.split("-").map(Number); 
      // Create a copy of the current board state
      const boardCopy = oldBoard.map(row => [...row]); 

      function flipCell(y, x, boardCopy) {
        if (x >= 0 && x < ncols && y >= 0 && y < nrows) { // Only flip if within bounds
          boardCopy[y][x] = !boardCopy[y][x]; // Flip the cell
        }
      };

      // Flip the clicked cell and its adjacent cells
      flipCell(y, x, boardCopy);
      flipCell(y - 1, x, boardCopy); // Up
      flipCell(y + 1, x, boardCopy); // Down
      flipCell(y, x - 1, boardCopy); // Left
      flipCell(y, x + 1, boardCopy); // Right

      return boardCopy; // Return the updated board copy
    });
  }

  // If the player has won, display the winning message and stop rendering the board
  if (hasWon()) {
    return (
      <div>
        <h1>Congratulations! You Won!</h1>
      </div>
    );
  }

  // Render the table board with cells
  return (
    <table>
      <tbody>
        {board.map((row, y) => (
          <tr key={y}>
            {row.map((isLit, x) => (
              <Cell
                key={`${y}-${x}`}
                isLit={isLit}
                flipCellsAroundMe={() => flipCellsAround(`${y}-${x}`)}
              />
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default Board;
