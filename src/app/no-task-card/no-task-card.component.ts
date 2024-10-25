import { Component, Input } from '@angular/core';
import { ToDoStatus } from '../models/ToDoStatus';

@Component({
  selector: 'zen-to-do-no-task-card',
  standalone: true,
  imports: [],
  templateUrl: './no-task-card.component.html',
  styleUrl: './no-task-card.component.scss',
})
export class NoTaskCardComponent {
  @Input() cardType?: ToDoStatus;
}
