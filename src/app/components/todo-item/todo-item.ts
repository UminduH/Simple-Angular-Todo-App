import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Todo } from '../../models/todo';
import { TodoService } from '../../services/todo-service';
import { FormsModule } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-todo-item',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './todo-item.html',
  styleUrls: ['./todo-item.css'],
  animations: [
    trigger('todoAnim', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('300ms ease-out'),
      ]),
      transition(':leave', [
        animate(
          '200ms ease-in',
          style({ opacity: 0, transform: 'translateY(10px)' })
        ),
      ]),
    ]),
  ],
})
export class TodoItem {
  @Input() todo!: Todo;

  isEditing = false;
  editTitle = '';

  constructor(private todoService: TodoService) {}

  toggle() {
    this.todoService.toggleTodo(this.todo.id);
  }

  delete() {
    this.todoService.deleteTodo(this.todo.id);
  }

  startEdit() {
    this.isEditing = true;
    this.editTitle = this.todo.title;
  }

  cancelEdit() {
    this.isEditing = false;
  }

  saveEdit() {
    const trimmed = this.editTitle.trim();
    if (trimmed) {
      this.todoService.updateTodo(this.todo.id, trimmed);
    }
    this.isEditing = false;
  }

  handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') this.saveEdit();
    if (event.key === 'Escape') this.cancelEdit();
  }
}
