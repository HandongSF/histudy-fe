"use client";

import { getMyGroup } from "@/apis/study";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Book, Users } from "lucide-react";
import { useQuery } from "react-query";
import { Button } from "../ui/button";

export default function ApplicationPage() {
  const { isLoading, data } = useQuery(["checkMyApplication"], getMyGroup, {
    cacheTime: 1 * 30 * 1000,
    refetchOnWindowFocus: false,
  });

  if (!data) {
    return <div>...loading</div>;
  }

  const hasNoApplications =
    data.courses.length === 0 && data.friends.length === 0;
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center">
          <header className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              스터디 그룹 신청 내역
            </h1>
            <p className="text-muted-foreground">
              {hasNoApplications
                ? "아직 스터디를 신청하지 않았습니다."
                : "스터디 신청이 완료되었습니다."}
            </p>
          </header>

          <Button>
            {hasNoApplications ? "스터디 그룹 신청" : "스터디 그룹 재신청"}
          </Button>
        </div>

        <div className="space-y-6">
          {/* 함께하고 싶은 친구 섹션 */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                함께하고 싶은 친구
                <span className="text-sm font-normal text-muted-foreground">
                  ({data.friends.length}/3)
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[180px]">학번</TableHead>
                    <TableHead>이름</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.friends.map((friend, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-mono">{friend.sid}</TableCell>
                      <TableCell>{friend.name}</TableCell>
                    </TableRow>
                  ))}
                  {/* 빈 행 추가 (최대 3명까지) */}
                  {Array.from({ length: 3 - data.friends.length }).map(
                    (_, index) => (
                      <TableRow
                        key={`empty-friend-${index}`}
                        className="text-muted-foreground"
                      >
                        <TableCell
                          colSpan={2}
                          className="h-[41px] italic text-xs"
                        >
                          (빈 자리)
                        </TableCell>
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* 강의 섹션 */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Book className="h-5 w-5 text-primary" />
                강의
                <span className="text-sm font-normal text-muted-foreground">
                  ({data.courses.length}/3)
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">강의 코드</TableHead>
                    <TableHead className="w-[120px]">교수님</TableHead>
                    <TableHead>과목명</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.courses.map((course, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-mono">{course.code}</TableCell>
                      <TableCell>{course.prof}</TableCell>
                      <TableCell>{course.name}</TableCell>
                    </TableRow>
                  ))}
                  {/* 빈 행 추가 (최대 3개까지) */}
                  {Array.from({ length: 3 - data.courses.length }).map(
                    (_, index) => (
                      <TableRow
                        key={`empty-course-${index}`}
                        className="text-muted-foreground"
                      >
                        <TableCell
                          colSpan={3}
                          className="h-[41px] italic text-xs"
                        >
                          (빈 자리)
                        </TableCell>
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
