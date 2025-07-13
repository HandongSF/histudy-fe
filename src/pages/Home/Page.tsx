import { getAllTeamsForRank } from "@/apis/rank";

import TeamInfoModal from "@/components/TeamInfoModal";
import { Team } from "@/interface/teams";
import GroupGridView from "@/pages/Rank/components/GroupGridView";
import { Trophy } from "lucide-react";
import { useMemo, useState } from "react";
import { useQuery } from "react-query";
import StatsDashboard from "./components/StatsDashBoard";
import { WaveLoading } from "@/components/WaveLoading";
import { NoData } from "@/components/NoData";
import SignUpDialog from "@/components/SignUpDialog";
export default function HomePage() {
  const { data, isLoading } = useQuery(["AllTeamRanks"], getAllTeamsForRank, {
    cacheTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
  const [modalInfo, setModalInfo] = useState<Team | null>(null);

  const teams = useMemo(() => {
    if (!data) return [];
    return data.teams;
  }, [data]);

  if (isLoading) {
    return <WaveLoading />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-muted/40">
      <div className="min-h-screen ">
        <div className="container mx-auto py-8 px-4 flex flex-col gap-8">
          <div className="container mx-auto">
            <img
              src="/img/banner2.png"
              alt="플랫폼 배너"
              width={1200}
              height={300}
              className="w-full h-auto max-h-64 md:max-h-96 object-cover rounded-lg"
            />
          </div>

          <section className="container mx-auto flex flex-col gap-8">
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100">
              <Trophy className="inline-block w-10 h-10 mr-3 text-amber-500" />
              현재 활발한 스터디 그룹
            </h2>

            {teams.length === 0 ? (
              <NoData
                title="현재 그룹이 없습니다"
                description="현재 스터디 그룹이 없습니다."
              />
            ) : (
              <>
                <TeamInfoModal
                  selectedTeam={modalInfo}
                  closeModal={() => setModalInfo(null)}
                />

                <GroupGridView
                  studyGroups={teams.slice(0, 3) || []}
                  setModalInfo={setModalInfo}
                />
              </>
            )}
          </section>

          <section className="container mx-auto flex flex-col gap-4">
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100">
              스터디 활동 현황
            </h2>

            <main className="flex-1 container mx-auto">
              <StatsDashboard />
            </main>
          </section>
        </div>
      </div>
      <SignUpDialog />
    </div>
  );
}
