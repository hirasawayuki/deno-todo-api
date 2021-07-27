import { RouterContext, Status } from "../deps.ts";
import { JwtUtil } from "../utils/jwt.ts";

export const authMiddleware = async (
  { response, cookies }: RouterContext,
  next: () => Promise<unknown>,
) => {
  const jwtUtil = new JwtUtil();
  const result = await jwtUtil.verify(cookies.get("jwt") || "");

  if (!result) {
    response.status = Status.Unauthorized;
    response.body = {
      message: "Unauthenticated",
    };
    return;
  }

  return await next();
};
