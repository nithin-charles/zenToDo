import { Priority } from './Priority';
import { ToDoStatus } from './ToDoStatus';

export interface ToDoItemDto {
  name: string;
  description?: string;
  project: string;
  status: ToDoStatus;
  priority: Priority;
}
