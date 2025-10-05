import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

import { studyEnroll, StudyEnrollResponse } from '@/apis/study';
import { paths } from '@/const/paths';
import { Course } from '@/interface/course';
import { SimpleUser } from '@/interface/user';
import { useNavigate } from 'react-router-dom';
import { StepAddCourses } from './StepAddCourses';
import { StepAddFriends } from './StepAddFriend';
import { StepReviewSubmit } from './StepReviewSubmit';
import { useMutation } from 'react-query';

export interface ApplicationData {
   friends: SimpleUser[];
   courses: Course[];
   semesterInfo: string;
}

const TOTAL_STEPS = 3;

interface StudyApplicationFormProps {
   currentSemesterInfo: string;
   myStudyApplication?: StudyEnrollResponse;
}

export function StudyApplicationForm({ currentSemesterInfo, myStudyApplication }: StudyApplicationFormProps) {
   const navigate = useNavigate();
   const [currentStep, setCurrentStep] = useState(1);
   const [applicationData, setApplicationData] = useState<ApplicationData>({
      friends: [],
      courses: [],
      semesterInfo: currentSemesterInfo,
   });

   useEffect(() => {
      if (myStudyApplication && (myStudyApplication.courses.length > 0 || myStudyApplication.friends.length > 0)) {
         setApplicationData({
            friends: myStudyApplication.friends,
            courses: myStudyApplication.courses,
            semesterInfo: currentSemesterInfo,
         });
      }
   }, [myStudyApplication, currentSemesterInfo]);

   const handleClickNextStep = () => {
      if (currentStep < TOTAL_STEPS) {
         if (currentStep === 2 && applicationData.courses.length === 0) {
            toast('최소 하나의 수업을 추가해주세요.');
            return;
         }
         setCurrentStep((prev) => prev + 1);
      }
   };

   const handleClickPrevStep = () => {
      if (currentStep > 1) {
         setCurrentStep((prev) => prev - 1);
      }
   };

   const updateFriends = (friends: SimpleUser[]) => {
      setApplicationData((prev) => ({ ...prev, friends }));
   };

   const updateCourses = (courses: Course[]) => {
      setApplicationData((prev) => ({ ...prev, courses }));
   };

   const { mutate: studyEnrollMutation, isLoading } = useMutation(studyEnroll, {
      onSuccess: () => {
         toast.success(`${applicationData.semesterInfo} 스터디 신청이 성공적으로 제출되었습니다.`);

         navigate(paths.application.root);
      },
      onError: (error) => {
         console.log(error);
         toast.error('스터디 신청에 실패했습니다. 다시 시도해주세요.');
      },
   });

   //TODO: 테스트 필요
   const handleSubmit = () => {
      studyEnrollMutation({
         courseIds: applicationData.courses.map((course) => course.id),
         friendIds: applicationData.friends.map((friend) => friend.id),
      });
   };

   const progressValue = (currentStep / TOTAL_STEPS) * 100;

   return (
      <Card className="p-0">
         <CardContent className="p-6">
            <Progress value={progressValue} className="mb-8" />
            {currentStep === 1 && (
               <StepAddFriends selectedFriends={applicationData.friends} onUpdateFriends={updateFriends} />
            )}
            {currentStep === 2 && (
               <StepAddCourses selectedCourses={applicationData.courses} onUpdateCourses={updateCourses} />
            )}
            {currentStep === 3 && (
               <StepReviewSubmit applicationData={applicationData} onUpdateCoursesOrder={updateCourses} />
            )}
         </CardContent>
         <CardFooter className="flex justify-between p-6 border-t">
            <Button variant="outline" onClick={handleClickPrevStep} disabled={currentStep === 1}>
               이전
            </Button>
            {currentStep < TOTAL_STEPS ? (
               <Button onClick={handleClickNextStep}>다음</Button>
            ) : (
               <Button onClick={handleSubmit} disabled={isLoading}>
                  제출
               </Button>
            )}
         </CardFooter>
      </Card>
   );
}
