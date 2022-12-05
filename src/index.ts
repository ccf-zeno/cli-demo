import { Command } from "commander";

import { version } from "../package.json";
import createProject from "./createProject.js";


const program = new Command();
program
  .command("create")
  .description("创建一个新项目")
  .action(() => {
    createProject();
  });

program.version(version, '-v --version');

program.parse();
