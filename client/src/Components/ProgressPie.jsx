import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

function ProgresPie({ current, target, currency }) {
  const numericCurrent = parseFloat(current);
  const numericTarget = parseFloat(target);
  const percentage = Math.min((numericCurrent / numericTarget) * 100, 100);

  return (
    <div style={{ width: "200px", height: "200px", position: "relative" }}>
      <CircularProgressbar
        value={percentage}
        styles={buildStyles({
          pathColor: "#4ade80", // green
          trailColor: "#d1d5db", // grey
        })}
      />
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
          fontSize: "10px",
          lineHeight: "1.2",
          color: "#1f2937", // dark
        }}
      >
        <div>
          {currency}
          {numericCurrent}
        </div>
        <div style={{ fontSize: "14px" }}>
          of {currency}
          {numericTarget}
        </div>
        <div style={{ fontWeight: "bold" }}>{Math.round(percentage)}%</div>
      </div>
    </div>
  );
}

export default ProgresPie;
