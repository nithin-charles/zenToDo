import { ProjectTheme } from './ProjectTheme';

export interface Project {
  key: string;
  project_name: string;
  task_progress: number;
  project_theme: ProjectTheme;
}
