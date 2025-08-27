export interface Semester {
  academicTermId: number;
  year: number;
  semester: SemesterType;
  isCurrent: boolean;
}

export type SemesterType = "SPRING" | "SUMMER" | "FALL" | "WINTER";
