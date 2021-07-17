import { Application, bold, yellow } from "./deps.ts";
import { router } from "./routers/router.ts";
import {
  internalServerErrorHandler,
  logger,
  notFoundErrorHandler,
} from "./middlewares/mod.ts";

const listenAndServe = () => {
  const app = new Application();
  app.use(logger);
  app.use(internalServerErrorHandler);
  app.use(router.routes());
  app.use(router.allowedMethods());
  app.use(notFoundErrorHandler);

  app.addEventListener("listen", ({ hostname, port }) => {
    console.log(
      bold(`Start listening on ${hostname || "localhost"}`) +
        yellow(`:${port}`),
    );
  });

  const port = parseInt(Deno.env.get("PORT") || "8000");
  app.listen({ port: port });
};

listenAndServe();
