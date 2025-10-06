import { SimpleCourse } from './course';

export type SimpleUser = Pick<User, 'id' | 'name' | 'sid'>;

export interface User {
   id: number;
   name: string;
   sid: string;
   email: string;
}

export type TeamMember = User & {
   tag: number;
};

export type GroupMemberWithStudyInfo = User & {
   group: number;
   friends: SimpleUser[];
   courses: SimpleCourse[];
};

export type UnAssignedUser = User & {
   group: null;
   friends: SimpleUser[];
   courses: SimpleCourse[];
};

/** for 어드민 페이지 */
export interface StudyApplyUser {
   id: number;
   name: string;
   sid: string;
   group: number;
   email: string;
   friends: SimpleUser[];
   courses: SimpleCourse[];
}
