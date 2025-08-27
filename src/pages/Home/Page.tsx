import { getAllTeamsForRank } from "@/apis/rank";

import TeamInfoModal from "@/components/TeamInfoModal";
import { Team } from "@/interface/teams";
import GroupGridView from "@/pages/Rank/components/GroupGridView";
import { Trophy } from "lucide-react";
import { useMemo, useState } from "react";
import { useQuery } from "react-query";
import StatsDashboard from "./components/activity-dashboard";
import { WaveLoading } from "@/components/WaveLoading";
import { NoData } from "@/components/NoData";
import SignUpDialog from "@/components/SignUpDialog";
import { maskName } from "@/utils/masking";
export default function HomePage() {
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
    <div className="flex flex-col min-h-screen bg-muted/40">
      <div className="min-h-screen ">
        <div className="container mx-auto py-8 px-4 flex flex-col gap-8">
          <div className="w-full rounded-lg h-[350px] bg-gradient-to-r from-blue-100 to-blue-200 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-blue-50/30"></div>
            <div className="absolute top-10 left-10 w-32 h-32 bg-white/20 rounded-full blur-xl"></div>
            <div className="absolute bottom-10 right-10 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>

            <div className="relative z-10 text-center text-slate-700 px-4">
              <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
                배너를 통해 여러분의
                <br />
                <span className="text-blue-600">동아리를 홍보해주세요</span>
              </h1>
              <p className="text-base md:text-lg opacity-80 max-w-2xl mx-auto">
                우리 동아리의 특별한 활동과 가치를 더 많은 사람들에게 알려보세요
              </p>
            </div>
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
