import StatsDashboard from "@/components/Main/StatsDashBoard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"; // Card 컴포넌트 import 추가
import { Annoyed, CheckCircle, Zap } from "lucide-react"; // 아이콘 추가

const recentUpdates = [
  {
    id: 1,
    title: "새로운 '실시간 협업' 기능 추가!",
    description:
      "이제 스터디원들과 함께 문서를 실시간으로 편집하고 아이디어를 공유할 수 있습니다.",
    date: "2025년 6월 15일",
    icon: Zap,
    tag: "New Feature",
    tagColor:
      "bg-green-100 text-green-700 dark:bg-green-700/30 dark:text-green-300",
  },
  {
    id: 2,
    title: "모바일 UI 개선",
    description:
      "더욱 편리한 모바일 학습 경험을 위해 사용자 인터페이스를 대폭 개선했습니다.",
    date: "2025년 6월 10일",
    icon: CheckCircle,
    tag: "Improvement",
    tagColor:
      "bg-blue-100 text-blue-700 dark:bg-blue-700/30 dark:text-blue-300",
  },
  {
    id: 3,
    title: "보고서 템플릿 다양화",
    description:
      "다양한 학습 목표와 스타일에 맞는 새로운 보고서 템플릿 5종이 추가되었습니다.",
    date: "2025년 6월 5일",
    icon: CheckCircle,
    tag: "Content Update",
    tagColor:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-700/30 dark:text-yellow-300",
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-muted/40">
      <div className="min-h-screen ">
        <div className="container mx-auto py-8 px-4">
          {/* <header className="bg-background shadow-sm"> */}
          <div className="container mx-auto">
            <img
              src="/img/banner2.png"
              alt="플랫폼 배너"
              width={1200}
              height={300}
              className="w-full h-auto max-h-64 md:max-h-96 object-cover rounded-lg"
            />
          </div>
          {/* </header> */}

          {/* 최신 업데이트 소식 섹션 추가 */}
          <section className="container mx-auto py-8 md:py-12">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100">
                <Zap className="inline-block w-8 h-8 mr-2 text-amber-500" />
                최신 업데이트 소식
              </h2>
              <p className="mt-3 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                여러분의 학습 여정을 더욱 풍요롭게 만들기 위한 플랫폼의 새로운
                기능과 개선 사항들을 확인해 보세요.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {recentUpdates.map((update) => (
                <Card
                  key={update.id}
                  className=" pb-0 flex flex-col bg-white dark:bg-slate-800 shadow-lg rounded-xl overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center mb-2">
                      <update.icon
                        className={`w-6 h-6 mr-3 ${update.tagColor
                          .replace("bg-", "text-")
                          .replace("/30", "")}`}
                      />
                      <CardTitle className="text-xl font-semibold text-slate-800 dark:text-slate-100">
                        {update.title}
                      </CardTitle>
                    </div>
                    <span
                      className={`px-2 py-0.5 text-xs font-medium rounded-full ${update.tagColor}`}
                    >
                      {update.tag}
                    </span>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <CardDescription className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                      {update.description}
                    </CardDescription>
                  </CardContent>
                  <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      업데이트 날짜: {update.date}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
            {recentUpdates.length === 0 && (
              <Card className="py-0 col-span-full bg-white dark:bg-slate-800 shadow-lg rounded-xl p-8 text-center">
                <Annoyed className="w-16 h-16 mx-auto text-slate-400 dark:text-slate-500 mb-4" />
                <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-2">
                  새로운 업데이트가 아직 없어요!
                </h3>
                <p className="text-slate-500 dark:text-slate-400">
                  곧 멋진 기능들로 찾아뵙겠습니다. 조금만 기다려주세요.
                </p>
              </Card>
            )}
          </section>

          {/* <main className="flex-1 container mx-auto p-4 md:p-6">
        <StatsDashboard />
      </main> */}
          <main className="flex-1 container mx-auto">
            <StatsDashboard />
          </main>
          {/* <footer className="py-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} 스터디 플랫폼. 모든 권리 보유.
      </footer> */}
        </div>
      </div>
    </div>
  );
}
