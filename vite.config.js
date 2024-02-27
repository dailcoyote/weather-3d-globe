import vitePluginString from "vite-plugin-string";
import { defineConfig } from 'vite'

export default defineConfig({
    root: 'src',
    publicDir: 'assets',
    build: {
      emptyOutDir: true,
      minify: true,
      outDir: '../dist'
    },
    plugins: [
        vitePluginString()
    ]
});
