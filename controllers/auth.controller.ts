import { RouterContext} from "../deps.ts";

export const Register = async ({request, response}: RouterContext) => {
  const body = await request.body().value;
  response.body = body;
}
