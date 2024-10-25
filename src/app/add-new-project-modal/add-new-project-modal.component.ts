import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FireStoreService } from '../services/fire-base-service';
import { Project } from '../models/Project';

@Component({
  selector: 'zen-to-do-add-new-project-modal',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
  templateUrl: './add-new-project-modal.component.html',
  styleUrl: './add-new-project-modal.component.scss',
})
export class AddNewProjectModalComponent {
  public newProjectForm = new FormGroup({
    projectName: new FormControl('', [Validators.required]),
    projectTheme: new FormControl(0),
  });

  constructor(private _fireStoreService: FireStoreService) {}

  public addNewProject(): void {
    this._fireStoreService.addProject({
      project_name: this.newProjectForm.value.projectName,
      project_theme: this.newProjectForm.value.projectTheme,
      task_progress: 0,
    } as unknown as Project);
  }
  public isFormValid(): boolean {
    return !this.newProjectForm.valid;
  }
}
