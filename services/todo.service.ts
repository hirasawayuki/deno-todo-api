import { Todo } from "../models/todo.ts";

type updateParams = Partial<Todo> & Pick<Todo, "id">;

interface ITodoRepository {
  find(id: string): Promise<Todo | null>;
  findByUserId(userId: string): Promise<Todo[]>;
  create(userId: string, title: string): Promise<boolean>;
  update(params: updateParams): Promise<boolean>;
  delete(id: string): Promise<boolean>;
}

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
