import { deleteUserForm, readApplicants, teamMatch } from "@/apis/manager";
import SpinnerLoading from "@/components/SpinnerLoading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { XIcon } from "lucide-react";
import { useMemo } from "react";
import { useQuery, useMutation } from "react-query";
import { toast } from "sonner";

const cleanCourseName = (name: string) => name.replace(/\n/g, " ");
const cleanProfName = (prof: string) => prof.replace(/\n/g, "").trim();

export default function CreateGroupPage() {
  const { data, refetch, isLoading } = useQuery(
    ["readApplicants"],
    readApplicants,
    {
      cacheTime: 5 * 60 * 1000,
    }
  );

  const { mutate: deleteUserFormMutation } = useMutation(deleteUserForm, {
    onSuccess: () => {
      refetch();
      toast.success("삭제 완료!");
    },
    onError: () => {
      toast.error("삭제 실패");
    },
  });

  const handleDeleteApplicant = (sid: string) => {
    deleteUserFormMutation(sid);
  };

  const { mutate: teamMatchMutation, isLoading: isTeamMatchLoading } =
    useMutation(teamMatch, {
      onSuccess: () => {
        refetch();
        toast.success("매칭 완료!");
      },
      onError: () => {
        toast.error("매칭 실패");
      },
    });

  const handleMatchGroups = () => {
    teamMatchMutation();
  };

  const applicants = useMemo(() => {
    if (!data) return [];
    return data;
  }, [data]);

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">신청자 리스트</h1>
        <Button onClick={handleMatchGroups} disabled={isTeamMatchLoading}>
          {isTeamMatchLoading ? "매칭 중..." : "그룹 매칭하기"}
        </Button>
      </div>
      {isLoading ? (
        <div className="flex min-h-[500px] justify-center items-center">
          <SpinnerLoading />
        </div>
      ) : (
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px]">학생 정보</TableHead>
                <TableHead>희망 1과목</TableHead>
                <TableHead>희망 2과목</TableHead>
                <TableHead>희망 3과목</TableHead>
                <TableHead className="w-[200px]">함께하고 싶은 친구</TableHead>
                <TableHead className="w-[80px] text-center">삭제</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applicants.length > 0 ? (
                applicants.map((applicant) => (
                  <TableRow key={applicant.id}>
                    <TableCell>
                      <div className="font-medium">{applicant.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {applicant.sid}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {applicant.email}
                      </div>
                    </TableCell>
                    {[0, 1, 2].map((index) => (
                      <TableCell key={index}>
                        {applicant.courses[index] ? (
                          <div>
                            {cleanCourseName(applicant.courses[index].name)}
                            <span className="text-xs text-muted-foreground">
                              {" "}
                              ({cleanProfName(applicant.courses[index].prof)})
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            -
                          </span>
                        )}
                      </TableCell>
                    ))}
                    <TableCell>
                      {applicant.friends.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {applicant.friends.map((friend) => (
                            <Badge key={friend.id} variant="secondary">
                              {friend.name} ({friend.sid})
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteApplicant(applicant.sid)}
                        aria-label={`신청자 ${applicant.name} 삭제`}
                      >
                        <XIcon className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-24 text-center text-muted-foreground"
                  >
                    신청자가 없습니다.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
