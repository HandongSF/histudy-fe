import { ActivityType } from "@/interface/activity";
import axiosInstance from "@/utils/axiosInstance";

interface ActivityResponse {
  studyMembers: number;
  studyGroups: number;
  studyHours: number;
  reports: number;
}

export const getActivity = async (activityType: ActivityType) => {
  const response = await axiosInstance.get<ActivityResponse>(
    `/api/public/activity?term=${activityType}`
  );
  return response.data;
};
