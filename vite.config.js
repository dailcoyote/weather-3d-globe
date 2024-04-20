import vitePluginString from "vite-plugin-string";
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  root: 'src',
  publicDir: 'assets',
  build: {
    emptyOutDir: true,
    minify: true,
    outDir: '../dist'
  },
  plugins: [
    vue(),
    vitePluginString()
  ]
});
