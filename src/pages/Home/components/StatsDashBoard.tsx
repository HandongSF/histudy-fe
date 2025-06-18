import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, BookOpenText, Clock, FileText } from "lucide-react";

const overallData = {
  members: 12345,
  studies: 678,
  hours: 98765,
  reports: 1234,
};

const semesterData = {
  members: 123,
  studies: 67,
  hours: 987,
  reports: 123,
};

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  description?: string;
}

function StatCard({ title, value, icon: Icon, description }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value.toLocaleString()}</div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}

export default function StatsDashboard() {
  return (
    <Tabs defaultValue="overall" className="space-y-4">
      <TabsList className="grid w-full grid-cols-2 md:w-1/3">
        <TabsTrigger value="overall">전체</TabsTrigger>
        <TabsTrigger value="semester">이번 학기</TabsTrigger>
      </TabsList>
      <TabsContent value="overall" className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="총 스터디 원"
            value={overallData.members}
            icon={Users}
            description="플랫폼 전체 활동 회원"
          />
          <StatCard
            title="총 스터디 수"
            value={overallData.studies}
            icon={BookOpenText}
            description="개설된 모든 스터디"
          />
          <StatCard
            title="총 스터디 시간"
            value={overallData.hours}
            icon={Clock}
            description="누적된 학습 시간"
          />
          <StatCard
            title="총 보고서 갯수"
            value={overallData.reports}
            icon={FileText}
            description="제출된 전체 보고서"
          />
        </div>
      </TabsContent>
      <TabsContent value="semester" className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="이번 학기 스터디 원"
            value={semesterData.members}
            icon={Users}
            description="현재 학기 활동 회원"
          />
          <StatCard
            title="이번 학기 스터디 수"
            value={semesterData.studies}
            icon={BookOpenText}
            description="현재 학기 개설 스터디"
          />
          <StatCard
            title="이번 학기 스터디 시간"
            value={semesterData.hours}
            icon={Clock}
            description="현재 학기 학습 시간"
          />
          <StatCard
            title="이번 학기 보고서 갯수"
            value={semesterData.reports}
            icon={FileText}
            description="현재 학기 제출 보고서"
          />
        </div>
      </TabsContent>
    </Tabs>
  );
}
