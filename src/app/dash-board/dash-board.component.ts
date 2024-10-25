import { Component, inject, OnInit } from '@angular/core';
import { ToDoItem } from '../models/ToDoItem';
import { FireStoreService } from '../services/fire-base-service';
import firebase from 'firebase/compat/app';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Project } from '../models/Project';
import { ProjectCardComponent } from '../project-card/project-card.component';
import { ToDoCardComponent } from '../to-do-card/to-do-card.component';
import { Priority } from '../models/Priority';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { AddNewTaskModalComponent } from '../add-new-task-modal/add-new-task-modal.component';
import { MatTabsModule } from '@angular/material/tabs';
import { AddNewProjectModalComponent } from '../add-new-project-modal/add-new-project-modal.component';
import { NoTaskCardComponent } from '../no-task-card/no-task-card.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ProjectTheme } from '../models/ProjectTheme';

@Component({
  selector: 'zen-to-do-dash-board',
  standalone: true,
  imports: [
    ProjectCardComponent,
    ToDoCardComponent,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    NoTaskCardComponent,
  ],
  templateUrl: './dash-board.component.html',
  styleUrl: './dash-board.component.scss',
})
export class DashBoardComponent implements OnInit {
  items: ToDoItem[] = [];
  projects: Project[] = [];
  user$: Observable<firebase.User | null>;
  profileImageUrl?: string | null;
  readonly dialog = inject(MatDialog);
  formattedDate: string = '';
  isAnyTaskOpen: boolean = false;
  isAnyTaskClosed: boolean = false;
  inboxProject: string = 'Inbox';
  projectCount: number = 0;
  isPotrait: boolean = false;
  timeOfday!: string;

  constructor(
    private _fireStoreService: FireStoreService,
    private auth: AngularFireAuth,
    private router: Router,
    private responsive: BreakpointObserver
  ) {
    this.user$ = this.auth.user;
  }

  public ngOnInit(): void {
    // #region To Determine the Screen Size
    this.responsive
      .observe([
        Breakpoints.HandsetPortrait,
        Breakpoints.TabletPortrait,
        Breakpoints.WebPortrait,
      ])
      .subscribe((result) => {
        if (result.matches) {
          this.isPotrait = true;
          console.log('This is phone in Landscape Mode');
        } else {
          this.isPotrait = false;
        }
      });
    // #endregion

    // #region UserInfo from Firebase
    this.user$.subscribe((user) => {
      if (user) {
        this.profileImageUrl = user.photoURL;
      }
    });
    // #endregion

    this._fireStoreService.isTaskStatusUpdate.subscribe((_) => {
      this.getAllToDoItems();
    });

    this.getAllProjects();

    this.timeOfday = this.getTimeOfDay();
  }

  public getAllToDoItems() {
    this._fireStoreService
      .getAllToDoItems()
      .snapshotChanges()
      .subscribe({
        next: (items) => {
          this.items = [];
          items.forEach((item) => {
            let toDoItem = item.payload.toJSON() as ToDoItem;
            this.items.push({
              key: item.key || '',
              name: toDoItem.name,
              description: toDoItem.description,
              project: toDoItem.project,
              status: toDoItem.status,
              priority: toDoItem.priority || Priority.low,
            });
          });
          this.isAnyTaskClosed =
            this.items.filter((item) => item.status == 1).length > 0;
          this.isAnyTaskOpen =
            this.items.filter((item) => item.status == 0).length > 0;
        },
      });
  }

  public getAllProjects() {
    this._fireStoreService
      .getAllProjects()
      .snapshotChanges()
      .subscribe({
        next: (projects) => {
          this.projects = [];
          projects.forEach((project) => {
            let projectItem = project.payload.toJSON() as Project;

            this.projects.push({
              key: project.key || '',
              project_name: projectItem.project_name,
              task_progress: projectItem.task_progress,
              project_theme: projectItem.project_theme,
            });
          });
          console.log(this.projects);
          this.projectCount = this.projects.length;
        },
      });
  }

  public openAddNewTaskModal(): void {
    this.dialog.open(AddNewTaskModalComponent, {
      data: {
        isProjectToDoItem: false,
        projectName: this.inboxProject,
      },
    });
  }

  public openAddNewProjectModal(): void {
    this.dialog.open(AddNewProjectModalComponent);
  }

  public logout() {
    this.auth.signOut().then((result) => {
      this.router.navigate(['/login']);
    });
  }

  public myProfile() {
    this.router.navigate(['/profile']);
  }

  private getTimeOfDay(): string {
    // Time and Day
    const today = new Date();
    const day = today.toLocaleDateString('en-US', { weekday: 'long' });
    const dayMonth = today.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
    });
    this.formattedDate = `${day},  ${dayMonth}`;

    // Greeting
    const currentHour = today.getHours();
    if (currentHour >= 5 && currentHour < 12) {
      return 'Morning';
    } else if (currentHour >= 12 && currentHour < 17) {
      return 'Afternoon';
    } else if (currentHour >= 17 && currentHour < 21) {
      return 'Evening';
    } else {
      return 'Night';
    }
  }
}
