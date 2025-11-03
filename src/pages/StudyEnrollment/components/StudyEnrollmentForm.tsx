import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

import { studyEnrollment, StudyEnrollmentResponse } from '@/apis/study';
import { paths } from '@/const/paths';
import { Course } from '@/interface/course';
import { SimpleUser } from '@/interface/user';
import { useNavigate } from 'react-router-dom';
import { StepAddCourses } from './StepAddCourses';
import { StepAddFriends } from './StepAddFriend';
import { StepReviewSubmit } from './StepReviewSubmit';
import { useMutation } from 'react-query';

export interface EnrollmentData {
   friends: SimpleUser[];
   courses: Course[];
   semesterInfo: string;
}

const TOTAL_STEPS = 3;

interface StudyEnrollmentFormProps {
   currentSemesterInfo: string;
   myStudyEnrollmentData?: StudyEnrollmentResponse;
}

export function StudyEnrollmentForm({ currentSemesterInfo, myStudyEnrollmentData }: StudyEnrollmentFormProps) {
   const navigate = useNavigate();
   const [currentStep, setCurrentStep] = useState(1);
   const [enrollmentData, setEnrollmentData] = useState<EnrollmentData>({
      friends: [],
      courses: [],
      semesterInfo: currentSemesterInfo,
   });

   useEffect(() => {
      if (
         myStudyEnrollmentData &&
         (myStudyEnrollmentData.courses.length > 0 || myStudyEnrollmentData.friends.length > 0)
      ) {
         setEnrollmentData({
            friends: myStudyEnrollmentData.friends,
            courses: myStudyEnrollmentData.courses,
            semesterInfo: currentSemesterInfo,
         });
      }
   }, [myStudyEnrollmentData, currentSemesterInfo]);

   const handleClickNextStep = () => {
      if (currentStep < TOTAL_STEPS) {
         if (currentStep === 2 && enrollmentData.courses.length === 0) {
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
      setEnrollmentData((prev) => ({ ...prev, friends }));
   };

   const updateCourses = (courses: Course[]) => {
      setEnrollmentData((prev) => ({ ...prev, courses }));
   };

   const { mutate: studyEnrollmentMutation, isLoading } = useMutation(studyEnrollment, {
      onSuccess: () => {
         toast.success(`${enrollmentData.semesterInfo} 스터디 신청이 성공적으로 제출되었습니다.`);

         navigate(paths.enrollment.root);
      },
      onError: (error) => {
         console.log(error);
         toast.error('스터디 신청에 실패했습니다. 다시 시도해주세요.');
      },
   });

   //TODO: 테스트 필요
   const handleSubmit = () => {
      studyEnrollmentMutation({
         courseIds: enrollmentData.courses.map((course) => course.id),
         friendIds: enrollmentData.friends.map((friend) => friend.id),
      });
   };

   const progressValue = (currentStep / TOTAL_STEPS) * 100;

   return (
      <Card className="p-0">
         <CardContent className="p-6">
            <Progress value={progressValue} className="mb-8" />
            {currentStep === 1 && (
               <StepAddFriends selectedFriends={enrollmentData.friends} onUpdateFriends={updateFriends} />
            )}
            {currentStep === 2 && (
               <StepAddCourses selectedCourses={enrollmentData.courses} onUpdateCourses={updateCourses} />
            )}
            {currentStep === 3 && (
               <StepReviewSubmit enrollmentData={enrollmentData} onUpdateCoursesOrder={updateCourses} />
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
