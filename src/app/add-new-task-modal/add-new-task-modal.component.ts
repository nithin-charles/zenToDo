import { Component, inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
} from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { FireStoreService } from '../services/fire-base-service';
import { ToDoItem } from '../models/ToDoItem';
import { ToDoStatus } from '../models/ToDoStatus';
import { _fixedSizeVirtualScrollStrategyFactory } from '@angular/cdk/scrolling';
import { ModalData } from '../models/ModalData';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'zen-to-do-add-new-task-modal',
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
  templateUrl: './add-new-task-modal.component.html',
  styleUrl: './add-new-task-modal.component.scss',
})
export class AddNewTaskModalComponent implements OnInit {
  data: ModalData = inject(MAT_DIALOG_DATA);
  public newTaskForm = new FormGroup({
    taskName: new FormControl('', [Validators.required]),
    taskDescription: new FormControl(''),
    priority: new FormControl(0),
    project: new FormControl(''),
  });
  isPotrait?: boolean;

  constructor(
    private _fireStoreService: FireStoreService,
    private _responsive: BreakpointObserver
  ) {}

  ngOnInit(): void {
    this._responsive
      .observe([
        Breakpoints.HandsetPortrait,
        Breakpoints.TabletPortrait,
        Breakpoints.WebPortrait,
      ])
      .subscribe((result) => {
        if (result.matches) {
          this.isPotrait = true;
        } else {
          this.isPotrait = false;
        }
      });
  }

  public addNewTask(): void {
    if (!this.data.isProjectToDoItem) {
      this._fireStoreService.addToDoItem({
        name: this.newTaskForm.value.taskName,
        description: this.newTaskForm.value.taskDescription,
        status: ToDoStatus.open,
        priority: this.newTaskForm.value.priority,
        project: this.data.projectName,
      } as unknown as ToDoItem);
    } else {
      this._fireStoreService.addProjectToDoItem({
        name: this.newTaskForm.value.taskName,
        description: this.newTaskForm.value.taskDescription,
        status: ToDoStatus.open,
        priority: this.newTaskForm.value.priority,
        project: this.data.projectName,
      } as unknown as ToDoItem);
    }
  }
  public isFormValid(): boolean {
    return !this.newTaskForm.valid;
  }
}
