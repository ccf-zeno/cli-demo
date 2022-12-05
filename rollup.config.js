import clear from "rollup-plugin-clear";
import progress from "rollup-plugin-progress";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "rollup-plugin-typescript2";
import json from "@rollup/plugin-json";

const extensions = [".js", ".ts"];

export default {
  input: "./src/index.ts",
  output: {
    file: "dist/index.js",
    format: "esm",
  },
  external: ["commander", "inquirer", "download-git-repo",'ora','fs-extra'],
  plugins: [
    progress(),
    clear({
      targets: ["dist"],
    }),
    nodeResolve({
      extensions,
      preferBuiltins: true
    }),
    commonjs(),
    typescript(),
    json(),
  ],
};
