import React, { useEffect, useState } from "react";

function Cell({ columnNum, onToggle, currentState }) {
  const onCellStyle = {
    width: "30px",
    height: "30px",
    border: "1px solid #ccc",
    backgroundColor: "#000000ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  };
  const offCellStyle = {
    width: "30px",
    height: "30px",
    border: "1px solid #ccc",
    backgroundColor: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  };

  const [state, setState] = useState(false);
  useEffect(() => {
    setState(currentState);
  }, [currentState]);

  return (
    <div>
      <div
        id="cell"
        style={state ? onCellStyle : offCellStyle}
        onClick={() => {
          if (state) setState(false);
          else setState(true);
          onToggle();
        }}
      ></div>
    </div>
  );
}

export default Cell;
