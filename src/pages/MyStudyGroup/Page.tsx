import { getMyTeamUsers } from '@/apis/users';
import { NoData } from '@/components/NoData';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { WaveLoading } from '@/components/WaveLoading';
import { GroupIcon } from 'lucide-react';
import { useQuery } from 'react-query';

export default function MyStudyGroupPage() {
   const { data: studyGroupInfo, isLoading } = useQuery(['studyGroupInfo'], getMyTeamUsers, {
      cacheTime: 60 * 60 * 1000,
      refetchOnWindowFocus: false,
   });

   if (isLoading) {
      return <WaveLoading />;
   }

   if (!studyGroupInfo) {
      return (
         <div className="flex justify-center items-center h-screen">
            <NoData
               title="스터디 그룹 정보를 찾을 수 없습니다."
               description="스터디 그룹 정보를 찾을 수 없습니다. 다시 시도해주세요."
               height={300}
            />
         </div>
      );
   }

   return (
      <div className="container min-h-screen mx-auto py-8 px-4 max-w-3xl">
         <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold tracking-tight flex items-center justify-center gap-2">
               <GroupIcon className="h-8 w-8 text-primary" />
               스터디 그룹: {studyGroupInfo[0].tag}
            </h1>
            <p className="text-muted-foreground mt-1">총 {studyGroupInfo.length}명의 스터디원이 함께하고 있습니다.</p>
         </div>

         <div className="space-y-4">
            <Card className="py-2">
               <CardContent className="p-0">
                  <div className="overflow-x-auto">
                     <Table>
                        <TableHeader>
                           <TableRow>
                              <TableHead className="pl-6 w-[200px]">이름</TableHead>
                              <TableHead>학번</TableHead>
                              <TableHead className="hidden md:table-cell">이메일</TableHead>
                              <TableHead className="text-right pr-6">태그</TableHead>
                           </TableRow>
                        </TableHeader>
                        <TableBody>
                           {studyGroupInfo.map((member) => (
                              <TableRow key={member.id}>
                                 <TableCell className="pl-6">
                                    <div className="flex items-center gap-3">
                                       <Avatar className="h-9 w-9">
                                          <AvatarFallback className="bg-primary/10">
                                             {member.name.charAt(0)}
                                          </AvatarFallback>
                                       </Avatar>
                                       <span className="font-medium">{member.name}</span>
                                    </div>
                                 </TableCell>
                                 <TableCell>{member.sid}</TableCell>
                                 <TableCell className="hidden md:table-cell">
                                    <span title={member.email}>{member.email}</span>
                                 </TableCell>
                                 <TableCell className="text-right pr-6">{member.tag}</TableCell>
                              </TableRow>
                           ))}
                        </TableBody>
                     </Table>
                  </div>
               </CardContent>
            </Card>
         </div>
      </div>
   );
}
