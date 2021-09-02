import path from "path";
import { Command } from "commander";
import { serve } from "@cloudcodejs/local-api";

/**
 * crucial, (endUserConsumer === production) || (undefined === "development")
 */
const isProduction = process.env.NODE === "production";

export const serveCommand = new Command()
  // [square-brckets-optional]
  .command("serve [filename]")
  .description("Open a file for editing")
  //
  .option(
    //input cli options|flags
    "-p, --port <number>",
    // <angle brckets> REQUIERED
    "port to run server on",
    //default
    "4005"
  )
  .action((filename = "notebook.js", options: { port: string }) => {
    try {
      // allows user to specific paths to filename as well as filename
      //eg notes/my-js-notes.js
      const dir = path.join(process.cwd(), path.dirname(filename));
      // console.log(filename, options);
      serve(
        parseInt(options.port),
        path.basename(filename),
        dir,
        !isProduction
      );
      console.log(
        `Opened ${filename}.\n Navigate to http://localhost:${options.port} to edit the file `
      );
    } catch (error: any) {
      if (error.code === "EADDRINUSE")
        console.log(
          `Port:${options.port} is in use, try another port. \n -p || --port ${
            options.port + 1
          } `
        );
      //
      else console.log(`here is the error`, error.message);

      // force exit
      process.exit(1);
    }
  });
