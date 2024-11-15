import React, { useState } from "react";
import "./App.css";

const App = () => {
  const BOARD_SIZE = 10;

  const shipDetails = [
    { name: "Carrier", size: 5, color: "red" },
    { name: "Battleship", size: 4, color: "green" },
    { name: "Cruiser", size: 3, color: "yellow" },
    { name: "Submarine", size: 3, color: "blue" },
    { name: "Destroyer", size: 2, color: "purple" },
  ];

  const generateEmptyBoard = () =>
    Array(BOARD_SIZE)
      .fill()
      .map(() => Array(BOARD_SIZE).fill(null));

  const placeShips = () => {
    const board = generateEmptyBoard();

    shipDetails.forEach((ship) => {
      let placed = false;

      while (!placed) {
        const isHorizontal = Math.random() > 0.5;
        const row = Math.floor(Math.random() * BOARD_SIZE);
        const col = Math.floor(Math.random() * BOARD_SIZE);

        const canPlace = Array(ship.size)
          .fill()
          .every((_, i) => {
            const r = isHorizontal ? row : row + i;
            const c = isHorizontal ? col + i : col;
            return (
              r < BOARD_SIZE &&
              c < BOARD_SIZE &&
              board[r]?.[c] === null &&
              checkNearby(board, r, c)
            );
          });

        if (canPlace) {
          Array(ship.size)
            .fill()
            .forEach((_, i) => {
              const r = isHorizontal ? row : row + i;
              const c = isHorizontal ? col + i : col;
              board[r][c] = ship.color;
            });
          placed = true;
        }
      }
    });

    return board;
  };

  const checkNearby = (board, row, col) => {
    const directions = [-1, 0, 1];
    for (let dr of directions) {
      for (let dc of directions) {
        const r = row + dr;
        const c = col + dc;
        if (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE) {
          if (board[r]?.[c] !== null) return false;
        }
      }
    }
    return true;
  };

  const [player2Board] = useState(placeShips);
  const [player2Hits, setPlayer2Hits] = useState(generateEmptyBoard());
  const [gameLog, setGameLog] = useState([]);

  const handleCellClick = (row, col) => {
    const isHit = player2Board[row][col] !== null;
    const hitOrMiss = isHit ? "Hit" : "Miss";
    const newLog = `Player clicked (${row + 1}, ${col + 1}) - ${hitOrMiss}`;

    setPlayer2Hits((prevHits) => {
      const newHits = [...prevHits];
      newHits[row][col] = isHit ? "🔥" : "X";
      return newHits;
    });

    setGameLog((prevLog) => [...prevLog, newLog]);
  };

  const renderBoard = (board, onClickHandler, showShips = false, showResults = false) => {
    return (
      <div className="grid">
        {/* Numbering for columns */}
        <div className="labels-row">
          <div className="corner"></div>
          {Array.from({ length: BOARD_SIZE }, (_, i) => (
            <div className="label" key={`col-${i}`}>
              {i + 1}
            </div>
          ))}
        </div>
        {/* Rows */}
        {board.map((row, rowIndex) => (
          <div className="row" key={`row-${rowIndex}`}>
            <div className="label">{rowIndex + 1}</div>
            {row.map((cell, colIndex) => (
              <div
                className={`cell ${showShips && cell ? "ship" : ""}`}
                key={`cell-${rowIndex}-${colIndex}`}
                onClick={onClickHandler ? () => onClickHandler(rowIndex, colIndex) : null}
                style={{
                  backgroundColor: showShips && cell ? cell : "",
                }}
              >
                {showResults ? cell : null}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="game-container">
      {/* Player 1 Board */}
      <div className="board player-board">
        <h3>Player 1 Board</h3>
        {renderBoard(player2Hits, handleCellClick, false, true)}
      </div>

      {/* Player 2 Board */}
      <div className="board player-2-board">
        <h3>Player 2 Board</h3>
        {renderBoard(player2Board, null, true, false)}
      </div>

      {/* Ship Key */}
      <div className="key">
        <h3>Ship Key</h3>
        <ul>
          {shipDetails.map((ship) => (
            <li key={ship.name}>
              <span
                className="key-color"
                style={{ backgroundColor: ship.color }}
              ></span>
              {ship.name} (Size: {ship.size})
            </li>
          ))}
        </ul>
      </div>

      {/* Game Log */}
      <div className="log">
        <h3>Game Log</h3>
        <ul>
          {gameLog.map((entry, index) => (
            <li key={index}>{entry}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
