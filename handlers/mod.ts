import { Todo, User } from "../models/mod.ts";
export * from "./root.handler.ts";
export * from "./todo.handler.ts";
export * from "./auth.handler.ts";
export * from "./user.handler.ts";

export interface IJwtUtil {
  create(userId: string): Promise<string>;
  verify(jwt: string): Promise<boolean>;
  userId(jwt: string): Promise<string>;
}

export type todoParams = Partial<Todo> & Pick<Todo, "id">;
export interface IAuthService {
  signup(
    params: Pick<User, "firstName" | "lastName" | "email" | "password">,
  ): Promise<boolean>;
  authenticate(email: string, password: string): Promise<User | null>;
}
export interface IUserService {
  getUser(userId: string): Promise<User | null>;
}
