import { getAllTeamsForRank } from "@/apis/rank";

import GroupGridView from "@/pages/Rank/components/GroupGridView";
import { Box, Modal } from "@mui/material";
import { Trophy } from "lucide-react";
import { useState } from "react";
import { useQuery } from "react-query";
import StatsDashboard from "./components/StatsDashBoard";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function HomePage() {
  const { data } = useQuery(["AllTeamRanks"], getAllTeamsForRank, {
    cacheTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
  const [modalImageUrl, setModalImageUrl] = useState("");

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
            <Modal
              open={!!modalImageUrl}
              onClose={() => setModalImageUrl("")}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box component="img" src={modalImageUrl} sx={style} />
            </Modal>

            <GroupGridView
              studyGroups={data?.teams.slice(0, 3) || []}
              setModalImageUrl={setModalImageUrl}
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
