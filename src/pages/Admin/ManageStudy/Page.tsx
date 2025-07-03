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
import { Badge } from "@/components/ui/badge";
import { SearchIcon, DownloadIcon, EyeIcon } from "lucide-react";
import { readAllGroups } from "@/apis/manager";
import { useQuery } from "react-query";
import SpinnerLoading from "@/components/SpinnerLoading";
import { Link } from "react-router-dom";
import { paths } from "@/const/paths";

export default function ManageStudyPage() {
  const { data: activities, isLoading } = useQuery(["courses"], readAllGroups, {
    cacheTime: 5 * 60 * 1000,
  });

  const [searchTerm, setSearchTerm] = React.useState("");

  const handleViewReport = (groupId: number) => {
    console.log(`그룹 ${groupId} 보고서 열람`);
    // 여기에 보고서 열람 페이지로 이동하거나 모달을 띄우는 로직을 구현합니다.
  };

  const filteredActivities = React.useMemo(() => {
    if (!activities) return [];
    return activities.filter((activity) => {
      const searchTermLower = searchTerm.toLowerCase();
      const groupMatch = activity.group.toString().includes(searchTermLower);
      const memberMatch = activity.members.some(
        (member) =>
          member.name.toLowerCase().includes(searchTermLower) ||
          member.sid.toLowerCase().includes(searchTermLower)
      );
      return groupMatch || memberMatch;
    });
  }, [activities, searchTerm]);

  const handleExcelDownload = () => {
    if (activities) {
      const sheetData = activities.flatMap((group) =>
        group.members.map((member) => ({
          Group: group.group,
          MemberID: member.id,
          MemberName: member.name,
          MemberNumber: member.sid,
          Friends: member.friends.map((friend) => friend.name).join(", "),
          Subjects: member.courses.map((subject) => subject.name).join(", "),
          Reports: group.reports,
          Times: group.times,
        }))
      );
      const ws = xlsx.utils.json_to_sheet([...sheetData]);
      const wb = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(wb, ws, "Sheet1");

      xlsx.writeFile(wb, "스터디그룹활동.xlsx");
    } else {
      console.log("데이터가 비어있습니다.");
    }
  };

  return (
    <div className="container mx-auto p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-semibold">그룹 활동 목록</h1>
        <div className="flex gap-2">
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
          <Button onClick={handleExcelDownload}>
            <DownloadIcon className="mr-2 h-4 w-4" />
            그룹 활동 목록 엑셀 다운
          </Button>
        </div>
      </div>

      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        {isLoading ? (
          <div className="flex min-h-[500px] justify-center items-center">
            <SpinnerLoading />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">그룹</TableHead>
                <TableHead>멤버</TableHead>
                <TableHead className="w-[120px]">보고서 수</TableHead>
                <TableHead className="w-[180px]">
                  그룹 누적 스터디 시간
                </TableHead>
                <TableHead className="w-[150px] text-center">
                  보고서 열람
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredActivities.length > 0 ? (
                filteredActivities.map((activity) => (
                  <TableRow key={activity.tag}>
                    <TableCell className="font-medium">
                      {activity.tag}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {activity.members.map((member) => (
                          <Badge key={member.id} variant="secondary">
                            {member.name} ({member.sid})
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>{activity.reports}</TableCell>
                    <TableCell>{activity.times}분</TableCell>
                    <TableCell className="text-center">
                      {/* TODO: 어떻게 어드민에서 보고서를 보게 할까? */}
                      <Link
                        to={paths.admin.manageReport}
                        state={activity.group}
                      >
                        <Button variant="outline" size="sm">
                          <EyeIcon className="mr-2 h-4 w-4" />
                          보고서 열람
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-24 text-center text-muted-foreground"
                  >
                    검색 결과가 없거나 활동 목록이 없습니다.
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
