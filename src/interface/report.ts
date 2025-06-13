import { Course, SimpleCourse } from "./course";
import { SimpleUser } from "./user";

export interface NewReport {
  title: string;
  content: string;
  totalMinutes: number;
  participants: number[];
  images: string[];
  courses: number[];
}

export interface Reports {
  reports: Report[];
}

export interface Report {
  id: number;
  title: string;
  content: string;
  totalMinutes: number;
  participants: SimpleUser[];
  courses: SimpleCourse[];
  images: Image[];
  regDate: string;
}

export interface SimpleReport
  extends Pick<Report, "id" | "title" | "regDate" | "totalMinutes"> {
  thumbnail: string;
}

interface Image {
  id: number;
  url: string;
}
