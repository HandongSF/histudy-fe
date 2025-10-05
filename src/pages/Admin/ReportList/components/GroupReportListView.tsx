import SpinnerLoading from '@/components/SpinnerLoading';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { paths } from '@/const/paths';
import { Report } from '@/interface/report';
import { getFormattedLocaleString } from '@/utils/DateFormat';
import { ChevronRight, Clock, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface GroupReportListViewProps {
   reports?: Report[];
}
export default function GroupReportListUserView({ reports }: GroupReportListViewProps) {
   const navigate = useNavigate();

   const handleReportClick = (report: Report) => {
      navigate(paths.reports.oneReport(report.id.toString()), {
         state: report,
      });
   };

   // 시간을 시간과 분으로 포맷팅하는 함수
   const formatStudyTime = (minutes: number) => {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${hours}시간 ${mins}분`;
   };

   return (
      <Card className="py-0">
         <CardContent className="p-0">
            {!reports ? (
               <div className="flex justify-center items-center h-[500px]">
                  <SpinnerLoading />
               </div>
            ) : (
               <div className="overflow-auto">
                  <Table className="w-full">
                     <thead>
                        <tr className="bg-muted/50 border-b border-border">
                           <th className="w-[60px] h-12 px-4 text-center align-middle text-xs font-medium text-muted-foreground tracking-wider ">
                              순서
                           </th>
                           <th className="h-12 px-4 text-left align-middle text-xs font-medium text-muted-foreground tracking-wider">
                              제목
                           </th>

                           <th className="h-12 w-[140px] px-4 text-left align-middle text-xs font-medium text-muted-foreground tracking-wider ">
                              스터디 시간
                           </th>
                           <th className="h-12 px-4 text-left align-middle text-xs font-medium text-muted-foreground tracking-wider">
                              참여자
                           </th>

                           <th className="h-12 px-4 w-[120px] text-left align-middle text-xs font-medium text-muted-foreground tracking-wider">
                              작성일
                           </th>
                           <th className="h-12 px-4 w-[50px] text-left align-middle text-xs font-medium text-muted-foreground tracking-wider"></th>
                        </tr>
                     </thead>

                     <TableBody>
                        {reports.map((report, index) => (
                           <TableRow
                              key={index}
                              className="cursor-pointer hover:bg-muted/50 h-[50px]"
                              onClick={() => handleReportClick(report)}
                           >
                              <TableCell className="text-center font-medium">{index + 1}</TableCell>
                              <TableCell>
                                 <div>
                                    <div className="font-medium">{report.title}</div>
                                    <div className="md:hidden text-xs text-muted-foreground flex items-left mt-1">
                                       <Clock className="h-3 w-3 mr-1" />
                                       {formatStudyTime(report.totalMinutes)}
                                    </div>
                                    <div className="sm:hidden text-xs text-muted-foreground flex items-center mt-1">
                                       <Users className="h-3 w-3 mr-1" />
                                       {report.participants.length}명 참여 · {report.regDate}
                                    </div>
                                 </div>
                              </TableCell>
                              <TableCell className="hidden md:table-cell">
                                 <div className="flex items-center">
                                    <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                                    {formatStudyTime(report.totalMinutes)}
                                 </div>
                              </TableCell>
                              <TableCell className="hidden sm:table-cell">
                                 <div className="flex items-center gap-1">
                                    <Users className="h-4 w-4 text-muted-foreground mr-1" />
                                    <div className="flex flex-wrap gap-1">
                                       {report.participants.map((participant, i) => (
                                          <Badge key={i} variant="outline" className="font-normal">
                                             {participant.name}
                                          </Badge>
                                       ))}
                                    </div>
                                 </div>
                              </TableCell>
                              <TableCell className="hidden sm:table-cell">
                                 {getFormattedLocaleString(report.regDate)}
                              </TableCell>
                              <TableCell>
                                 <ChevronRight className="h-4 w-4 text-muted-foreground" />
                              </TableCell>
                           </TableRow>
                        ))}
                        {reports.length === 0 && (
                           <TableRow>
                              <TableCell colSpan={6} className="h-24 text-center">
                                 작성된 레포트가 없습니다.
                              </TableCell>
                           </TableRow>
                        )}
                     </TableBody>
                  </Table>
               </div>
            )}
         </CardContent>
      </Card>
   );
}
