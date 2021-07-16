import { Application, bold, yellow } from "./deps.ts";
import { router } from "./routers/router.ts";
import { logger, errorHandler, notFoundHandler } from "./middlewares/mod.ts";

const app = new Application();
app.use(logger);
app.use(errorHandler);
app.use(router.routes());
app.use(router.allowedMethods());
app.use(notFoundHandler);

app.addEventListener("listen", ({ hostname, port }) => {
  console.log(bold(`Start listening on ${hostname || "localhost"}`)+yellow(`:${port}`));
})

const port = parseInt(Deno.env.get("PORT") || "8000");

app.listen({port: port});
