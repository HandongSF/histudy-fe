import { SemesterType } from '@/interface/semester';

export function getSemesterLabel(semesterType: SemesterType): string {
   const labels: Record<SemesterType, string> = {
      SPRING: '봄학기',
      SUMMER: '여름학기',
      FALL: '가을학기',
      WINTER: '겨울학기',
   };
   return labels[semesterType];
}
