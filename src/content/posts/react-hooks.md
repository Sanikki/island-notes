---
title: React Hooks 笔记：从 useState 到自定义 Hook
date: 2026-07-06
tags: [React, 前端, 笔记]
excerpt: 梳理 useEffect 的依赖陷阱、useMemo 的合理使用边界，并手搓一个 useLocalStorage 自定义 Hook。
author: SANIKKI
cover: ''
updated: 2026-07-10
---

# React Hooks 学习笔记 ⚛️

Hooks 让函数组件也能拥有状态与生命周期。下面是我在实战中反复用到的一些要点。

## 1. 🪝 useEffect 的依赖陷阱

`useEffect` 的第二个参数是**依赖数组**，漏写或错写都会导致 bug：

```tsx
// 错误：依赖为空，但内部用到了 count
useEffect(() => {
  document.title = `点击了 ${count} 次`;
}, []);

// 正确：把 count 加入依赖
useEffect(() => {
  document.title = `点击了 ${count} 次`;
}, [count]);
```

> 经验法则：**effect 里用到的每一个外部变量，都要放进依赖数组。**

## 2. 🧠 useMemo 不是万能药

`useMemo` 用于缓存昂贵的计算，但不要为了「优化」而滥用：

| 场景 | 是否使用 useMemo |
| --- | --- |
| 列表过滤 / 排序 | 推荐 |
| 简单字符串拼接 | 没必要 |
| 传给子组件的引用 | 避免无谓重渲染 |

## 3. 🛠️ 自定义 Hook：useLocalStorage

把「状态 + 持久化」封装成一个可复用的 Hook：

```tsx
import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    const saved = localStorage.getItem(key);
    return saved ? (JSON.parse(saved) as T) : initial;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}
```

使用方式非常自然：

```tsx
const [theme, setTheme] = useLocalStorage('theme', 'light');
```

## 📌 小结

- `useEffect`：注意依赖，避免闭包陷阱
- `useMemo`：只为真正昂贵的运算缓存
- 自定义 Hook：把逻辑抽出来，组件更清爽

Happy coding! 🎉
