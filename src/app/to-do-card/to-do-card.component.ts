import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  output,
  Output,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ToDoItem } from '../models/ToDoItem';
import { Priority } from '../models/Priority';
import { FireStoreService } from '../services/fire-base-service';
import { ToDoStatus } from '../models/ToDoStatus';
import { ToDoItemDto } from '../models/ToDoItemDto';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'zen-to-do-card',
  standalone: true,
  imports: [
    MatCheckboxModule,
    MatCheckboxModule,
    FormsModule,
    MatIconModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatSelectModule,
  ],
  templateUrl: './to-do-card.component.html',
  styleUrl: './to-do-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToDoCardComponent implements OnInit {
  @Input() isProjectItems: boolean = false;
  @Input() toDoItem: ToDoItem | undefined;
  @Output() valueChange = new EventEmitter();

  public isCompleted: boolean = false;
  public taskPriority: string = '';
  public isEditMode: boolean = false;
  public welcome: string = 'Hello Edit';
  public editTaskForm = new FormGroup({
    taskName: new FormControl('', [Validators.required]),
    taskDescription: new FormControl(''),
    priority: new FormControl(0),
  });

  constructor(private _fireStoreService: FireStoreService) {}
  ngOnInit() {
    this.taskPriority = Priority[this.toDoItem?.priority as number];
    if (this.toDoItem?.status == ToDoStatus.closed) {
      this.isCompleted = true;
    }
  }

  public clicked(): void {
    if (this.toDoItem) {
      var item = {
        name: this.toDoItem?.name,
        description: this.toDoItem?.description,
        priority: this.toDoItem?.priority,
        project: this.toDoItem?.project,
        status: this.toDoItem?.status,
      } as ToDoItemDto;
      if (item?.status == ToDoStatus.open) {
        item.status = ToDoStatus.closed;
        this.toDoItem.status = ToDoStatus.closed;
      } else if (item?.status == ToDoStatus.closed) {
        item.status = ToDoStatus.open;
        this.toDoItem.status = ToDoStatus.open;
      }
      if (this.isProjectItems) {
        this._fireStoreService.updateProjectToDoItem(
          this.toDoItem?.key as string,
          item as ToDoItem
        );
      } else {
        this._fireStoreService.updateToDoItem(
          this.toDoItem?.key as string,
          item as ToDoItem
        );
      }
      this.valueChange.emit(this.toDoItem);
    }
    this._fireStoreService.isTaskStatusUpdate.next(true);
  }

  public setPriority(): string {
    var priority: string = 'priority-low';
    switch (this.toDoItem?.priority) {
      case Priority.high:
        priority = 'priority-high';
        return priority;
      case Priority.medium:
        priority = 'priority-medium';
        return priority;
      case Priority.low:
        priority = 'priority-low';
        return priority;
      default:
        return priority;
    }
  }

  public triggerEditMode() {
    this.isEditMode = true;
    if (this.toDoItem != null) {
      this.editTaskForm.controls.taskName.setValue(this.toDoItem.name);
      this.editTaskForm.controls.taskDescription.setValue(
        this.toDoItem.description
      );
      this.editTaskForm.controls.priority.setValue(this.toDoItem.priority);
    }
  }

  public delete() {
    if (this.toDoItem?.key) {
      if (this.isProjectItems) {
        this._fireStoreService.deleteProjectToDoItem(this.toDoItem?.key);
      }
      this._fireStoreService.deleteToDoItem(this.toDoItem?.key);
    }
  }

  public closeEditMode() {
    this.isEditMode = false;
  }

  public saveChanges() {
    if (this.isProjectItems) {
      this._fireStoreService.updateProjectToDoItem(this.toDoItem?.key, {
        name: this.editTaskForm.value.taskName,
        description: this.editTaskForm.value.taskDescription,
        priority: this.editTaskForm.value.priority,
        project: this.toDoItem?.project,
      } as unknown as ToDoItem);
    } else {
      this._fireStoreService.updateToDoItem(this.toDoItem?.key, {
        name: this.editTaskForm.value.taskName,
        description: this.editTaskForm.value.taskDescription,
        priority: this.editTaskForm.value.priority,
        project: this.toDoItem?.project,
      } as unknown as ToDoItem);
    }
    this.taskPriority = Priority[this.editTaskForm.value.priority as number];
    this.isEditMode = false;
  }

  public isFormValid(): boolean {
    return !this.editTaskForm.valid;
  }
}
