import { User } from "../models/user.ts";
import { toMap, toMapEmail } from "./utils.ts";
import { uuid } from "../deps.ts";
const FILE_PATH = "./db/users.json";

export class UserRepository {
  async find(id: string): Promise<[User | undefined, Error | undefined]> {
    const users = await this.getAll();
    const user = toMap(users).get(id);

    if (!user) {
      return [undefined, new Error("Cannot find user")];
    }
    return [user, undefined];
  }

  async findByEmail(
    email: string,
  ): Promise<[User | undefined, Error | undefined]> {
    const users = await this.getAll();
    const user = toMapEmail(users).get(email);

    if (!user) {
      return [undefined, new Error("Cannot find user")];
    }

    return [user, undefined];
  }

  async create(
    { first_name, last_name, email, password }: User,
  ): Promise<boolean> {
    const users: User[] = await this.getAll();

    const id = uuid.generate();
    this.updateAll([
      ...users,
      {
        id,
        first_name,
        last_name,
        email,
        password,
      },
    ]);
    return true;
  }

  async getAll(): Promise<User[]> {
    const data = await Deno.readFile(FILE_PATH);
    const decoder = new TextDecoder();
    return JSON.parse(decoder.decode(data));
  }

  updateAll(users: User[]): boolean {
    const encoder = new TextEncoder();
    Deno.writeFile(
      FILE_PATH,
      encoder.encode(JSON.stringify(users)),
    );
    return true;
  }
}
