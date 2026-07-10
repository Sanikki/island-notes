import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { PostDetail } from './pages/PostDetail';
import { TagsPage } from './pages/Tags';
import { About } from './pages/About';
import { Splash } from './pages/Splash';

export default function App() {
  // GitHub Pages 项目页部署在子路径 /my_blog/ 下：
  // import.meta.env.BASE_URL 生产为 /my_blog/、dev 为 /，去掉尾斜杠作为 router basename。
  const basename = import.meta.env.BASE_URL.replace(/\/$/, '');
  return (
    <BrowserRouter basename={basename}>
      <Routes>
        {/* 落地页作为站点主页 / */}
        <Route path="/" element={<Splash />} />

        {/* 博客整体挂在 /blog 前缀下 */}
        <Route
          path="/blog"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
        <Route
          path="/blog/post/:slug"
          element={
            <Layout>
              <PostDetail />
            </Layout>
          }
        />
        <Route
          path="/blog/tags"
          element={
            <Layout>
              <TagsPage />
            </Layout>
          }
        />
        <Route
          path="/blog/tags/:tag"
          element={
            <Layout>
              <TagsPage />
            </Layout>
          }
        />
        <Route
          path="/blog/about"
          element={
            <Layout>
              <About />
            </Layout>
          }
        />

        {/* 未知路径回博客首页 */}
        <Route path="*" element={<Navigate to="/blog" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
