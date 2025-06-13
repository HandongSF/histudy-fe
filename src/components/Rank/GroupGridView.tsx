import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, FileText, Trophy, Users } from "lucide-react";
import { Team } from "@/interface/teams";

interface GroupGridViewProps {
  studyGroups: Team[];

  setModalImageUrl: (imageUrl: string) => void;
}

export default function GroupGridView({
  studyGroups,
  setModalImageUrl,
}: GroupGridViewProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {studyGroups.map((group, idx) => (
        <Card
          key={group.id}
          className="overflow-hidden hover:shadow-lg transition-shadow group py-0"
          onClick={() => {
            setModalImageUrl(group.thumbnail || "");
          }}
        >
          {/* 카드 전체를 감싸는 컨테이너 */}
          <div className="relative h-[280px]">
            {/* 이미지 컨테이너 */}
            <div className="absolute inset-0 z-0">
              <img
                src={group.thumbnail || "/img/mainImg2.png"}
                alt={`${group.id} 팀 사진`}
                className="w-full h-full object-cover"
              />

              {/* 랭킹 뱃지 - 항상 보임 */}
              <div className="absolute top-2 left-2">
                <Badge
                  variant={idx + 1 <= 3 ? "default" : "outline"}
                  className={`
                    bg-slate-100
                  ${idx + 1 === 1 ? "bg-yellow-500 hover:bg-yellow-600" : ""}
                  ${idx + 1 === 2 ? "bg-slate-400 hover:bg-slate-500" : ""}
                  ${idx + 1 === 3 ? "bg-amber-700 hover:bg-amber-800" : ""}
                  
                `}
                >
                  <Trophy className="h-3 w-3 mr-1" />
                  {idx + 1}위
                </Badge>
              </div>
            </div>

            {/* 정보 패널 - 호버 시 아래로 슬라이드 */}
            <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-slate-900 p-4 transform translate-y-0 group-hover:translate-y-full transition-transform duration-300 ease-in-out">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold">{group.id}</h3>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Users className="h-4 w-4 mr-1" />
                  <span>{group.members.length}명</span>
                </div>
              </div>

              <div className="flex justify-between mt-2 text-sm">
                <div className="flex items-center">
                  <FileText className="h-4 w-4 mr-1 text-emerald-500" />
                  <span>{group.reports}개</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1 text-blue-500" />
                  <span>{group.totalMinutes}분</span>
                </div>
              </div>

              <div className="mt-2 text-xs text-muted-foreground">
                <p>{group.members.join(", ")}</p>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
