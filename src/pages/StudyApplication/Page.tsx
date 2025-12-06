import { getMyGroup } from '@/apis/study';
import { WaveLoading } from '@/components/WaveLoading';
import { useHIStateValue } from '@/hooks/HIState';
import { currentSemesterState } from '@/store/HISAtom';
import { getSemesterLabel } from '@/utils/semester';
import { useQuery } from 'react-query';
import { StudyApplicationForm } from './components/StudyApplicationForm';

export default function StudyApplicationPage() {
   const currentSemester = useHIStateValue(currentSemesterState);
   const { data: myStudyApplication, isLoading } = useQuery('getMyStudyApplication', getMyGroup);

   if (isLoading) {
      return <WaveLoading />;
   }

   const currentSemesterInfo = currentSemester
      ? `${currentSemester.year}년 ${getSemesterLabel(currentSemester.semester)}`
      : '';

   return (
      <div className="min-h-screen ">
         <div className="container mx-auto py-8 px-4">
            <header className="mb-8">
               <h1 className="text-3xl font-bold tracking-tight mb-2">스터디 신청</h1>
               <p className="text-muted-foreground">
                  <span className="font-semibold text-primary">{currentSemesterInfo}</span> 스터디 신청입니다.
                  <br />
                  아래 단계를 따라 스터디 신청을 완료해주세요.
               </p>
            </header>

            <StudyApplicationForm currentSemesterInfo={currentSemesterInfo} myStudyApplication={myStudyApplication} />
         </div>
      </div>
   );
}
