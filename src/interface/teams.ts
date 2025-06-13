export interface Teams {
  teams: Team[];
}

export interface Team {
  id: number;
  members: string[];
  reports: number;
  totalMinutes: number;
  thumbnail: string | null;
}
