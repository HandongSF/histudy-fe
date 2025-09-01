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
import EmblaCarousel from "./components/EmblaCarousel";
import { EmblaOptionsType } from "embla-carousel";

const CAROUSEL_SLIDES = [
  {
    imageUrl: "/img/SLE_DESKTOP.png",
    linkUrl: "https://sle-recruitng.vercel.app/",
    alt: "슬기짜기",
  },
  {
    imageUrl: "/img/TEST_DESKTOP.png",
    linkUrl: "https://hisnet.handong.edu/",
    alt: "데모이미지",
  },
];
// 캐러셀 옵션
const CAROUSEL_OPTIONS: EmblaOptionsType = { loop: true };

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

            <EmblaCarousel options={CAROUSEL_OPTIONS} className="h-full w-full">
              {CAROUSEL_SLIDES.map((slide, index) => (
                <a
                  key={index}
                  href={slide.linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block h-full w-full"
                >
                  <div
                    className="relative z-10 h-full w-full"
                    style={{
                      backgroundImage: `url("${slide.imageUrl}")`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                    aria-label={slide.alt}
                  ></div>
                </a>
              ))}
            </EmblaCarousel>
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
