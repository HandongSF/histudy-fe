import { getActivity } from "@/apis/activity";
import SpinnerLoading from "@/components/SpinnerLoading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ActivityType } from "@/interface/activity";
import { BookOpenText, Clock, FileText, Users } from "lucide-react";
import { useState } from "react";
import { useQuery } from "react-query";

interface ActivityCardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  description?: string;
}

function ActivityCard({
  title,
  value,
  icon: Icon,
  description,
}: ActivityCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-md font-medium">{title}</CardTitle>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between">
          <div className="text-3xl font-bold">{value}</div>
          {description && (
            <p className="text-md text-muted-foreground">{description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function ActivityDashboard() {
  const [activityType, setActivityType] = useState<ActivityType>("all");
  const { data: activity, isLoading: activityLoading } = useQuery(
    ["activity", activityType],
    () => getActivity(activityType),
    {
      staleTime: 1000 * 60 * 30,
      refetchOnWindowFocus: false,
    }
  );

  return (
    <Tabs
      value={activityType}
      onValueChange={(value) => setActivityType(value as ActivityType)}
      defaultValue="all"
      className="space-y-4"
    >
      <TabsList className="grid w-full grid-cols-2 md:w-1/3">
        <TabsTrigger value="all">전체</TabsTrigger>
        <TabsTrigger value="current">이번 학기</TabsTrigger>
      </TabsList>
      {!activity || activityLoading ? (
        <SpinnerLoading />
      ) : (
        <>
          <TabsContent value="all" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <ActivityCard
                title="총 스터디 원"
                value={activity.studyMembers}
                icon={Users}
                description="명"
              />
              <ActivityCard
                title="총 스터디 수"
                value={activity.studyGroups}
                icon={BookOpenText}
                description="개"
              />
              <ActivityCard
                title="총 스터디 시간"
                value={activity.studyHours}
                icon={Clock}
                description="시간"
              />
              <ActivityCard
                title="총 보고서 갯수"
                value={activity.reports}
                icon={FileText}
                description="개"
              />
            </div>
          </TabsContent>
          <TabsContent value="current" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <ActivityCard
                title="이번 학기 스터디 원"
                value={activity.studyMembers}
                icon={Users}
                description="명"
              />
              <ActivityCard
                title="이번 학기 스터디 수"
                value={activity.studyGroups}
                icon={BookOpenText}
                description="개"
              />
              <ActivityCard
                title="이번 학기 스터디 시간 "
                value={activity.studyHours}
                icon={Clock}
                description="시간"
              />
              <ActivityCard
                title="이번 학기 보고서 갯수"
                value={activity.reports}
                icon={FileText}
                description="개"
              />
            </div>
          </TabsContent>
        </>
      )}
    </Tabs>
  );
}
