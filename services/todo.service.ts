import { Todo } from "../models/todo.ts";
import { ITodoRepository, updateParams } from "./mod.ts";

export class TodoService {
  constructor(
    private todoRepository: ITodoRepository,
  ) {}

  async get(id: string): Promise<Todo | null> {
    const todo = await this.todoRepository.find(id);
    return todo;
  }

  async getAll(userId: string): Promise<Todo[]> {
    const todos = await this.todoRepository.findByUserId(userId);
    return todos;
  }

  async register(userId: string, titile: string): Promise<boolean> {
    const result = await this.todoRepository.create(userId, titile);
    return result;
  }

  async update(params: updateParams): Promise<boolean> {
    const result = await this.todoRepository.update(params);
    return result;
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.todoRepository.delete(id);
    return result;
  }
}
