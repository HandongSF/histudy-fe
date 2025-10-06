import { getMyGroup } from '@/apis/study';
import { WaveLoading } from '@/components/WaveLoading';
import { useQuery } from 'react-query';
import { StudyApplicationForm } from './components/StudyApplicationForm';

// 예시: 현재 학기 정보 (실제로는 동적으로 가져오거나 설정 파일 등에서 관리)
const CURRENT_SEMESTER_INFO = '2025년 2학기';

export default function StudyApplicationPage() {
   const { data: myStudyApplication, isLoading } = useQuery('getMyStudyApplication', getMyGroup);

   if (isLoading) {
      return <WaveLoading />;
   }

   return (
      <div className="min-h-screen ">
         <div className="container mx-auto py-8 px-4">
            <header className="mb-8">
               <h1 className="text-3xl font-bold tracking-tight mb-2">스터디 신청</h1>
               <p className="text-muted-foreground">
                  <span className="font-semibold text-primary">{CURRENT_SEMESTER_INFO}</span> 스터디 신청입니다.
                  <br />
                  아래 단계를 따라 스터디 신청을 완료해주세요.
               </p>
            </header>

            <StudyApplicationForm currentSemesterInfo={CURRENT_SEMESTER_INFO} myStudyApplication={myStudyApplication} />
         </div>
      </div>
   );
}
