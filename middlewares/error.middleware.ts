import { Context, isHttpError, Status } from "../deps.ts";

export const internalServerErrorHandler = async (
  ctx: Context,
  next: () => Promise<unknown>,
) => {
  try {
    await next();
  } catch (error) {
    if (!isHttpError(error)) {
      console.log(error);
      ctx.response.status = Status.InternalServerError;
      ctx.response.body = {
        message: "Internal Server Error"
      };
    }
  }
};

export const notFoundErrorHandler = (ctx: Context) => {
  console.log("not found error");
  ctx.response.status = Status.NotFound;
  ctx.response.body = {
    message: "Not Found",
  };
};
