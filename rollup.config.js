import styles from "rollup-plugin-styles";
import { terser } from "rollup-plugin-terser";

export default {
  input: ['src/index.js'],
  plugins: [styles(), terser()],
  output: {
    sourcemap: true,
    name: "EditorJSQuote",
    dir: 'dist',
    assetFileNames: "[name]-[hash][extname]",
  },
};