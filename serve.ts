import Server from "lume/core/server.ts";
import notFound from "lume/middlewares/not_found.ts";

const root = `${Deno.cwd()}/_site`;

const server = new Server({
  port: 8000,
  root,
});

server.use((request, next) => {
  const hostname = request.headers.get("host")?.split(":")[0].toLowerCase();

  if (hostname === "www.rix1.dev") {
    const url = new URL(request.url);
    url.protocol = "https:";
    url.hostname = "rix1.dev";

    return Promise.resolve(Response.redirect(url, 308));
  }

  return next(request);
});

server.use(notFound({ root, page404: "/404.html" }));

server.start();

console.log("Listening on http://localhost:8000");
