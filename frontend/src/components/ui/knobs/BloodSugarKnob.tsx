import React, { useState } from "react";
import JqxKnob from "jqwidgets-scripts/jqwidgets-react-tsx/jqxknob";

const BloodSugarKnob: React.FC = () => {
  const [value, setValue] = useState<number>(100);

  

  const dynamicColor = '#446F62';

  const marks = {
    colorProgress: { border: dynamicColor, color: dynamicColor },
    colorRemaining: { border: "#ccc", color: "#ccc" },
    majorInterval: 20,
    majorSize: "9%",
    minorInterval: 5,
    offset: "70%",
    size: "6%",
    thickness: 3,
  };

  const labels = {
    offset: "85%",
    step: 20,
    visible: true,
  };

  const pointer = {
    offset: "48%",
    size: "58%",
    style: {
      fill: dynamicColor,
      stroke: "#999",
      transition: "fill 0.6s ease", // Smooth transition
    },
    thickness: 18,
    type: "arrow",
  };

  const progressBar = {
    offset: "60%",
    size: "10%",
    background: { fill: "#eee", stroke: "#eee" },
    style: {
      fill: dynamicColor,
      stroke: "#999",
      transition: "fill 0.6s ease", // Smooth transition
    },
  };

  return (
    <div style={{ width: "100%", maxWidth: 360, margin: "auto" }}>
      <JqxKnob
        width={"100%"}
        height={300}
        min={40}
        max={400}
        value={value}
        startAngle={120}
        endAngle={420}
        rotation="clockwise"
        snapToStep={true}
        step={1}
        marks={marks}
        labels={labels}
        pointer={pointer}
        progressBar={progressBar}
        onChange={(e: any) => setValue(e.args.value)}
      />

      <div style={{ textAlign: "center", marginTop: 20 }}>
        <h4>{value} mg/dL</h4>
      </div>
    </div>
  );
};

export default BloodSugarKnob;
