import React from 'react';
import ReactDOM from 'react-dom/client';
import { Cursor } from 'animal-island-ui';
import 'animal-island-ui/style';
import 'highlight.js/styles/github.css';
import './index.css';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* 全站自定义光标：forceAll 默认 true，覆盖所有后代（含 a/button 等交互元素）。
        minHeight:100vh 保证容器撑满视口，空白处也应用光标（style 仅作 layout 用）。 */}
    <Cursor style={{ minHeight: '100vh' }}>
      <App />
    </Cursor>
  </React.StrictMode>,
);
