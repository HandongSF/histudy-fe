import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { useRecoilValue } from "recoil";
import { groupAutoCompleteState } from "../../store/atom";

const groupData = [
  { label: "미배정" },
  { label: "Group1" },
  { label: "Group2" },
  { label: "Group3" },
  { label: "Group4" },
  { label: "Group5" },
  { label: "Group6" },
  { label: "Group7" },
  { label: "Group8" },
  { label: "Group9" },
  { label: "Group10" },
  { label: "Group11" },
  { label: "Group12" },
  { label: "Group13" },
  { label: "Group14" },
  { label: "Group15" },
  { label: "Group16" },
  { label: "Group17" },
  { label: "Group18" },
  { label: "Group19" },
  { label: "Group20" },
  { label: "Group21" },
  { label: "Group22" },
  { label: "Group23" },
  { label: "Group24" },
  { label: "Group25" },
  { label: "Group26" },
  { label: "Group27" },
  { label: "Group28" },
  { label: "Group29" },
  { label: "Group30" },
  { label: "Group31" },
  { label: "Group32" },
  { label: "Group33" },
  { label: "Group34" },
  { label: "Group35" },
  { label: "Group36" },
  { label: "Group37" },
  { label: "Group38" },
  { label: "Group39" },
  { label: "Group40" },
  { label: "Group41" },
  { label: "Group42" },
  { label: "Group43" },
  { label: "Group44" },
  { label: "Group45" },
  { label: "Group46" },
  { label: "Group47" },
  { label: "Group48" },
  { label: "Group49" },
  { label: "Group50" },
  { label: "Group51" },
  { label: "Group52" },
  { label: "Group53" },
  { label: "Group54" },
  { label: "Group55" },
  { label: "Group56" },
  { label: "Group57" },
  { label: "Group58" },
  { label: "Group59" },
  { label: "Group60" },
  { label: "Group61" },
  { label: "Group62" },
  { label: "Group63" },
  { label: "Group64" },
  { label: "Group65" },
  { label: "Group66" },
  { label: "Group67" },
  { label: "Group68" },
  { label: "Group69" },
  { label: "Group70" },
];

export default function GroupSelector({ team, setTeam }) {
  const groupAutoComplete = useRecoilValue(groupAutoCompleteState);
  console.log(groupAutoComplete);

  return (
    <Autocomplete
      onChange={(e, newValue) => {
        // Autocomplete의 onChange는 (event, newValue)를 인자로 받습니다.
        if (newValue?.label === "미배정") {
          setTeam(undefined);
        } else setTeam(newValue?.label?.slice(5));
      }}
      value={team ? "Group" + team + "" : "미배정"}
      disablePortal
      id="combo-box-demo"
      options={groupData} // groupAutoComplete 값을 사용하도록 수정했습니다.
      freeSolo
      sx={{ width: 120 }}
      renderInput={(params) => <TextField {...params} />}
    />
  );
}
