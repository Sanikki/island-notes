import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages 项目页部署在子路径 /island-notes/ 下。
// 生产构建用子路径 base，本地 dev 保持根路径，避免影响开发时 URL。
const isProd = process.env.NODE_ENV === 'production';

export default defineConfig({
  base: isProd ? '/island-notes/' : '/',
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
  },
});
