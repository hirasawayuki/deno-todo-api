import {RouterContext, Status} from "../deps.ts";
import { JwtService } from "../service/jwt.service.ts";

export const authMiddleware = async({response, cookies}: RouterContext, next: () => Promise<unknown>) => {
  const jwtService = new JwtService();
  const [_, error] = await jwtService.verify(cookies.get('jwt') || '');

  if (error) {
    console.log(error);
    response.status = Status.Unauthorized
    response.body = {
      message: "Unauthenticated"
    }
    return
  }

  await next();
}
