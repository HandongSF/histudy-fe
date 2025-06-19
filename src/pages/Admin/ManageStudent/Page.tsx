import * as xlsx from "xlsx";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { PencilIcon, SaveIcon, XIcon, SearchIcon } from "lucide-react";
import { editUser, readAllStudyApplyUsers } from "@/apis/manager";
import { useQuery } from "react-query";
import { StudyApplyUser } from "@/interface/user";
import Loading from "@/components/Loading";
import { toast } from "sonner";

// Helper function to clean course names
const cleanCourseName = (name: string) => name.replace(/\n/g, " ");
const cleanProfName = (prof: string) => prof.replace(/\n/g, "").trim();

export default function ManageStudentPage() {
  const { data: applicants, refetch } = useQuery(
    ["allStudyApplyUsers"],
    readAllStudyApplyUsers,
    {
      cacheTime: 5 * 60 * 1000,
    }
  );

  const [editingId, setEditingId] = React.useState<number | null>(null);
  const [formData, setFormData] = React.useState<Partial<StudyApplyUser>>({});
  const [searchTerm, setSearchTerm] = React.useState("");

  const handleEdit = (applicant: StudyApplyUser) => {
    setEditingId(applicant.id);
    // 희망과목은 첫 번째 과목의 이름만 수정 가능하도록 단순화
    setFormData({
      ...applicant,
      courses:
        applicant.courses.length > 0 ? [{ ...applicant.courses[0] }] : [],
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({});
  };

  const handleSave = async () => {
    try {
      await editUser({
        id: formData.id!,
        name: formData.name!,
        sid: formData.sid!,
        team: formData.group!,
      });
      refetch();
      setEditingId(null);
      setFormData({});
    } catch (error) {
      toast.error("사용자 정보 수정에 실패했습니다.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (
      name === "courseName" &&
      formData.courses &&
      formData.courses.length > 0
    ) {
      setFormData((prev) => ({
        ...prev,
        courses: [{ ...prev.courses![0], name: value }],
      }));
    } else if (name === "group") {
      setFormData((prev) => ({
        ...prev,
        group: value === "" ? undefined : Number.parseInt(value, 10),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const filteredApplicants = applicants?.filter(
    (applicant) =>
      applicant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (applicant.group !== null &&
        applicant.group.toString().includes(searchTerm.toLowerCase())) ||
      applicant.sid.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExcelDownload = () => {
    if (applicants) {
      const sheetData = applicants.map((student) => ({
        ID: student.id,
        Name: student.name,
        StudentId: student.sid,
        Email: student.email,
        Group: student.group,
        Courses: student.courses
          .map((subject) => subject.name + `(${subject.prof})`)
          .join(", "),
        Friends: student.friends.map((friend) => friend.name).join(", "),
      }));

      const ws = xlsx.utils.json_to_sheet([...sheetData]);
      const wb = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(wb, ws, "Sheet1");

      xlsx.writeFile(wb, "스터디신청자목록.xlsx");
    }
  };

  return (
    <div className="container mx-auto p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-semibold">스터디 신청자 목록</h1>
        <div className="flex flex-row gap-4">
          <div className="relative w-full sm:w-64">
            <SearchIcon className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="학생 이름, 그룹 검색"
              className="pl-8 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button onClick={handleExcelDownload}>신청자 목록 다운로드</Button>
        </div>
      </div>

      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        {!filteredApplicants ? (
          <div className="flex justify-center items-center min-h-[500px] h-full w-full">
            <Loading />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">그룹</TableHead>
                <TableHead className="w-[150px]">이름</TableHead>
                <TableHead className="w-[150px]">학번</TableHead>
                <TableHead>이메일</TableHead>
                <TableHead className="w-[250px]">희망과목 (첫번째)</TableHead>
                <TableHead className="w-[120px] text-center">수정</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApplicants.map((applicant) =>
                editingId === applicant.id ? (
                  // 편집 모드
                  <TableRow key={applicant.id}>
                    <TableCell>
                      <Input
                        name="group"
                        value={
                          formData.group === null ? "" : formData.group ?? ""
                        }
                        onChange={handleChange}
                        className="h-8"
                        type="number"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        name="name"
                        value={formData.name ?? ""}
                        onChange={handleChange}
                        className="h-8"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        name="sid"
                        value={formData.sid ?? ""}
                        onChange={handleChange}
                        className="h-8"
                      />
                    </TableCell>
                    <TableCell>{applicant.email}</TableCell>
                    <TableCell>
                      {applicant.courses.length > 0 ? (
                        <>
                          {cleanCourseName(applicant.courses[0].name)}
                          <span className="text-xs text-muted-foreground">
                            {" "}
                            ({cleanProfName(applicant.courses[0].prof)})
                          </span>
                        </>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell className="text-center space-x-1">
                      <Button
                        size="icon"
                        className="h-8 w-8 bg-green-500 hover:bg-green-600"
                        onClick={handleSave}
                      >
                        <SaveIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={handleCancel}
                      >
                        <XIcon className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ) : (
                  // 일반 모드
                  <TableRow key={applicant.id}>
                    <TableCell>
                      {applicant.group !== null
                        ? `Group${applicant.group}`
                        : "-"}
                    </TableCell>
                    <TableCell>{applicant.name}</TableCell>
                    <TableCell>{applicant.sid}</TableCell>
                    <TableCell>{applicant.email}</TableCell>
                    <TableCell>
                      {applicant.courses.length > 0 ? (
                        <>
                          {cleanCourseName(applicant.courses[0].name)}
                          <span className="text-xs text-muted-foreground">
                            {" "}
                            ({cleanProfName(applicant.courses[0].prof)})
                          </span>
                        </>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleEdit(applicant)}
                      >
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              )}
              {filteredApplicants.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-24 text-center text-muted-foreground"
                  >
                    신청자가 없거나 검색 결과가 없습니다.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
