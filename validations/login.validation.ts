import {RouterContext, validate, required, isEmail ,Status} from "../deps.ts";

export const LoginValidation = async({request, response}: RouterContext, next: () => Promise<unknown>) => {
  const body = await request.body().value;

  const [passes, errors] = await validate(body, {
    email: [required, isEmail],
    password: required,
  })

  if (!passes) {
    response.status = Status.BadRequest;
    response.body = errors;
    return;
  }

  await next();
}
