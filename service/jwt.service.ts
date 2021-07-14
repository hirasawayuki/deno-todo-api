import { create, getNumericDate } from "../deps.ts";

export class JwtService {
  async create(id: string) {
    const key = Deno.env.get('SECRET_KEY') || '';
    const payload = {
      id,
      exp: getNumericDate(60 * 60 * 24)
    }
    const jwt = await create({ alg: "HS512", typ: "JWT"}, payload, key);
    return jwt
  }
}
