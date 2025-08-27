import {
  getSemester,
  patchCurrentSemester,
  postSemester,
} from "@/apis/semester";
import { WaveLoading } from "@/components/WaveLoading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SemesterType } from "@/interface/semester";
import { Plus, Save, X } from "lucide-react";
import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import { toast } from "sonner";
export default function ManageSemesterPage() {
  const {
    data,
    isLoading,
    refetch: semestersRefetch,
  } = useQuery(["semester"], getSemester, {
    cacheTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const { mutateAsync: createSemester } = useMutation(postSemester);
  const { mutateAsync: setCurrentSemester } = useMutation(patchCurrentSemester);

  const [year, setYear] = useState(new Date().getFullYear());
  const [semester, setSemester] = useState<SemesterType>("SPRING");

  const [isCreating, setIsCreating] = useState(false);

  const getSemesterLabel = (semester: SemesterType) => {
    const labels = {
      SPRING: "봄학기",
      SUMMER: "여름학기",
      FALL: "가을학기",
      WINTER: "겨울학기",
    };
    return labels[semester];
  };

  const handleSave = async () => {
    try {
      await createSemester({ year, semester });
      setIsCreating(false);
      setYear(new Date().getFullYear());
      setSemester("SPRING");
      toast.success("학기가 생성되었습니다.");
      semestersRefetch();
    } catch (error) {
      console.log(error.response.data.message);
      toast.error(error.response.data.message || "학기 생성에 실패하였습니다.");
    }
  };

  const handleCancel = () => {
    setIsCreating(false);
  };

  const handleActivate = async (accademyTermId: number) => {
    console.log(accademyTermId);
    if (!confirm("현재 학기로 설정하시겠습니까?")) {
      return;
    }
    try {
      await setCurrentSemester(accademyTermId);
      toast.success("현재 설정 학기가 변경되었습니다.");
      semestersRefetch();
    } catch (error) {
      toast.error(error.response.data.message || "학기 설정에 실패하였습니다.");
    }
  };

  if (!data || isLoading) {
    return <WaveLoading />;
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">학기 관리</h1>

        <Button onClick={() => setIsCreating(true)} disabled={isCreating}>
          <Plus className="w-4 h-4 mr-2" />새 학기 추가
        </Button>
      </div>
      <div className="text-lg text-red-500">
        학기 삭제 기능이 없으니 주의해서 생성해주세요.
      </div>

      {isCreating && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>새 학기 생성</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="year">연도</Label>
                <Input
                  id="year"
                  type="number"
                  min="1000"
                  max="9999"
                  maxLength={4}
                  value={year}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.length <= 4) {
                      setYear(Number.parseInt(value));
                    }
                  }}
                  placeholder="2024"
                />
              </div>
              <div>
                <Label htmlFor="semester">학기</Label>
                <select
                  id="semester"
                  className="w-full p-2 border rounded-md"
                  value={semester}
                  onChange={(e) => {
                    setSemester(e.target.value as SemesterType);
                  }}
                >
                  <option value="SPRING">봄학기</option>
                  <option value="SUMMER">여름학기</option>
                  <option value="FALL">가을학기</option>
                  <option value="WINTER">겨울학기</option>
                </select>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                저장
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                <X className="w-4 h-4 mr-2" />
                취소
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px] px-5">상태</TableHead>
              <TableHead className="w-[100px">연도</TableHead>
              <TableHead>학기</TableHead>
              <TableHead>설정</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.academicTerms.map((semester) => (
              <TableRow
                key={semester.academicTermId}
                className={semester.isCurrent ? "bg-primary/5" : ""}
              >
                <TableCell className="px-3">
                  {semester.isCurrent && <Badge variant="default">활성</Badge>}
                </TableCell>
                <TableCell className="font-medium">{semester.year}년</TableCell>
                <TableCell>{getSemesterLabel(semester.semester)}</TableCell>
                <TableCell>
                  {!semester.isCurrent && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleActivate(semester.academicTermId)}
                    >
                      현재 학기로 설정
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
