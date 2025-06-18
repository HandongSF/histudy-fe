import { Button, styled } from "@mui/material";
import { toast } from "sonner";

const StyledAddButton = styled(Button)(({ theme }) => ({
  borderRadius: "15px",
  color: "white",
  backgroundColor: theme.palette.primary.main,
  padding: "3px 0px",
}));

const StyledDeleteButton = styled(Button)(({ theme }) => ({
  borderRadius: "15px",
  color: "white",
  backgroundColor: theme.palette.error.main,
  padding: "3px 0px",
}));

export default function AddDeleteButton({
  row,
  index,
  addData,
  sidebarValues,
  type,
}) {
  const pkList = [
    ...sidebarValues?.map((row, index) => {
      return row[1];
    }),
  ];

  const checkInclude = (pk) => {
    return pkList?.includes(pk);
  };

  const handleAddButtonClick = (row) => {
    if (type === "second" && sidebarValues.length >= 3)
      toast.warning("최대 3개까지만 선택 가능합니다.");
    else if (type === "first" && sidebarValues.length >= 4)
      toast.warning("최대 4개까지만 선택 가능합니다.");
    else addData((prev) => [...prev, row]);
  };

  const handleDeleteButtonClick = (row) => {
    addData((prev) => [...prev.filter((elem) => elem[1] !== row[1])]);
  };

  return checkInclude(row[1]) ? (
    <StyledDeleteButton
      key={index}
      onClick={() => handleDeleteButtonClick(row)}
    >
      제거
    </StyledDeleteButton>
  ) : (
    <StyledAddButton key={index} onClick={() => handleAddButtonClick(row)}>
      추가
    </StyledAddButton>
  );
}
