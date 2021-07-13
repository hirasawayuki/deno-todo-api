import {RouterContext, validate, required, isEmail ,Status} from "../deps.ts";

export const RegisterValidation = async({request, response}: RouterContext, next: () => Promise<unknown>) => {
  const body = await request.body().value;
  const [passes, errors] = await validate(body, {
    first_name: required,
    last_name: required,
    email: [required, isEmail],
    password: required,
    password_confirm: required
  })

  if (!passes) {
    response.status = Status.BadRequest;
    response.body = errors;
    return;
  }

  if (body.password !== body.password_confirm) {
    response.status = Status.BadRequest;
    response.body = {
      error: "The password do not match!"
    }
    return;
  }

  await next();
}
