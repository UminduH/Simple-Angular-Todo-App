import { Injectable, signal } from '@angular/core';
import { Todo } from '../models/todo';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  #todosSignal = signal<Todo[]>(this.#loadFromStorage());

  get todos() {
    return this.#todosSignal.asReadonly();
  }

  addTodo(title: string) {
    const newTodo: Todo = {
      id: Date.now(),
      title,
      completed: false,
    };
    this.#todosSignal.update((todos) => [...todos, newTodo]);
    this.#saveToStorage();
  }

  updateTodo(id: number, newTitle: string) {
    this.#todosSignal.update((todos) =>
      todos.map((todo) =>
        todo.id === id ? { ...todo, title: newTitle } : todo
      )
    );
    this.#saveToStorage();
  }

  toggleTodo(id: number) {
    this.#todosSignal.update((todos) =>
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
    this.#saveToStorage();
  }

  deleteTodo(id: number) {
    this.#todosSignal.update((todos) => todos.filter((todo) => todo.id !== id));
    this.#saveToStorage();
  }

  #saveToStorage() {
    localStorage.setItem('todos', JSON.stringify(this.#todosSignal()));
  }

  #loadFromStorage(): Todo[] {
    return JSON.parse(localStorage.getItem('todos') || '[]');
  }
}
