import * as esbuild from "esbuild-wasm";
//
// (async () => {
//   await fileCache.setItem("color", "red");
//   const color = await fileCache.getItem("color");
//   console.log(`color`, color);
// })();

/**
 * Overrule esbuild when it tries to resolve/load npm libs
 * @returns {
 *   warnings: [],
 *   outputfiles:[{
 *     contents: Uint8Array(n) […]
 *     path: "<stdout>"
 *     text: "escaped? /nJS"
 *     get_text();
 *   }]
 * }
 */
export const unpkgPathPlugin = () => {
  return {
    name: "unpkg-path-plugin",
    setup(build: esbuild.PluginBuild) {
      // handle root/entry file of 'index.js'
      build.onResolve(
        {
          filter: /(^index\.js$)/,
        },
        // return { path: args.path, namespace: "a" };
        () => ({ path: "index.js", namespace: "a" })
      );

      // handles relative paths within module
      build.onResolve(
        {
          // ../ || ./
          filter: /^\.+\//,
        },
        // return { path: args.path, namespace: "a" };
        (args: any) => {
          return {
            namespace: "a",
            path: new URL(
              // ./utils || ../utils
              args.path,
              // relative path for current import
              // eg: https://unpkg.com/library-currently-build/src
              "https://unpkg.com" + args.resolveDir + "/"
            ).href, // trailling slash is super important!
            /**
             * without trail it will create url from root rootdomain/utils
             * as opposed to rootdomain/name-of-library/utils
             * ...try below
             * tiny-test-pkg | medium-test-pkg | nested-test-pkg
             */
          };
        }
      );

      // handle main module file
      build.onResolve(
        {
          // regex against current filename (all)
          filter: /.*/,
        },
        //
        async (args: any) => {
          return {
            namespace: "a",
            path: `https://unpkg.com/${args.path}`,
          };
        }
      );
    },
  };
};
