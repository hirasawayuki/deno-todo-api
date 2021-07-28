import { User } from "../models/mod.ts";
import { bcrypt } from "../deps.ts";
import { IAuthService } from "../handlers/mod.ts"
import { IUserRepository } from "./mod.ts";

export class AuthService implements IAuthService {
  constructor(
    private userRepository: IUserRepository
  ){}

  async signup(params: Pick<User, "firstName" | "lastName" | "email" | "password">): Promise<boolean> {
    const user = new User();
    user.firstName = params.firstName;
    user.lastName = params.lastName;
    user.email = params.email;
    user.password = await bcrypt.hash(params.password);

    const result = await this.userRepository.create(user);
    return result;
  }

  async authenticate(email: string, password: string): Promise<User|null> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      return null
    }

    if (!bcrypt.compareSync(password, user.password)) {
      return null;
    }

    return user
  }
}
