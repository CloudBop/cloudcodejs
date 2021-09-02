import * as esbuild from "esbuild-wasm";
import axios from "axios";
import localForage from "localforage";

const fileCache = localForage.createInstance({
  name: "filecache",
});

export const fetchPlugin = (inputCode: string) => {
  return {
    name: "fetch-plugin",
    setup(build: esbuild.PluginBuild) {
      // handle index file
      build.onLoad({ filter: /(^index\.js$)/ }, () => {
        return {
          loader: "jsx",
          contents: inputCode,
        };
      });

      build.onLoad({ filter: /.*/ }, async (args: any) => {
        // check cache for this file
        const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(
          args.path
        );
        // will stop further on builds for current path
        if (cachedResult) return cachedResult;
        // return null;
      });

      // handle css files
      build.onLoad({ filter: /.css*/ }, async (args: any) => {
        //
        const { data, request } = await axios.get(args.path);
        // match.regex file suffix is .css
        // const fileType = args.path.match(/.css$/) ? "css" : "jsx";

        //sanitise css - breaks on fontfiles, @import, url(). good enough for app purposes
        const escaped = data
          // remove newlines
          .replace(/\n/g, "")
          // escape dble quotes
          .replace(/"/g, '\\"')
          // escape single quotes
          .replace(/'/g, "\\'");

        const contents =
          // if css then append the string via JSDOM
          // hacky way to get around that esbuild doesn't account for wasm in browser for css loaders
          // but it works!
          `
            const style = document.createElement('style');
            style.innerText = '${escaped}';
            document.head.appendChild(style);
          `;

        const result: esbuild.OnLoadResult = {
          loader: "jsx",
          contents: contents,
          resolveDir: new URL(
            // chops off the /.index.js
            "./",
            //pathname to last file eg. some-library-url/src/
            request.responseURL
          ).pathname,
        };

        await fileCache.setItem(args.path, result);
        return result;
      });

      // handle js files
      build.onLoad({ filter: /.*/ }, async (args: any) => {
        const { data, request } = await axios.get(args.path);

        const result: esbuild.OnLoadResult = {
          loader: "jsx",
          contents: data,
          resolveDir: new URL(
            // chops off the /.index.js
            "./",
            //pathname to last file eg. some-library-url/src/
            request.responseURL
          ).pathname,
        };

        await fileCache.setItem(args.path, result);
        return result;
      });
    },
  };
};
