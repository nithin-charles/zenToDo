import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FireStoreService } from '../services/fire-base-service';
import { Project } from '../models/Project';
import { ToDoItem } from '../models/ToDoItem';
import {
  MatProgressBarModule,
  ProgressBarMode,
} from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { NoTaskCardComponent } from '../no-task-card/no-task-card.component';
import { ToDoCardComponent } from '../to-do-card/to-do-card.component';
import { MatDialog } from '@angular/material/dialog';
import { AddNewTaskModalComponent } from '../add-new-task-modal/add-new-task-modal.component';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { ProjectTheme } from '../models/ProjectTheme';

@Component({
  selector: 'zen-to-do-project',
  standalone: true,
  imports: [
    MatProgressBarModule,
    MatIconModule,
    MatTabsModule,
    NoTaskCardComponent,
    ToDoCardComponent,
    MatButtonModule,
    CommonModule,
  ],
  templateUrl: './project.component.html',
  styleUrl: './project.component.scss',
})
export class ProjectComponent implements OnInit {
  public key!: string;
  public project!: Project;
  public toDoItems!: ToDoItem[];
  openTaskCount!: number;
  closedTaskCount!: number;
  mode: ProgressBarMode = 'determinate';
  formattedDate: string = '';
  value: number = 0;
  bufferValue = 75;
  isAnyTaskClosed!: boolean;
  isAnyTaskOpen!: boolean;
  readonly dialog = inject(MatDialog);

  constructor(
    private route: ActivatedRoute,
    private firebaseStoreService: FireStoreService,
    private router: Router
  ) {}

  public ngOnInit(): void {
    this.route.queryParams.subscribe((param) => {
      this.key = param['key'];
      console.log(this.key);
      this.firebaseStoreService
        .getProjectByKey(this.key)
        .snapshotChanges()
        .subscribe((project) => {
          this.project = project.payload.toJSON() as Project;
          console.log(this.project);
          this.firebaseStoreService
            .getToDoItemsByProject(this.project.project_name)
            .snapshotChanges()
            .subscribe((data) => {
              this.toDoItems = [];
              data.forEach((item: any) => {
                let toDoItem = item.payload.toJSON() as ToDoItem;
                this.toDoItems.push({
                  key: item.key,
                  name: toDoItem.name,
                  description: toDoItem.description,
                  project: toDoItem.project,
                  status: toDoItem.status,
                  priority: toDoItem.priority,
                });
                this.closedTaskCount = this.toDoItems.filter(
                  (item) => item.status == 1
                ).length;

                this.isAnyTaskClosed = this.closedTaskCount > 0;

                this.openTaskCount = this.toDoItems.filter(
                  (item) => item.status == 0
                ).length;

                this.isAnyTaskOpen = this.openTaskCount > 0;
              });
              if (this.openTaskCount > 0 || this.closedTaskCount > 0) {
                this.value =
                  (this.closedTaskCount /
                    (this.openTaskCount + this.closedTaskCount)) *
                  100;
                this.project.task_progress = this.value;

                this.firebaseStoreService.updateProject(this.key, this.project);
              }
            });
        });
    });

    const today = new Date();
    const day = today.toLocaleDateString('en-US', { weekday: 'long' });
    const dayMonth = today.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
    });
    this.formattedDate = `${day},  ${dayMonth}`;
  }

  public backToDashBoard() {
    this.router.navigate(['/dashboard']);
  }

  public openAddNewTaskModal(): void {
    this.dialog.open(AddNewTaskModalComponent, {
      data: {
        isProjectToDoItem: true,
        projectName: this.project.project_name,
      },
    });
  }

  public projectThemeColor(): string {
    return ProjectTheme[this.project.project_theme];
  }
}
