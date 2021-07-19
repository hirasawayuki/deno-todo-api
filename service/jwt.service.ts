import {
  create,
  getNumericDate,
  Payload,
  RouterContext,
  verify,
} from "../deps.ts";

export class JwtService {
  async create(id: string): Promise<string> {
    const key = Deno.env.get("SECRET_KEY") || "";
    const payload = {
      id,
      exp: getNumericDate(60 * 60 * 24),
    };
    const jwt = await create({ alg: "HS512", typ: "JWT" }, payload, key);
    return jwt;
  }

  async verify(jwt: string): Promise<[Payload | undefined, Error | undefined]> {
    const key = Deno.env.get("SECRET_KEY") || "";

    try {
      const payload = await verify(jwt, key, "HS512");
      return [payload, undefined];
    } catch (e) {
      return [undefined, e];
    }
  }

  async userId(ctx: RouterContext): Promise<string> {
    const key = Deno.env.get("SECRET_KEY") || "";
    const jwt = ctx.cookies.get("jwt") || "";
    try {
      const { id } = await verify(jwt, key, "HS512");
      return id as string;
    } catch {
      return "";
    }
  }
}
