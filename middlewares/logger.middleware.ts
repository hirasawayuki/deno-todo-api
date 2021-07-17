import { Context, green, cyan } from "../deps.ts";

export const logger = async (ctx: Context, next: () => Promise<unknown>) => {
  await next();
  console.log(`${green(ctx.request.method)} ${cyan(ctx.request.url.pathname)}`);
};
