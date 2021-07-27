import { uuid } from "../deps.ts";
import { fromMap, toMap } from "./utils.ts";
import { Todo } from "../models/todo.ts";

const FILE_PATH = Deno.env.get("DENO_ENV") === "test"
  ? "./db/todos_test.json"
  : "./db/todos.json";

type updateParams = Partial<Todo> & Pick<Todo, "id">

export class TodoRepository {
  async find(id: string): Promise<Todo | null> {
    const todos = await this.findAll();
    const todo = toMap(todos).get(id);
    if (!todo) {
      return null;
    }
    return todo;
  }

  async findByUserId(userId: string): Promise<Todo[]> {
    const data = await Deno.readFile(FILE_PATH);
    const decoder = new TextDecoder();
    const todos = JSON.parse(decoder.decode(data));
    return todos.filter((todo: Todo) => todo.userId == userId);
  }

  async create(
    userId: string,
    title: string
  ): Promise<boolean> {
    const todos = await this.findAll();
    const id = uuid.generate();
    const now = new Date().toISOString();

    try {
      this.updateAll([
        ...todos,
        {
          id,
          userId,
          done: false,
          title,
          createdAt: now,
          updatedAt: now,
        },
      ]);
      return true
    } catch {
      console.log("failed to create todo")
      return false
    }
  }

  async update(params: updateParams): Promise<boolean> {
    const todos = await this.findAll();
    const todoMap = toMap(todos);
    const todo = todoMap.get(params.id);

    if (!todo) {
      return false;
    }

    try {
      todoMap.set(
        params.id,
        { ...todo, ...params, updatedAt: new Date().toISOString() },
      );
      this.updateAll(fromMap(todoMap));
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  async delete(id: string): Promise<boolean> {
    const todos = await this.findAll();
    const todoMap = toMap(todos);

    if (!todoMap.has(id)) {
      return false;
    }

    todoMap.delete(id);
    this.updateAll(fromMap(todoMap));
    return true;
  }

  private async findAll(): Promise<Todo[]> {
    const data = await Deno.readFile(FILE_PATH);
    const decoder = new TextDecoder();
    return JSON.parse(decoder.decode(data));
  }

  private updateAll(todos: Todo[]): boolean {
    const encoder = new TextEncoder();
    Deno.writeFile(
      FILE_PATH,
      encoder.encode(JSON.stringify(todos, null, "\t")),
    );
    return true;
  }
}
