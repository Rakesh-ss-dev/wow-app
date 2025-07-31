// WeightKnob.tsx
import React, { useState } from "react";
import JqxKnob from "jqwidgets-scripts/jqwidgets-react-tsx/jqxknob";

const WeightKnob: React.FC = () => {
  const [weight, setWeight] = useState<number>(70); // default weight in kg

  const marks = {
    colorProgress: { border: '#324e7b', color: '#4f6fa7' },
    colorRemaining: { border: 'lightgrey', color: 'lightgrey' },
    majorInterval: 20,
    majorSize: '9%',
    minorInterval: 5,
    offset: '71%',
    size: '6%',
    thickness: 3,
  };

  const labels = {
    offset: '88%',
    step: 20,
    visible: true,
  };

  const pointer = {
    offset: '49%',
    size: '59%',
    style: { fill: '#324e7b', stroke: 'grey' },
    thickness: 20,
    type: 'arrow',
  };

  const progressBar = {
    background: { fill: 'lightgrey', stroke: 'lightgrey' },
    offset: '60%',
    size: '9%',
    style: { fill: '#324e7b', stroke: 'grey' },
  };

  return (
    <div style={{ width: "100%", maxWidth: "350px", margin: "auto" }}>
      <h3 style={{ textAlign: "center" }}>Body Weight</h3>
      <JqxKnob
        width={'100%'}
        height={'100%'}
        min={30}
        max={200}
        value={weight}
        startAngle={120}
        endAngle={420}
        rotation="clockwise"
        snapToStep={true}
        step={1}
        marks={marks}
        labels={labels}
        pointer={pointer}
        progressBar={progressBar}
        onChange={(e: any) => setWeight(e.args.value)}
      />
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <h4>Current Weight: {weight} kg</h4>
        <p>Adjust the knob to reflect your current body weight.</p>
      </div>
    </div>
  );
};

export default WeightKnob;
        