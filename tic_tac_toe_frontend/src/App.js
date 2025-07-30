import React, { useState, useEffect } from 'react';
import './App.css';

// Game colors (from requirements)
const COLORS = {
  accent: "#ff9800",
  primary: "#1976d2",
  secondary: "#424242",
};

// PUBLIC_INTERFACE
function App() {
  // Empty board (nulls)
  const emptyBoard = Array(9).fill(null);
  const [board, setBoard] = useState(emptyBoard);
  const [xIsNext, setXIsNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [status, setStatus] = useState('Next player: X');
  const [isDraw, setIsDraw] = useState(false);

  // PUBLIC_INTERFACE
  function handleClick(idx) {
    if (board[idx] || winner) return;
    const nextBoard = board.slice();
    nextBoard[idx] = xIsNext ? "X" : "O";
    setBoard(nextBoard);
    setXIsNext(!xIsNext);
  }

  function calcWinner(squares) {
    const lines = [
      [0,1,2],[3,4,5],[6,7,8], // Rows
      [0,3,6],[1,4,7],[2,5,8], // Cols
      [0,4,8],[2,4,6],         // Diags
    ];
    for (let [a,b,c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[b] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }

  useEffect(() => {
    const w = calcWinner(board);
    if (w) {
      setWinner(w);
      setStatus(`Winner: ${w} 🎉`);
      setIsDraw(false);
    } else if (board.every(x => x != null)) {
      setWinner(null);
      setStatus('Draw! 🤝');
      setIsDraw(true);
    } else {
      setWinner(null);
      setIsDraw(false);
      setStatus(`Next player: ${xIsNext ? "X" : "O"}`);
    }
  }, [board, xIsNext]);

  // PUBLIC_INTERFACE
  function handleRestart() {
    setBoard(emptyBoard);
    setXIsNext(true);
    setWinner(null);
    setStatus('Next player: X');
    setIsDraw(false);
  }

  return (
    <div className="ttt-app-outer">
      <main className="ttt-app-inner">
        <h1 className="ttt-title" style={{ color: COLORS.primary, fontWeight: 700 }}>
          Tic Tac Toe
        </h1>
        <div className="ttt-status" style={{
          color: winner ? COLORS.accent : (isDraw ? COLORS.secondary : COLORS.primary),
          marginBottom: "1.5rem"
        }}>
          {status}
        </div>
        <Board 
          squares={board} 
          onClick={handleClick} 
          winnerLine={winner ? getWinningLine(board) : null}
        />
        <div style={{ marginTop: "2.5rem" }}>
          <button 
            className="ttt-btn" 
            onClick={handleRestart}
            style={{
              background: COLORS.primary, 
              color: "#fff", 
              border: "none",
              padding: "0.75rem 2.25rem",
              borderRadius: "10px",
              fontSize: "1.1rem",
              fontWeight: 700,
              letterSpacing: "0.5px",
              boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
              cursor: "pointer",
              transition: ".18s background cubic-bezier(.4,0,.2,1)"
            }}
          >
            Restart
          </button>
        </div>
        <div className="ttt-footer" style={{ color: COLORS.secondary, marginTop: "3.5rem", fontSize: "0.9rem" }}>
          Modern minimal web tic tac toe – Local 2-player
        </div>
      </main>
    </div>
  );
}

// PUBLIC_INTERFACE
function Board({ squares, onClick, winnerLine }) {
  return (
    <div className="ttt-board">
      {squares.map((value, idx) => (
        <Square 
          key={idx}
          value={value}
          onClick={() => onClick(idx)} 
          highlight={winnerLine && winnerLine.includes(idx)}
        />
      ))}
    </div>
  );
}

// PUBLIC_INTERFACE
function Square({ value, onClick, highlight }) {
  return (
    <button
      className="ttt-square"
      onClick={onClick}
      aria-label={value ? `Cell: ${value}` : `Empty cell`}
      style={{
        color: value === "X" ? "#1976d2" : (value === "O" ? "#ff9800" : "inherit"),
        borderColor: highlight ? "#ff9800" : "var(--border-color)",
        fontWeight: highlight ? 800 : 600,
        background: highlight ? "rgba(255,152,0,0.08)" : "#fff",
        transition: "background 0.22s cubic-bezier(.4,0,.2,1)"
      }}
      tabIndex={0}
    >
      {value}
    </button>
  );
}

// Helper to find the winning combination for highlighting
function getWinningLine(squares) {
  const lines = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  for (let line of lines) {
    const [a,b,c] = line;
    if (squares[a] && squares[a] === squares[b] && squares[b] === squares[c]) {
      return line;
    }
  }
  return null;
}

export default App;
