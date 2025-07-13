import { readAllGroups, readUngroup } from "@/apis/manager";
import { useMemo } from "react";
import { useQueries } from "react-query";
import GroupTable from "./components/GroupTable";

export default function MatchedGroupListPage() {
  const [
    { data: groups, refetch: groupsRefetch, isLoading: groupsLoading },
    { data: ungroups, refetch: ungroupsRefetch, isLoading: ungroupsLoading },
  ] = useQueries([
    {
      queryKey: ["groups"],
      queryFn: readAllGroups,
      cacheTime: 5 * 60 * 1000,
    },
    {
      queryKey: ["ungroups"],
      queryFn: readUngroup,
      cacheTime: 5 * 60 * 1000,
    },
  ]);

  const flatGroups = useMemo(() => {
    if (!groups) return [];
    return groups.flatMap((group) => group.members);
  }, [groups]);

  const flatUngroups = useMemo(() => {
    if (!ungroups) return [];
    return ungroups.flatMap((ungroup) => ungroup);
  }, [ungroups]);
  return (
    <div className="min-h-screen p-4 sm:p-8 space-y-8">
      <header className="text-2xl">매칭된 그룹 목록</header>

      <GroupTable
        groups={groups}
        loading={groupsLoading}
        refetch={() => {
          groupsRefetch();
          ungroupsRefetch();
        }}
        members={flatGroups}
      />

      <header className="text-2xl">미매칭 학생 목록</header>

      <GroupTable
        groups={groups}
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
