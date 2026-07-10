---
title: Flexbox 布局速查手册
date: 2026-07-02
tags: [CSS, 前端, 笔记]
excerpt: 一张表记住 justify-content / align-items 的全部取值，外加「水平垂直居中」与「两端对齐」两个经典场景。
author: SANIKKI
cover: ''
updated: 2026-07-10
---

# Flexbox 布局速查手册 📐

Flexbox 是现代布局的基石。记住容器的两个主轴属性就赢了一半。

## 🧭 主轴与交叉轴

```css
.container {
  display: flex;
  flex-direction: row;        /* 主轴：水平 */
  justify-content: center;    /* 主轴对齐 */
  align-items: center;        /* 交叉轴对齐 */
}
```

## 📊 属性取值对照

| 属性 | 常用取值 | 含义 |
| --- | --- | --- |
| `justify-content` | `flex-start` / `center` / `space-between` / `space-around` | 主轴分布 |
| `align-items` | `stretch` / `center` / `flex-start` / `flex-end` | 交叉轴对齐 |
| `flex-wrap` | `nowrap` / `wrap` | 是否换行 |

## 🎯 经典场景一：水平垂直居中

```css
.center {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
```

## 🧭 经典场景二：两端对齐的导航栏

```css
.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
```

> 💡 小技巧：想让某个子项靠右？给它 `margin-left: auto;` 即可，不用改容器。

Flex 用熟了，布局就不再是玄学。
