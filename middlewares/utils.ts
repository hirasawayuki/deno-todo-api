import { RouterContext } from "../deps.ts";

type ErrorArg = Error | string;

export function createErrorBody(
  error: ErrorArg,
): { error: { message: string; stack?: string } } {
  const e = formatError(error);
  return {
    error: {
      message: e.message,
      stack: e.stack,
    },
  };
}

function formatError(error: ErrorArg): Error {
  if (error instanceof Error) {
    return error;
  }
  return new Error(error);
}

export async function getParams(ctx: RouterContext) {
  const result = ctx.request.body();
  const value = await result.value;
  return {
    ...ctx.params,
    ...value,
  };
}
