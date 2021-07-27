import { RouterContext, Status } from "../deps.ts";
import { UserRepository } from "../repositories/user.repository.ts";
import { JwtUtil } from "../utils/jwt.ts";

export class UserHandler {
  constructor(
    private userRepository: UserRepository,
    private jwtUtil: JwtUtil,
  ) {}

  async getUser({ cookies, response }: RouterContext): Promise<void> {
    const jwt = cookies.get("jwt") || "";
    let id = "";

    try {
      id = await this.jwtUtil.userId(jwt);
    } catch(e) {
      console.log(e);
      response.status = Status.BadRequest;
      response.body = {
        message: "Cannot find user",
      };
      return;
    }

    const [user, error] = await this.userRepository.find(id);

    if (error) {
      response.status = Status.BadRequest;
      response.body = {
        message: error,
      };
      return;
    }

    if (!user) {
      response.status = Status.BadRequest;
      response.body = {
        message: "Cannot find user",
      };
      return;
    }

    response.status = Status.OK;
    response.body = {
      id,
      first_name: user.firstName,
      last_name: user.lastName,
      email: user.email,
    };
  }
}
