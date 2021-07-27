import { create, getNumericDate, verify } from "../deps.ts";

export class JwtUtil {
  async create(id: string): Promise<string> {
    const key = Deno.env.get("SECRET_KEY") || "";
    const payload = {
      id,
      exp: getNumericDate(60 * 60 * 24),
    };
    const jwt = await create({ alg: "HS512", typ: "JWT" }, payload, key);
    return jwt;
  }

  async verify(jwt: string): Promise<boolean> {
    const key = Deno.env.get("SECRET_KEY") || "";
    try {
      const payload = await verify(jwt, key, "HS512");
      return !!payload;
    } catch {
      return false;
    }
  }

  async userId(jwt: string): Promise<string> {
    const key = Deno.env.get("SECRET_KEY") || "";
    const { id } = await verify(jwt, key, "HS512");
    if (typeof id === "string") {
      return id;
    }
    throw new Error("JWT contains an invalid user_id");
  }
}
