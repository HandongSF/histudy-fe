import { getAllTeamsForRank } from "@/apis/rank";
import GroupGridView from "@/pages/Rank/components/GroupGridView";
import { GroupListView } from "@/pages/Rank/components/GroupListView";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Box, Modal } from "@mui/material";
import { LayoutGrid, List } from "lucide-react";
import { useState } from "react";
import { useQuery } from "react-query";
import { Team } from "@/interface/teams";
import TeamInfoModal from "@/components/TeamInfoModal";

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

export default function RankPage() {
  const [view, setView] = useState("list");

  const { data } = useQuery(["AllTeamRanks"], getAllTeamsForRank, {
    cacheTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const [modalInfo, setModalInfo] = useState<Team | null>(null);
  return (
    <>
      {/* <Modal
        open={!!modalInfo}
        onClose={() => setModalInfo(null)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box component="img" src={modalInfo} sx={style} />
      </Modal> */}
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
              총 {data?.teams.length}개 그룹
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

          {view === "grid" ? (
            <GroupGridView
              studyGroups={data?.teams || []}
              setModalInfo={setModalInfo}
            />
          ) : (
            <GroupListView studyGroups={data?.teams || []} />
          )}
        </div>
      </div>
    </>
  );
}
