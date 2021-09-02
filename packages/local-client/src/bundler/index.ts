import * as esbuild from "esbuild-wasm";
import { unpkgPathPlugin } from "./plugins/unpkg-path-plugin";
import { fetchPlugin } from "./plugins/fetch-plugin";

// type
let service: esbuild.Service;

export default async function esbuildBundler(rawCodeInput: string) {
  if (!service) {
    service = await esbuild.startService({
      worker: true,
      // our binary lives here
      wasmURL: "https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm",
    });
  }

  // access wasm API
  // const result = await refWasm.current.transform(input, {
  //   loader: "jsx",
  //   target: "es2015",
  // }); // {code, map, error:[]}

  try {
    const result = await service.build({
      entryPoints: ["index.js"],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin(), fetchPlugin(rawCodeInput)],
      define: {
        "process.env.NODE_ENV": '"production"',
        // webpack also does something similar, setting global
        global: "window",
      },
      //  use inbuilt version of react, esdom avoids bundling 2x react
      jsxFactory: "_React.createElement",
      jsxFragment: "_React.Fragment",
    });
    return {
      code: result.outputFiles[0].text,
      err: "",
    };
  } catch (error) {
    return {
      code: "",
      err: error.message,
    };
  }
}
