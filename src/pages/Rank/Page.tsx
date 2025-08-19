import { getAllTeamsForRank } from "@/apis/rank";
import { NoData } from "@/components/NoData";
import TeamInfoModal from "@/components/TeamInfoModal";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WaveLoading } from "@/components/WaveLoading";
import { Team } from "@/interface/teams";
import GroupGridView from "@/pages/Rank/components/GroupGridView";
import { GroupListView } from "@/pages/Rank/components/GroupListView";
import { maskName } from "@/utils/masking";
import { LayoutGrid, List } from "lucide-react";
import { useMemo, useState } from "react";
import { useQuery } from "react-query";

export default function RankPage() {
  const [view, setView] = useState("list");

  const { data, isLoading } = useQuery(["AllTeamRanks"], getAllTeamsForRank, {
    cacheTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const [modalInfo, setModalInfo] = useState<Team | null>(null);

  const teams = useMemo(() => {
    if (!data) return [];

    return data.teams.map((team) => ({
      ...team,
      members: team.members.map((name) => maskName(name)),
    }));
  }, [data]);

  if (isLoading) {
    return <WaveLoading />;
  }

  return (
    <>
      <TeamInfoModal
        selectedTeam={modalInfo}
        closeModal={() => setModalInfo(null)}
      />
      <div className="min-h-screen ">
        <div className="container mx-auto py-8 px-4">
          <header className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              스터디 랭킹
            </h1>
            <p className="text-muted-foreground">
              최고의 성과를 내고 있는 스터디 그룹들을 확인하세요
            </p>
          </header>

          <div className="flex justify-between items-center mb-6">
            <div className="text-sm text-muted-foreground">
              총 {teams.length}개 그룹
            </div>
            <Tabs
              defaultValue={view}
              onValueChange={(v) => setView(v as "grid" | "list")}
            >
              <TabsList>
                <TabsTrigger value="grid" className="flex items-center gap-2">
                  <LayoutGrid className="h-4 w-4" />
                  <span className="hidden sm:inline">그리드 뷰</span>
                </TabsTrigger>
                <TabsTrigger value="list" className="flex items-center gap-2">
                  <List className="h-4 w-4" />
                  <span className="hidden sm:inline">리스트 뷰</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* 랭킹 순위 테이블 */}
          {teams.length === 0 ? (
            <NoData
              title="데이터가 없습니다"
              description="아직 표시할 데이터가 없습니다."
            />
          ) : (
            <>
              {view === "grid" ? (
                <GroupGridView
                  studyGroups={teams}
                  setModalInfo={setModalInfo}
                />
              ) : (
                <GroupListView studyGroups={teams} />
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
