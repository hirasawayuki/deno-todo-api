import { RouterContext } from "../deps.ts";
import { User } from "../models/mod.ts";
import {
  handleBadRequest,
  handleOK,
} from "./handle_response.ts";

interface IUserRepository {
  find(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(
    params: Pick<User, "firstName" | "lastName" | "email" | "password">,
  ): Promise<boolean>;
}

interface IJwtUtil {
  userId(jwt: string): Promise<string>;
}

export class UserHandler {
  constructor(
    private userRepository: IUserRepository,
    private jwtUtil: IJwtUtil,
  ) {}

  async getUser(ctx: RouterContext): Promise<void> {
    const jwt = ctx.cookies.get("jwt") || "";
    let id = "";

    try {
      id = await this.jwtUtil.userId(jwt);
    } catch (error) {
      console.log(error);
      handleBadRequest(ctx, "cannot find user");
      return;
    }

    const user = await this.userRepository.find(id);

    if (!user) {
      handleBadRequest(ctx, "Cannot find user");
      return;
    }

    handleOK(ctx, {
      user: {
        id,
        first_name: user.firstName,
        last_name: user.lastName,
        email: user.email,
      },
    });
  }
}
