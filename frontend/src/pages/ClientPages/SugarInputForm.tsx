import { useState } from "react";
import CircularSlider from "@fseehawer/react-circular-slider";
import { Box, Typography } from "@mui/material";
const HalfDial = () => {
  const [value, setValue] = useState(120);

  return (
    <Box pt={6} >
      <Box pt={2}>
        <CircularSlider
          label="mg/dL"
          labelColor="#005a58"
          knobColor="#005a58"
          progressColorFrom="#00bfbd"
          progressColorTo="#009c9a"
          progressSize={20}
          trackColor="#eeeeee"
          trackSize={20}
          min={40}
          max={400}
          dataIndex={value - 40}
          onChange={(val:any) => setValue(val)}
          knobSize={32}
          knobPosition="top"
        />
      </Box>
      <Typography variant="h6" align="center" color="#005a58" pt={2}>
        Selected: {value} mg/dL
      </Typography>
    </Box>
  );
};

export default HalfDial;
