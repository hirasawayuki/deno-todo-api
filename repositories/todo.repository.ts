import { uuid } from "../deps.ts";
import { toMap, fromMap } from "./utils.ts";
import { Todo } from "../models/todo.ts";

const FILE_PATH = './db/todos.json';

export class TodoRepository {

  async getAll(): Promise<Todo[]> {
    const data = await Deno.readFile(FILE_PATH);
    const decoder = new TextDecoder();
    return JSON.parse(decoder.decode(data));
  }

  async get(id: string): Promise<[Todo | undefined, Error | undefined]> {
    const todos = await this.getAll();
    const todo = toMap(todos).get(id);
    if (!todo) {
      return [undefined, new Error("Cannot find item")];
    }
    return [todo, undefined];
  }

  async create(title: string): Promise<boolean> {
    const todos = await this.getAll();
    const id = uuid.generate();

    const now = new Date().toISOString();
    this.updateAll([
      ...todos,
      {
        id,
        done: false,
        title,
        createdAt: now,
        updatedAt: now,
      },
    ]);

    return true;
  }

  async update(params: Partial<Todo> & Pick<Todo, "id">):Promise<[boolean | undefined, Error | undefined]> {
    const todos = await this.getAll();
    const todoMap = toMap(todos);
    const current = todoMap.get(params.id);

    if (!current) {
      return [undefined, new Error("Cannot find item")];
    }

    todoMap.set(
      params.id,
      { ...current, ...params, updatedAt: new Date().toISOString() },
    );
    this.updateAll(fromMap(todoMap));
    return [true, undefined];
  }

  async remove(id: string): Promise<[boolean | undefined, Error | undefined]> {
    const todos = await this.getAll();
    const todoMap = toMap(todos);

    if (!todoMap.has(id)) {
      return [undefined, new Error("Cannot find item")];
    }

    todoMap.delete(id);
    this.updateAll(fromMap(todoMap));
    return [true, undefined];
  }

  updateAll(todos: Todo[]): boolean {
    const encoder = new TextEncoder();
    Deno.writeFile(
      FILE_PATH,
      encoder.encode(JSON.stringify(todos)),
    );
    return true;
  }
}
