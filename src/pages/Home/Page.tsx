import { getAllTeamsForRank } from "@/apis/rank";

import TeamInfoModal from "@/components/TeamInfoModal";
import { Team } from "@/interface/teams";
import GroupGridView from "@/pages/Rank/components/GroupGridView";
import { Trophy } from "lucide-react";
import { useState } from "react";
import { useQuery } from "react-query";
import StatsDashboard from "./components/StatsDashBoard";

const BuggyComponent = () => {
  const [crash, setCrash] = useState(false);

  if (crash) {
    throw new Error("💥 일부러 발생시킨 에러입니다!");
  }

  return <button onClick={() => setCrash(true)}>클릭 시 에러 발생</button>;
};

export default function HomePage() {
  const { data } = useQuery(["AllTeamRanks"], getAllTeamsForRank, {
    cacheTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
  const [modalInfo, setModalInfo] = useState<Team | null>(null);

  return (
    <div className="flex flex-col min-h-screen bg-muted/40">
      <div className="min-h-screen ">
        <div className="container mx-auto py-8 px-4 flex flex-col gap-8">
          <BuggyComponent />
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
            <TeamInfoModal
              selectedTeam={modalInfo}
              closeModal={() => setModalInfo(null)}
            />

            <GroupGridView
              studyGroups={data?.teams.slice(0, 3) || []}
              setModalInfo={setModalInfo}
            />
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
    </div>
  );
}
