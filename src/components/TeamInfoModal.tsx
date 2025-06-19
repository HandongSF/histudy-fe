import { Circle, Clock, FileText, Square, Users, X } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent } from "./ui/dialog";
import { Team } from "@/interface/teams";
import { addImagePrefix } from "./Image/imagePrefix";

interface TeamInfoModalProps {
  selectedTeam: Team | null;
  closeModal: () => void;
}

export default function TeamInfoModal({
  selectedTeam,
  closeModal,
}: TeamInfoModalProps) {
  return (
    <Dialog
      open={selectedTeam !== null}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          closeModal();
        }
      }}
    >
      <DialogContent
        showCloseButton={false}
        className="p-0 bg-white dark:bg-slate-800 shadow-xl rounded-lg max-w-2xl w-[90vw] sm:w-full overflow-hidden flex flex-col max-h-[90vh]"
      >
        {selectedTeam && (
          <>
            <div className="relative w-full aspect-[16/9] sm:aspect-video">
              {selectedTeam.thumbnail ? (
                <img
                  src={addImagePrefix(selectedTeam.thumbnail)}
                  alt={`${selectedTeam.id} 상세 이미지`}
                  style={{ objectFit: "cover" }}
                  className="rounded-t-lg"
                />
              ) : (
                <div className="w-full h-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center rounded-t-lg">
                  <p className="text-slate-500 dark:text-slate-400">
                    이미지 없음
                  </p>
                </div>
              )}
              {/* 닫기 버튼: 이미지 우측 상단에 위치 */}
              <Button
                variant="ghost"
                size="icon"
                onClick={closeModal}
                className="absolute top-3 right-3 z-10 bg-black/40 hover:bg-black/60 text-white rounded-full p-1.5"
                aria-label="닫기"
              >
                <X size={20} />
              </Button>
            </div>

            <div className="px-6 pt-2 pb-6 flex-grow overflow-y-auto">
              <div className="grid grid-cols-2 gap-x-6 gap-y-3 mb-4 text-slate-600 dark:text-slate-300">
                <div className="flex items-center">
                  <Square
                    size={25}
                    className="mr-2 text-black dark:text-white"
                  />
                  <span className="text-xl">Team {selectedTeam.id}</span>
                </div>
                <div className="flex items-center">
                  <Users
                    size={18}
                    className="mr-2 text-sky-600 dark:text-sky-400"
                  />
                  <span>{selectedTeam.members.length}명</span>
                </div>
                <div className="flex items-center">
                  <Clock
                    size={18}
                    className="mr-2 text-blue-600 dark:text-blue-400"
                  />
                  <span>{selectedTeam.totalMinutes}분</span>
                </div>
                <div className="flex items-center col-span-2 sm:col-span-1">
                  <FileText
                    size={18}
                    className="mr-2 text-green-600 dark:text-green-400"
                  />
                  <span>레포트 {selectedTeam.reports}개</span>
                </div>
              </div>

              <div>
                <h3 className="text-md font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
                  참여 인원:
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  {selectedTeam.members.join(", ")}
                </p>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
