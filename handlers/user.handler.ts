import { RouterContext, Status } from "../deps.ts";
import { UserRepository } from "../repositories/user.repository.ts";
import { Jwt } from "../utils/jwt.ts";

export class UserHandler {
  constructor(
    private userRepository: UserRepository,
    private jwtUtil: Jwt
  ) {}

  async getUser(ctx: RouterContext): Promise<void> {
    const id = await this.jwtUtil.userId(ctx);

    if (id === "") {
      ctx.response.status = Status.BadRequest;
      ctx.response.body = {
        message: "Cannot find user",
      };
      return;
    }

    const [user, error] = await this.userRepository.find(id);

    if (error) {
      ctx.response.status = Status.BadRequest;
      ctx.response.body = {
        message: error,
      };
      return;
    }

    if (!user) {
      ctx.response.status = Status.BadRequest;
      ctx.response.body = {
        message: "Cannot find user",
      };
      return;
    }

    ctx.response.status = Status.OK;
    ctx.response.body = {
      id,
      first_name: user.firstName,
      last_name: user.lastName,
      email: user.email,
    };
  }
}
