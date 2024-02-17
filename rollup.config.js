import resolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import commonjs from "@rollup/plugin-commonjs";

export default {
  input: "src/client/bojan.js",
  output: {
    banner: "/* bojan social! built by RGB and others. */",
    file: "assets/dist/bojan.min.js",
    format: "iife",
    name: "bojan",
    plugins: [terser()],
  },
  plugins: [resolve(), commonjs()],
};
