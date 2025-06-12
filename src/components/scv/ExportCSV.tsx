import { Button } from "@mui/material";
import { CSVLink } from "react-csv";
import * as xlsx from "xlsx";

const headers = [
  { label: "First Name", key: "firstname" },
  { label: "Last Name", key: "lastname" },
  { label: "Email", key: "email" },
];

const data = [
  { firstname: "Ahmed", lastname: "Tomi", email: "ah@smthing.co.com" },
  { firstname: "Raed", lastname: "Labes", email: "rl@smthing.co.com" },
  { firstname: "Yezzi", lastname: "Min l3b", email: "ymin@cocococo.com" },
];

// xlsx 모듈 추출
// const xlsx = require("xlsx");

// const doctors = xlsx.utils.aoa_to_sheet([
//   ["학과", "직급", "이름", "나이"],

//   ["흉부외과", "병원장", "주전", "67"],

//   ["흉부외과", "교수", "천명태", "52"],

//   ["흉부외과", "치프", "도재학", "39"],

//   ["소아외과", "레지던트", "장겨울", "29"],

//   ["산부인과", "레지던트", "추민하", "34"],

//   ["산부인과", "레지던트", "명은원", "28"],

//   ["신경외과", "교수", "민기준", "55"],

//   ["신경외과", "치프", "용석민", "33"],

//   ["신경외과", "레지던트", "안치홍", "38"],

//   ["신경외과", "레지던트", "허선빈", "31"],

//   ["응급의학과", "조교수", "봉광현", "40"],

//   ["응급의학과", "펠로우", "배준희", "31"],
// ]);

const columns = [
  { A: "학과", B: "직급", C: "이름", D: "나이" },

  { A: "흉부외과", B: "PA간호사", C: "소이현", D: "33" },

  { A: "소아외과", B: "PA간호사", C: "한현희", D: "29" },

  { A: "산부인과", B: "분만실간호사", C: "한한승주현희", D: "41" },

  { A: "산부인과", B: "PA간호사", C: "은선진", D: "36" },

  { A: "간담췌외과", B: "수간호사", C: "송수빈", D: "45" },

  { A: "간담췌외과", B: "병동간호사", C: "이영하", D: "35" },

  { A: "간담췌외과", B: "병동간호사", C: "김재환", D: "28" },

  { A: "간담췌외과", B: "PA간호사", C: "국해성", D: "32" },

  { A: "간담췌외과", B: "이식코디네이터", C: "함덕주", D: "37" },

  { A: "신경외과", B: "PA간호사", C: "황재신", D: "39" },

  { A: "응급의학과", B: "응급실간호사", C: "선우희수", D: "26" },
];

const excelDownload = (columns) => {
  const ws = xlsx.utils.json_to_sheet(columns);
  const wb = xlsx.utils.book_new(); // 가상의 엑셀파일 생성
  xlsx.utils.book_append_sheet(wb, ws, "Sheet1");
  //   xlsx.writeFile(wb, `${state.title}_${Data.now().xlsx}`);

  xlsx.writeFile(wb, "dramatis_personae.xlsx"); // 엑셀파일 생성 후 저장 형식
};

export default function ExportCSV() {
  return (
    <>
      <Button>
        <CSVLink
          data={data}
          headers={headers}
          filename="test.csv"
          target="_blank"
        >
          엑셀 CSV Export
        </CSVLink>
      </Button>

      <Button onClick={() => excelDownload(columns)}>엑셀 xlsx Export</Button>
    </>
  );
}
