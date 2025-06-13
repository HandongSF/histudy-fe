import * as React from "react";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { importCourses } from "../../apis/course";
import { useDrop } from "react-dnd";

export default function RegisterClassButton() {
  const [selectedFile, setSelectedFile] = React.useState();

  const fileRef = React.useRef();

  const handleChange = async (event) => {
    event.preventDefault();

    if (!window.confirm("해당 파일을 등록하시겠습니까??")) return;

    const formData = new FormData();

    formData.append("file", event.target.files[0]);

    importCourses(formData).then((res) => {
      alert("성공적으로 등록되었습니다.");
      window.location.reload();
    });
  };

  const handleClick = () => {
    fileRef.current.click();
  };

  return (
    <Stack direction="row" spacing={2}>
      <input
        type="file"
        ref={fileRef}
        hidden
        // style={{ display: "hidden" }}
        onChange={handleChange}
      />
      <Button
        variant="contained"
        style={{
          color: "#007AFF",
          backgroundColor: "#E4F1FF",
          borderRadius: 7,
        }}
        onClick={handleClick}
      >
        수업 목록 불러오기
      </Button>
    </Stack>
  );
}
