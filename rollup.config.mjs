import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
import json from "@rollup/plugin-json";
// import { terser } from "rollup-plugin-terser";
import del from "rollup-plugin-delete";
const banner = `/*!
 * ts-websocket
 * by LorestaniMe <dyniqo@gmail.com>
 * https://github.com/Dyniqo/ts-websocket
 * License MIT
 */
`;

export default [
  {
    input: "src/index.ts",
    output: [
      {
        file: "dist/ts-websocket.cjs.js",
        format: "cjs",
        sourcemap: true,
        banner
      },
      {
        file: "dist/ts-websocket.esm.js",
        format: "esm",
        sourcemap: true,
        banner
      },
      //  {
      //    file: "dist/ts-websocket.amd.js",
      //    format: "amd",
      //    sourcemap: true,
      //    banner
      //  },
      //  {
      //    file: "dist/ts-websocket-iife.js",
      //    format: "iife",
      //    name: "TSWebSocket",
      //    sourcemap: true,
      //    banner
      //  },
      //  {
      //    file: "dist/ts-websocket.iife.min.js",
      //    format: "iife",
      //    name: "TSWebSocket",
      //    sourcemap: true,
      //    plugins: [terser()],
      //    banner
      //  },
    ],
    external: [
      "inversify",
      "jsonwebtoken",
      "reflect-metadata",
      "express",
      "http",
      "net",
      "ws",
    ],
    plugins: [
      resolve(),
      commonjs(),
      json(),
      typescript({ tsconfig: "./tsconfig.json" }),
    ],
  },

  {
    input: "./dist/index.d.ts",
    output: [{ file: "dist/ts-websocket.d.ts", format: "es" }],
    plugins: [
      dts(``),
      del({
        targets: [
          "dist/**/*",
          "!dist/*.js",
          "!dist/*.map",
          "!dist/types/**/*",
          "!dist/ts-websocket.d.ts",
        ],
        hook: "buildEnd",
      }),
    ],
  },
];
