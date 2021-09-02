#!/usr/bin/env node
import { program } from "commander";
import { serveCommand } from "./commands/serve";

program.addCommand(serveCommand);
// todo
// .addCommand(loginCommand);

program.parse(process.argv);
