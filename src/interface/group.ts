import { GroupMemberWithStudyInfo } from "./user";

export interface Group {
  group: number;
  tag: number;
  members: GroupMemberWithStudyInfo[];
  reports: number;
  times: number;
}
