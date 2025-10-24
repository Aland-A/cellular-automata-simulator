import React from "react";
import Cell from "./Cell";

function Row({ rowNum, onSwitch, row, colNum }) {
  function handleToggle(colNum) {
    onSwitch([rowNum, colNum]);
  }
  return (
    <div>
      <div id="row" style={{ display: "flex", flexDirection: "row" }}>
        {[...Array(colNum)].map((_, index) => (
          <Cell
            key={index}
            columnNum={index}
            onToggle={() => handleToggle(index)}
            currentState={row[index]}
          />
        ))}
      </div>
    </div>
  );
}

export default Row;
