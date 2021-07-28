import { User, Todo } from "../models/mod.ts";
export * from "./todo.service.ts";
export * from "./auth.service.ts";

export interface IUserRepository {
  find(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(
    params: Pick<User, "firstName" | "lastName" | "email" | "password">,
  ): Promise<boolean>;
}

export type updateParams = Partial<Todo> & Pick<Todo, "id">;
export interface ITodoRepository {
  find(id: string): Promise<Todo | null>;
  findByUserId(userId: string): Promise<Todo[]>;
  create(userId: string, title: string): Promise<boolean>;
  update(params: updateParams): Promise<boolean>;
  delete(id: string): Promise<boolean>;
}

