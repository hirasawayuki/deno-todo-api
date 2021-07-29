import { RouterContext } from "../deps.ts";
import { handleBadRequest, handleOK } from "./handle_response.ts";
import { IJwtUtil, IUserService } from "./mod.ts";

export class UserHandler {
  constructor(
    private userService: IUserService,
    private jwtUtil: IJwtUtil,
  ) {}

  async getUser(ctx: RouterContext): Promise<void> {
    const jwt = ctx.cookies.get("jwt") || "";
    let userId = "";

    try {
      userId = await this.jwtUtil.userId(jwt);
    } catch (error) {
      console.log(error);
      handleBadRequest(ctx, "cannot find user");
      return;
    }

    const user = await this.userService.getUser(userId);

    if (!user) {
      handleBadRequest(ctx, "Cannot find user");
      return;
    }

    handleOK(ctx, {
      user: {
        id: userId,
        first_name: user.firstName,
        last_name: user.lastName,
        email: user.email,
      },
    });
  }
}
