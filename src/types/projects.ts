import type { References } from './references';

export interface Tags {
  references: string[];
  quotes: string[];
}

export interface Project {
  id: string;
  label: string;
  created_at: number;
  references: References;
  onEdited: boolean;
  tags: Tags;
}

export interface Projects {
  projects: Project[];
}
