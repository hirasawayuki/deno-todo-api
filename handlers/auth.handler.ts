import { RouterContext } from "../deps.ts";
import { handleBadRequest, handleOK } from "./handle_response.ts";
import { IAuthService, IJwtUtil } from "./mod.ts";

export class AuthHandler {
  constructor(
    private authService: IAuthService,
    private jwtUtil: IJwtUtil,
  ) {}

  async signup(ctx: RouterContext): Promise<void> {
    const body = await ctx.request.body().value;
    const result = await this.authService.signup(body);

    if (!result) {
      handleBadRequest(ctx, "user registration has failed");
      return;
    }

    handleOK(ctx, { message: "signup successful" });
  }

  async login(ctx: RouterContext): Promise<void> {
    const { email, password } = await ctx.request.body().value;

    const user = await this.authService.authenticate(email, password);

    if (!user) {
      handleBadRequest(ctx, "login information is incorrect");
      return;
    }

    const jwt = await this.jwtUtil.create(user.id);
    ctx.cookies.set("jwt", jwt, { httpOnly: true });

    handleOK(ctx, { message: "login successful" });
  }

  logout(ctx: RouterContext): void {
    ctx.cookies.delete("jwt");
    handleOK(ctx, { message: "logout successful" });
  }
}
