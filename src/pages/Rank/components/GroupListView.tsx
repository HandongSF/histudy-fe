import { Badge } from '@/components/ui/badge';
import { Team } from '@/interface/teams';
import { Trophy, FileText, Clock, Users } from 'lucide-react';

interface GroupListViewProps {
   studyGroups: Team[];
}

export function GroupListView({ studyGroups }: GroupListViewProps) {
   return (
      <div className="rounded-lg border bg-card overflow-hidden">
         <div className="overflow-x-auto">
            <table className="w-full">
               <thead>
                  <tr className="bg-muted/50 border-b border-border">
                     <th className="h-12 px-4 text-left align-middle text-xs font-medium text-muted-foreground tracking-wider w-16">
                        순위
                     </th>
                     <th className="h-12 px-4 text-left align-middle text-xs font-medium text-muted-foreground tracking-wider w-28">
                        그룹
                     </th>
                     <th className="h-12 px-4 text-left align-middle text-xs font-medium text-muted-foreground tracking-wider w-28">
                        레포트
                     </th>
                     <th className="h-12 px-4 text-left align-middle text-xs font-medium text-muted-foreground tracking-wider w-28">
                        스터디 시간
                     </th>
                     <th className="h-12 px-4 text-left align-middle text-xs font-medium text-muted-foreground tracking-wider">
                        팀원
                     </th>
                  </tr>
               </thead>
               <tbody>
                  {studyGroups.map((group, idx) => (
                     <tr
                        key={group.id}
                        className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                     >
                        <td className="px-4 py-3 whitespace-nowrap">
                           <Badge
                              variant={idx + 1 <= 3 ? 'default' : 'outline'}
                              className={`
                    ${idx + 1 === 1 ? 'bg-yellow-500 hover:bg-yellow-600' : ''}
                    ${idx + 1 === 2 ? 'bg-slate-400 hover:bg-slate-500' : ''}
                    ${idx + 1 === 3 ? 'bg-amber-700 hover:bg-amber-800' : ''}
                  `}
                           >
                              <Trophy className="h-3 w-3 mr-1" />
                              {idx + 1}위
                           </Badge>
                        </td>
                        <td className="px-4 py-3 font-medium">{group.id}</td>
                        <td className="px-4 py-3">
                           <div className="flex items-center">
                              <FileText className="h-3 w-3 mr-1 text-emerald-500" />
                              <span className="text-sm">{group.reports}개</span>
                           </div>
                        </td>
                        <td className="px-4 py-3">
                           <div className="flex items-center">
                              <Clock className="h-3 w-3 mr-1 text-blue-500" />
                              <span className="text-sm">{group.totalMinutes}분</span>
                           </div>
                        </td>
                        <td className="px-4 py-3">
                           <div className="flex items-center gap-1">
                              <Users className="h-3 w-3 text-muted-foreground" />
                              <span
                                 className="text-sm truncate max-w-[200px] sm:max-w-[300px] md:max-w-[400px]"
                                 title={group.members.join(', ')}
                              >
                                 {group.members.join(', ')}
                              </span>
                           </div>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
   );
}
