import { User } from "../models/user.ts";
import { toMap, toMapEmail } from "./utils.ts";
import { uuid } from "../deps.ts";
import { IUserRepository } from "../services/mod.ts";

const FILE_PATH = Deno.env.get("DENO_ENV") === "test"
  ? "./db/users_test.json"
  : "./db/users.json";

export class UserRepository implements IUserRepository {
  async find(id: string): Promise<User | null> {
    const users = await this.getAll();
    const user = toMap(users).get(id);

    if (!user) {
      return null;
    }
    return user;
  }

  async findByEmail(
    email: string,
  ): Promise<User | null> {
    const users = await this.getAll();
    const user = toMapEmail(users).get(email);

    if (!user) {
      return null;
    }

    return user;
  }

  async create(
    { firstName, lastName, email, password }: User,
  ): Promise<boolean> {
    const users: User[] = await this.getAll();

    const id = uuid.generate();
    const result = await this.updateAll([
      ...users,
      {
        id,
        firstName,
        lastName,
        email,
        password,
      },
    ]);
    if (!result) {
      return false;
    }
    return true;
  }

  async getAll(): Promise<User[]> {
    const data = await Deno.readFile(FILE_PATH);
    const decoder = new TextDecoder();
    return JSON.parse(decoder.decode(data));
  }

  async updateAll(users: User[]): Promise<boolean> {
    const encoder = new TextEncoder();
    await Deno.writeFile(
      FILE_PATH,
      encoder.encode(JSON.stringify(users, null, "\t")),
    );
    return true;
  }
}
