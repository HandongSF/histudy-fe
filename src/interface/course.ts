export interface Courses {
   courses: Course[];
}

export interface Course {
   id: number;
   name: string;
   prof: string;
   code: string;
   year: number;
   semester: number;
}

export type SimpleCourse = Pick<Course, 'id' | 'name' | 'prof'>;
