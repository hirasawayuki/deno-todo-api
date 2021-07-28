import { RouterContext, Status } from "../deps.ts";

export const handleOK = (
  { response }: RouterContext,
  data: Record<string, unknown>,
): void => {
  response.status = Status.OK;
  response.body = data;
};

export const handleBadRequest = (
  { response }: RouterContext,
  message: string,
): void => {
  console.log(message);
  response.status = Status.BadRequest;
  response.body = {
    message: message,
  };
};

export const handleNotFound = (
  { response }: RouterContext,
  message: string,
): void => {
  console.log(message);
  response.status = Status.NotFound;
  response.body = {
    message: message,
  };
};

export const handleUnAuthorized = (
  { response }: RouterContext,
  message: string,
): void => {
  console.log(message);
  response.status = Status.Unauthorized;
  response.body = {
    message: message,
  };
};
