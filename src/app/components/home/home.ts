import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TodoService } from '../../services/todo-service';
import { TodoItem } from '../todo-item/todo-item';
import { Todo } from '../../models/todo';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, CommonModule, TodoItem],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms ease-in', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('200ms ease-out', style({ opacity: 0 }))]),
    ]),
  ],
})
export class Home {
  newTodo = '';
  filter: 'all' | 'active' | 'completed' = 'all';
  isDarkMode = false;

  constructor(public todoService: TodoService) {
    const stored = localStorage.getItem('dark-mode');
    this.isDarkMode = stored === 'true';
    this.#applyTheme();
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('dark-mode', String(this.isDarkMode));
    this.#applyTheme();
  }

  #applyTheme() {
    const body = document.body;
    if (this.isDarkMode) {
      body.classList.add('dark');
    } else {
      body.classList.remove('dark');
    }
  }

  addTodo() {
    if (this.newTodo.trim()) {
      this.todoService.addTodo(this.newTodo.trim());
      this.newTodo = '';
    }
  }

  setFilter(value: 'all' | 'active' | 'completed') {
    this.filter = value;
  }

  get filteredTodos(): Todo[] {
    const todos = this.todoService.todos();
    switch (this.filter) {
      case 'active':
        return todos.filter((t) => !t.completed);
      case 'completed':
        return todos.filter((t) => t.completed);
      default:
        return todos;
    }
  }
}
