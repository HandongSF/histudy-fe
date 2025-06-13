import { IconButton, ImageListItem } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";

export default function PreviewImage({ getValues, setValue, state }) {
  return (
    <>
      {getValues(state)?.map((imageUrl, index) => (
        <ImageListItem
          sx={{
            position: "relative",
            mt: "20px",
            mr: "20px",
            maxWidth: "450px",
            maxHeight: "450px",
          }}
          key={index}
        >
          <img src={imageUrl} loading="lazy" alt={imageUrl} />
          <IconButton
            onClick={() => {
              const prev = getValues(state);
              setValue(state, [
                ...prev.slice(0, index),
                ...prev.slice(index + 1),
              ]);
              state === "previewImages" &&
                setValue("blobImages", [
                  ...prev.slice(0, index),
                  ...prev.slice(index + 1),
                ]);
            }}
            sx={{
              position: "absolute",
              right: "0",
              color: "black",
            }}
            aria-label={`star`}
          >
            <ClearIcon />
          </IconButton>
        </ImageListItem>
      ))}
    </>
  );
}
