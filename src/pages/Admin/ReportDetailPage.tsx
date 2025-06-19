import { readReportDetail } from "@/apis/manager";
import { deleteReport } from "@/apis/report";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SimpleUser } from "@/interface/user";
import { Report } from "@/interface/report";
import { roleState } from "@/store/atom";
import { Box } from "@mui/material";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Clock,
  Edit,
  ImageIcon,
  Trash2,
  Users,
} from "lucide-react";
import { useMemo } from "react";
import { useQuery } from "react-query";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { paths } from "@/const/paths";
import { toast } from "sonner";
import SideBar from "./components/SideBar";
import { addImagePrefix } from "@/components/Image/imagePrefix";

export default function ReportDetailPage() {
  const navigate = useNavigate();
  const { state } = useLocation() as { state: Report };

  const { id = null } = useParams();

  const role = useRecoilValue(roleState);

  const isAdmin = useMemo(() => role === "ADMIN", [role]);

  if (id === null) {
    navigate(-1);
    return;
  }

  // TODO: 개선 필요
  // state 로 처리하는 걸 없애고 싶다..
  // 관리자는 접근 가능.
  // 회원은 자기 페이지만 접근 가능.
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { data: report } = useQuery(
    ["report", id],
    () => {
      if (isAdmin) {
        return readReportDetail(+id);
      }
      return state;
    },
    {
      enabled: !!id,
    }
  );

  //TODO: 로딩 처리. 지금은 그냥 다 undefined 처리해버림

  const handleDelete = async () => {
    if (!report) {
      return;
    }
    if (window.confirm("정말 삭제하시겠습니까?")) {
      // TODO: 매니저가 접근했을 때는 파라메터로 state 자체를 넣어줘야 작동하던데... 이거 수정필요
      // 수정은 했는데 확인필요 (reportData.id 로 잘 수정한듯)
      deleteReport(report.id).then(() => {
        toast.success("성공적으로 삭제되었습니다.");
        navigate(-1);
      });
    }
  };
  const handleEdit = async () => {
    if (!report) {
      return;
    }
    navigate(paths.reports.edit(report.id.toString()), { state: state });
  };
  // 시간을 시간과 분으로 포맷팅하는 함수
  const formatStudyTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}시간 ${mins}분`;
  };

  return (
    <div className="container mx-auto py-6 px-4 max-w-4xl">
      {/* 헤더 */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-4">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 px-2.5"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span className="text-xs">뒤로가기</span>
          </Button>
          <h1 className="text-xl font-bold">{report?.title}</h1>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleEdit}
            className="flex items-center gap-1.5 px-2.5"
          >
            <Edit className="h-3.5 w-3.5" />
            <span className="text-xs">수정</span>
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            className="flex items-center gap-1.5 px-2.5"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span className="text-xs">삭제</span>
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {/* 기본 정보, 참여 멤버, 스터디 과목을 한 줄에 배치 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="lg:col-span-1 py-0">
            <CardHeader className="p-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                기본 정보
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />총 스터디 시간
                </span>
                <span className="font-medium">
                  {formatStudyTime(report?.totalMinutes || 0)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">작성일</span>
                <span className="font-medium">{report?.regDate}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-1 py-0">
            <CardHeader className="p-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-4 w-4" />
                참여 멤버 ({report?.participants.length || 0}명)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="flex flex-wrap gap-1.5">
                {report?.participants.map((participant: SimpleUser) => (
                  <Badge
                    key={participant.id}
                    variant="secondary"
                    className="text-xs px-2 py-0.5"
                  >
                    {participant.name}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-1 py-0">
            <CardHeader className="p-4">
              <CardTitle className="text-base flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                스터디 과목 ({report?.courses.length || 0}개)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-1.5">
              {report?.courses.map((course) => (
                <div
                  key={course.id}
                  className="text-xs flex items-center justify-between"
                >
                  <span className="font-medium">{course.name}</span>
                  <span className="text-muted-foreground">{course.prof}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* 보고서 내용 */}
        <Card className="py-0">
          <CardHeader className="pt-4 ">
            <CardTitle className="text-base">보고서 내용</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 ">
            <div className="prose prose-sm max-w-none rounded-md min-h-[200px] bg-slate-800 px-4 py-3">
              <pre className="whitespace-pre-wrap font-sans text-xs leading-relaxed text-white">
                {report?.content}
              </pre>
            </div>
          </CardContent>
        </Card>

        {/* 인증 사진 */}
        <Card className="py-0">
          <CardHeader className="p-4">
            <CardTitle className="text-base flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              인증 사진 ({report?.images.length || 0}장)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 ">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {report?.images.map((image) => (
                <div
                  key={image.id}
                  className="relative group aspect-w-4 aspect-h-3"
                >
                  <img
                    src={addImagePrefix(image.url)}
                    alt={`인증 사진 ${image.id}`}
                    className="w-full h-full object-cover rounded-md border hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => {
                      // 이미지 확대 보기 모달 열기
                      console.log(`Open image modal for image ${image.id}`);
                    }}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-md" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
