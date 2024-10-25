import { Priority } from './Priority';
import { ToDoStatus } from './ToDoStatus';

export interface ToDoItem {
  key: string;
  name: string;
  description: string;
  project: string;
  status: ToDoStatus;
  priority: Priority;
}
