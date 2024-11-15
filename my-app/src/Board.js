import React from "react";
import "./Board.css";

const Board = ({ title, moves, board }) => {
  const gridSize = 10;

  const renderCell = (row, col) => {
    if (moves) {
      const move = moves.find((m) => m.row === row && m.col === col);
      if (move) {
        return move.hit ? (
          <div className="cell hit">🔥</div>
        ) : (
          <div className="cell miss">O</div>
        );
      }
    }

    if (board && board[row][col]) {
      return <div className="cell ship" style={{ backgroundColor: board[row][col] }} />;
    }

    return <div className="cell"></div>;
  };

  return (
    <div className="board-container">
      <h3>{title}</h3>
      <div className="grid">
        {Array.from({ length: gridSize }).map((_, row) =>
          Array.from({ length: gridSize }).map((_, col) => (
            <div key={`${row}-${col}`} className="cell-wrapper">
              {renderCell(row, col)}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Board;
