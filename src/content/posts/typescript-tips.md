---
title: TypeScript 实用技巧清单
date: 2026-07-04
tags: [TypeScript, 前端, 笔记]
excerpt: 整理了 8 个高频 TS 技巧：类型收窄、Utility Types、模板字面量类型与 satisfies 运算符。
author: SANIKKI
cover: ''
updated: 2026-07-10
---

# TypeScript 实用技巧清单 🟦

TypeScript 的强大在于**类型即文档**。下面是我日常最常用的一些技巧。

## 1. 🔍 类型收窄（Narrowing）

```ts
function format(value: string | number) {
  if (typeof value === 'number') {
    return value.toFixed(2); // 这里 value 已被收窄为 number
  }
  return value.trim(); // 这里 value 是 string
}
```

## 2. 🧰 常用 Utility Types

| 类型 | 作用 |
| --- | --- |
| `Partial<T>` | 所有属性变为可选 |
| `Pick<T, K>` | 只挑选部分属性 |
| `Omit<T, K>` | 排除部分属性 |
| `Record<K, V>` | 构造键值映射 |

```ts
interface User {
  id: number;
  name: string;
  email: string;
}

type UserPreview = Pick<User, 'id' | 'name'>;
// { id: number; name: string }
```

## 3. ✅ satisfies 运算符（TS 4.9+）

既想保留字面量类型，又想获得类型检查：

```ts
const routes = {
  home: '/',
  about: '/about',
} satisfies Record<string, string>;

// routes.home 的类型仍是 '/'，而不是宽泛的 string
```

## 4. 🅰️ 模板字面量类型

```ts
type EventName<T extends string> = `on${Capitalize<T>}`;
type Click = EventName<'click'>; // 'onClick'
```

> 💡 当你发现自己在重复书写类型时，多半有更优雅的泛型写法。

把类型写对，bug 就少一半。加油！💪
