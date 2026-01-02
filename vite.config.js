import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import path from "path"

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      // alias mặc định cho vue (GIỮ NGUYÊN)
      vue: "vue/dist/vue.esm-bundler.js",

      // ✅ THÊM alias @ trỏ tới src
      "@": path.resolve(__dirname, "src")
    }
  }
})
