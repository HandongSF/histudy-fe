import { readAllGroups, readEnrollees } from '@/apis/manager';
import { useMemo } from 'react';
import { useQueries } from 'react-query';
import GroupTable from './components/GroupTable';

export default function MatchedGroupListPage() {
   const [
      { data: groupsData, refetch: groupsRefetch, isLoading: groupsLoading },
      { data: ungroupsData, refetch: ungroupsRefetch, isLoading: ungroupsLoading },
   ] = useQueries([
      {
         queryKey: ['groups'],
         queryFn: readAllGroups,
         cacheTime: 5 * 60 * 1000,
      },
      {
         queryKey: ['ungroups'],
         queryFn: readEnrollees,
         cacheTime: 5 * 60 * 1000,
      },
   ]);

   const flatGroups = useMemo(() => {
      if (!groupsData) return [];
      return groupsData.flatMap((group) => group.members);
   }, [groupsData]);

   const flatUngroups = useMemo(() => {
      if (!ungroupsData) return [];
      return ungroupsData.flatMap((ungroup) => ungroup);
   }, [ungroupsData]);
   return (
      <div className="min-h-screen p-4 sm:p-8 space-y-8">
         <header className="text-2xl">매칭된 그룹 목록</header>

         <GroupTable
            groups={groupsData}
            loading={groupsLoading}
            refetch={() => {
               groupsRefetch();
               ungroupsRefetch();
            }}
            members={flatGroups}
         />

         <header className="text-2xl">미매칭 학생 목록</header>

         <GroupTable
            groups={groupsData}
            loading={ungroupsLoading}
            refetch={() => {
               groupsRefetch();
               ungroupsRefetch();
            }}
            members={flatUngroups}
         />
      </div>
   );
}
