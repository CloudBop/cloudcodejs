import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { createCellsRouter } from "./routes/cells";
import path from "path";
export const serve = (
  port: number,
  filename: string,
  dir: string,
  useProxy: boolean
) => {
  // console.log("serving traffic on port", port);
  // console.log("saving/fecthing cells from", filename);
  // console.log("that file is in dir", dir);

  const app = express();

  console.log(port);
  console.log(filename);
  console.log(dir);
  console.log(useProxy);

  // create routes
  app.use(createCellsRouter(filename, dir));
  console.log(useProxy);
  // if nothing found.... development mode
  if (useProxy) {
    app.use(
      createProxyMiddleware({
        target: "http://localhost:3000",
        ws: true,
        logLevel: "silent",
        // Err_ssl_protocol_error solution
        changeOrigin: true,
      })
    );
  } else {
    // user production mode
    // get abs path
    const packagePath = require.resolve(
      "@cloudcodejs/local-client/build/index.html"
    );
    console.log(`packagePath`, packagePath);
    app.use(
      express.static(
        // express doesn't like symbolic link
        // "../node_modules/local-client/build"
        path.dirname(packagePath)
      )
    );
  }
  // catch async errors
  return new Promise<void>((resolve, reject) => {
    app.listen(port, resolve).on("error", reject);
  });
};
