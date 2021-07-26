import { RouterContext, Status } from "../deps.ts";
import { Jwt } from "../utils/jwt.ts";

export const authMiddleware = async (
  { response, cookies }: RouterContext,
  next: () => Promise<unknown>,
) => {
  const jwtUtil = new Jwt();
  const [_, error] = await jwtUtil.verify(cookies.get("jwt") || "");

  if (error) {
    console.log(error);
    response.status = Status.Unauthorized;
    response.body = {
      message: "Unauthenticated",
    };
    return;
  }

  await next();
};
