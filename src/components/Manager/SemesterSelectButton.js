import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

export default function SemesterSelectButton() {
  const [semester, setSemester] = React.useState(1);

  const handleChange = (event) => {
    setSemester(event.target.value);
  };

  return (
    <Box sx={{ minWidth: 120, marginLeft: "30px" }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Semester</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={semester}
          label="Year"
          onChange={handleChange}
          sx={{
            width: 125,
            height: 46,
            borderRadius: 1,
          }}
        >
          <MenuItem value={1}>1</MenuItem>
          <MenuItem value={2}>2</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}
