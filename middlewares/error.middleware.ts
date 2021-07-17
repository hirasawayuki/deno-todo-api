import { Context, isHttpError, Status } from "../deps.ts";

export const internalServerErrorHandler = async(ctx: Context, next: () => Promise<unknown>) => {
  try {
    await next();
  } catch (error) {
    if (!isHttpError(error)) {
      ctx.response.status = Status.InternalServerError;
      ctx.response.body = {
        error: {
          message: error.message,
          stack: error.stack
        }
      }
    }
  }
}

export const notFoundErrorHandler = (ctx: Context) => {
  ctx.response.status = 404;
  ctx.response.body = {
    message: "Not Found"
  }
}
