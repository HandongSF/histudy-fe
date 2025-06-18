import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export default function DeleteDataIcon({ setData, compData }) {
  return (
    <IconButton color="error">
      <DeleteIcon
        onClick={() => {
          setData((prev) => [...prev.filter((elem) => elem[1] !== compData)]);
        }}
      />
    </IconButton>
  );
}
