import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";

import { StepAddCourses } from "./StepAddCourses";
import { StepReviewSubmit } from "./StepReviewSubmit";
import { StepAddFriends } from "./StepAddFriend";
import { User } from "@/interface/user";
import { Course } from "@/interface/course";

export interface ApplicationData {
  friends: User[];
  courses: Course[];
  semesterInfo: string; // 신청 학기 정보
}

const TOTAL_STEPS = 3;

interface StudyApplicationFormProps {
  currentSemesterInfo: string;
}

export function StudyApplicationForm({
  currentSemesterInfo,
}: StudyApplicationFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [applicationData, setApplicationData] = useState<ApplicationData>({
    friends: [],
    courses: [],
    semesterInfo: currentSemesterInfo,
  });

  const nextStep = () => {
    if (currentStep < TOTAL_STEPS) {
      if (currentStep === 1 && applicationData.friends.length === 0) {
        toast("최소 한 명의 친구를 추가해주세요.");
        return;
      }
      if (currentStep === 2 && applicationData.courses.length === 0) {
        toast("최소 하나의 수업을 추가해주세요.");
        return;
      }
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const updateFriends = (friends: User[]) => {
    setApplicationData((prev) => ({ ...prev, friends }));
  };

  const updateCourses = (courses: Course[]) => {
    setApplicationData((prev) => ({ ...prev, courses }));
  };

  const handleSubmit = () => {
    console.log("신청 데이터:", applicationData);
    toast.success(
      `${applicationData.semesterInfo} 스터디 신청이 성공적으로 제출되었습니다.`
    );
    // setApplicationData({ friends: [], courses: [], semesterInfo: currentSemesterInfo });
    // setCurrentStep(1);
  };

  const progressValue = (currentStep / TOTAL_STEPS) * 100;

  return (
    <Card className="p-0">
      <CardContent className="p-6">
        <Progress value={progressValue} className="mb-8" />
        {currentStep === 1 && (
          <StepAddFriends
            selectedFriends={applicationData.friends}
            onUpdateFriends={updateFriends}
          />
        )}
        {currentStep === 2 && (
          <StepAddCourses
            selectedCourses={applicationData.courses}
            onUpdateCourses={updateCourses}
          />
        )}
        {currentStep === 3 && (
          <StepReviewSubmit
            applicationData={applicationData}
            onUpdateCoursesOrder={updateCourses}
          />
        )}
      </CardContent>
      <CardFooter className="flex justify-between p-6 border-t">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1}
        >
          이전
        </Button>
        {currentStep < TOTAL_STEPS ? (
          <Button onClick={nextStep}>다음</Button>
        ) : (
          <Button onClick={handleSubmit}>제출</Button>
        )}
      </CardFooter>
    </Card>
  );
}
