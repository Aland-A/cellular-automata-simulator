import "./App.css";
import Row from "./components/Row";
import { useState, useRef, useEffect } from "react";

function App() {
  const [row, setRow] = useState(20);
  const [column, setColumn] = useState(20);
  const [gen, setGen] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);
  const [speed, setSpeed] = useState(500);

  const [universe, setUniverse] = useState(
    Array(row)
      .fill()
      .map(() => Array(column).fill(false))
  );

  function handleSwitch(loc) {
    const tempUniverse = universe.map((row) => [...row]);
    if (universe[loc[0]][loc[1]]) tempUniverse[loc[0]][loc[1]] = false;
    else tempUniverse[loc[0]][loc[1]] = true;

    setUniverse(tempUniverse);
  }

  // Toggle the simulation running state
  function toggleRunning() {
    setRunning((prev) => !prev);
  }

  // Handle the interval when running changes
  // Handle the interval when running changes
  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(generate, speed); // every second
    } else {
      clearInterval(intervalRef.current);
    }

    // Cleanup on unmount
    return () => clearInterval(intervalRef.current);
  }, [running, universe, speed]);

  function generate() {
    // console.log(universe[0]);
    var nextUniverse = Array(row)
      .fill()
      .map(() => Array(column).fill(false));

    for (let i = 0; i < row; i++) {
      for (let j = 0; j < column; j++) {
        let liveNeigbors = 0;

        if (i == 0 && j == 0) {
          // Check first cell
          if (universe[0][1]) liveNeigbors++; // Check its neigbors manually
          if (universe[1][0]) liveNeigbors++;
          if (universe[1][1]) liveNeigbors++;
        } else if (i == row - 1 && j == column - 1) {
          // Check last cell
          if (universe[row - 1][column - 2]) liveNeigbors++; // Check its neigbors manually
          if (universe[row - 2][column - 1]) liveNeigbors++;
          if (universe[row - 2][column - 2]) liveNeigbors++;
        } else if (i == 0 && j == column - 1) {
          // Check top right corner cell
          if (universe[i][j - 1]) liveNeigbors++; // Check its neigbors manually
          if (universe[i + 1][j]) liveNeigbors++;
          if (universe[i + 1][j - 1]) liveNeigbors++;
        } else if (i == row - 1 && j == 0) {
          // Check bottom left corner cell
          if (universe[i - 1][j]) liveNeigbors++; // Check its neigbors manually
          if (universe[i][j + 1]) liveNeigbors++;
          if (universe[i - 1][j + 1]) liveNeigbors++;
        } else if (i != 0 && i != row - 1 && j == 0) {
          // Check the cells adjacent to the left wall
          if (universe[i - 1][j]) liveNeigbors++; // Check its neigbors manually
          if (universe[i + 1][j]) liveNeigbors++;
          if (universe[i][j + 1]) liveNeigbors++;
          if (universe[i - 1][j + 1]) liveNeigbors++;
          if (universe[i + 1][j + 1]) liveNeigbors++;
        } else if (i != 0 && i != row - 1 && j == column - 1) {
          // Check the cells adjacent to the right wall
          if (universe[i - 1][j]) liveNeigbors++; // Check its neigbors manually
          if (universe[i + 1][j]) liveNeigbors++;
          if (universe[i][j - 1]) liveNeigbors++;
          if (universe[i - 1][j - 1]) liveNeigbors++;
          if (universe[i + 1][j - 1]) liveNeigbors++;
        } else if (i == 0 && j != 0 && j != column - 1) {
          // Check the cells adjacent to the top wall
          if (universe[i][j - 1]) liveNeigbors++; // Check its neigbors manually
          if (universe[i][j + 1]) liveNeigbors++;
          if (universe[i + 1][j + 1]) liveNeigbors++;
          if (universe[i + 1][j - 1]) liveNeigbors++;
          if (universe[i + 1][j + 1]) liveNeigbors++;
        } else if (i == row - 1 && j != 0 && j != column - 1) {
          // Check the cells adjacent to the bottom wall
          if (universe[i][j - 1]) liveNeigbors++; // Check its neigbors manually
          if (universe[i][j + 1]) liveNeigbors++;
          if (universe[i - 1][j]) liveNeigbors++;
          if (universe[i - 1][j - 1]) liveNeigbors++;
          if (universe[i - 1][j + 1]) liveNeigbors++;
        } else {
          // Check every other cell
          if (universe[i - 1][j - 1]) liveNeigbors++; // Check its neigbors manually
          if (universe[i - 1][j]) liveNeigbors++;
          if (universe[i - 1][j + 1]) liveNeigbors++;
          if (universe[i][j - 1]) liveNeigbors++;
          if (universe[i][j + 1]) liveNeigbors++;
          if (universe[i + 1][j - 1]) liveNeigbors++;
          if (universe[i + 1][j]) liveNeigbors++;
          if (universe[i + 1][j + 1]) liveNeigbors++;
        }

        if (!universe[i][j] && liveNeigbors == 3) {
          // Birth the cell
          nextUniverse[i][j] = true;
        } else if (universe[i][j] && (liveNeigbors == 2 || liveNeigbors == 3)) {
          // Keep the cell alive
          nextUniverse[i][j] = true;
        } else {
          // The cell dies by isolation or by overcrowding
          nextUniverse[i][j] = false;
        }
      }
    }

    // Update universe
    setUniverse(nextUniverse);
    // console.log(nextUniverse);

    setGen(gen + 1);

    // Check if universe is all false
    const isAllFalse = nextUniverse.every((row) => row.every((cell) => !cell));
    if (isAllFalse) {
      setRunning(false);
      if (gen != 0) alert(`Simulation ended at generation ${gen}`);
      else
        alert(
          `You need to activate some cells by clicking on them before starting!`
        );
      setGen(0);
    }
  }

  return (
    <div className="App">
      <div className="button-container" style={{ margin: "20px 0" }}>
        <div style={{ marginBottom: "20px" }}>
          Dimensions:
          <input
            type="number"
            value={row}
            onChange={(e) => setRow(parseInt(e.target.value))}
            style={{
              padding: "8px",
              margin: "0 10px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
            placeholder="Rows"
          />
          <input
            type="number"
            value={column}
            onChange={(e) => setColumn(parseInt(e.target.value))}
            style={{
              padding: "8px",
              margin: "0 10px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
            placeholder="Columns"
          />
        </div>
        <button
          style={{
            padding: "12px 24px",
            fontSize: "16px",
            backgroundColor: running ? "#ff0000" : "#2196F3",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            margin: "0 10px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
            transition: "background-color 0.3s ease",
            ":hover": {
              backgroundColor: running ? "#cc0000" : "#1976D2",
            },
          }}
          onClick={toggleRunning}
        >
          {running ? "Stop" : "Start"}
        </button>
        <button
          style={{
            padding: "12px 24px",
            fontSize: "16px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            margin: "0 10px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
            transition: "background-color 0.3s ease",
            ":hover": {
              backgroundColor: "#388E3C",
            },
          }}
          onClick={generate}
        >
          Next Generation
        </button>
        <button
          style={{
            padding: "12px 24px",
            fontSize: "16px",
            backgroundColor: "#9C27B0",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            margin: "0 10px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
            transition: "background-color 0.3s ease",
            ":hover": {
              backgroundColor: "#7B1FA2",
            },
          }}
          onClick={() => {
            setUniverse(
              Array(row)
                .fill()
                .map(() => Array(column).fill(false))
            );
            setGen(0);
            setRunning(false);
          }}
        >
          Clear
        </button>
        <div style={{ marginBottom: "20px", marginTop: "20px" }}>
          Speed:
          <input
            type="range"
            min="10"
            max="1000"
            defaultValue="500"
            onChange={(e) => {
              setSpeed(Number(e.target.value));
            }}
            style={{
              width: "200px",
              margin: "0 10px",
            }}
          />
        </div>
      </div>
      <div
        style={{
          fontSize: "18px",
          fontWeight: "bold",
          color: "#333",
          margin: "15px 0",
        }}
      >
        Generation: {gen}
      </div>
      <div
        id="cells"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          margin: "30px auto",
          padding: "20px",
          backgroundColor: "#f5f5f5",
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        }}
      >
        {[...Array(row)].map((_, index) => (
          <Row
            key={index}
            rowNum={index}
            onSwitch={handleSwitch}
            row={universe[index]}
            colNum={column}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
