import { Stack, ToggleButton, ToggleButtonGroup } from "@mui/material";

import ViewListIcon from "@mui/icons-material/ViewList";
import ViewModuleIcon from "@mui/icons-material/ViewModule";

export default function ViewToggleButton({ view, setView }) {
  const handleViewChange = (event, nextView) => {
    setView(nextView);
  };
  return (
    <Stack direction="row" justifyContent="end" width="99%">
      <ToggleButtonGroup
        size="small"
        orientation="horizontal"
        value={view}
        exclusive
        onChange={handleViewChange}
        color="primary"
      >
        <ToggleButton value="list" aria-label="list">
          <ViewListIcon />
        </ToggleButton>
        <ToggleButton value="grid" aria-label="grid">
          <ViewModuleIcon />
        </ToggleButton>
      </ToggleButtonGroup>
    </Stack>
  );
}
