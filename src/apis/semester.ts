import { Semester } from '@/interface/semester';
import axiosInstance from '@/utils/axiosInstance';

interface SemesterResponse {
   academicTerms: Semester[];
}

export const getSemester = async (): Promise<SemesterResponse> => {
   const response = await axiosInstance.get('/api/admin/academicTerm');
   return response.data;
};

export const patchCurrentSemester = async (accademyTermId: number) => {
   const response = await axiosInstance.patch(`/api/admin/academicTerm/${accademyTermId}/current`);
   return response.data;
};

export const postSemester = async (semesterBody: Pick<Semester, 'year' | 'semester'>) => {
   const response = await axiosInstance.post('/api/admin/academicTerm', {
      ...semesterBody,
   });
   return response.data;
};
