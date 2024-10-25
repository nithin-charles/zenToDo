import { Component, Input, OnInit } from '@angular/core';
import { Project } from '../models/Project';
import { Router } from '@angular/router';
import {
  ProgressBarMode,
  MatProgressBarModule,
} from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { FireStoreService } from '../services/fire-base-service';
import { CommonModule } from '@angular/common';
import { ProjectTheme } from '../models/ProjectTheme';

@Component({
  selector: 'zen-to-do-project-card',
  standalone: true,
  imports: [
    MatProgressBarModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    CommonModule,
  ],
  templateUrl: './project-card.component.html',
  styleUrl: './project-card.component.scss',
})
export class ProjectCardComponent implements OnInit {
  @Input() project?: Project;
  mode: ProgressBarMode = 'determinate';
  value!: number;
  bufferValue = 75;
  /**
   *
   */
  constructor(
    private router: Router,
    private fireStoreService: FireStoreService
  ) {}
  public ngOnInit(): void {
    if (this.project != null) {
      this.value = 1 * 100;
    }
  }

  public openProfile() {
    console.log('Open Profile');
    this.router.navigate(['/project'], {
      queryParams: { key: this.project?.key },
    });
  }

  public delete(): void {
    if (this.project?.key) {
      this.fireStoreService.deleteProject(
        this.project?.key,
        this.project?.project_name
      );
    }
  }

  public projectThemeColor(): string {
    if (this.project == undefined) {
      return '';
    }
    return ProjectTheme[this.project.project_theme];
  }
}
