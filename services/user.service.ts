import { IUserRepository } from "./mod.ts";
import { User } from "../models/mod.ts";

export class UserService {
  constructor(
    private userRepository: IUserRepository,
  ) {}

  async getUser(userId: string): Promise<User | null> {
    const user = await this.userRepository.find(userId);
    return user;
  }
}
