/** @type {import('vite').UserConfig} */
export default {
  // config options
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    minify: "false",
    //allowJs: true,
    //target: "esnext",
    sourcemap: true,
    include: [
      "config/**/*",
      "css/**/*",
      "js/**/",
      "index.html",
      "resources/**/*",
    ],
  },
};
