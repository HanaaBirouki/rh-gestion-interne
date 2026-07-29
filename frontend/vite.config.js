import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"

export default defineConfig({

  plugins:[react()],

  esbuild:{
    loader:"jsx",
    include:/\.(js|jsx|ts|tsx)$/,
  },

  resolve:{
    alias:{
      "@":path.resolve(__dirname,"./src"),
    },
  },

})