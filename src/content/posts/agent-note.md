---
title: 初探 AI Agent：从工具调用到自主规划
date: 2026-07-09
tags: [Agent, AI, 前端]
excerpt: 记录我对 AI Agent 的理解——它不只是聊天，而是能「感知-规划-调用工具-反思」的自主小岛居民。
author: SANIKKI
cover: ''
updated: 2026-07-10
---

# 初探 AI Agent 🤖

如果说是博客是一座小岛，那 **Agent** 就是岛上最勤快的那只小动物——你给它一个目标，它会自己想办法达成。

> Agent = 大模型 + 记忆 + 工具调用 + 规划循环。

## ⚙️ 一个最小闭环

```ts
async function runAgent(goal: string) {
  const memory: string[] = [];
  for (let step = 0; step < 5; step++) {
    const plan = await llm(`目标: ${goal}\n记忆: ${memory.join('\n')}\n下一步?`);
    const result = await useTool(plan);
    memory.push(`${plan} => ${result}`);
    if (isDone(result)) break;
  }
  return memory;
}
```

## ✨ 关键能力

| 能力 | 说明 |
| --- | --- |
| 规划 | 把大目标拆成可执行步骤 |
| 工具调用 | 查资料、跑代码、调 API |
| 记忆 | 短期上下文 + 长期沉淀 |
| 反思 | 失败就换一条路 |

## 🔗 和小岛笔记的关系

我打算把这个博客接上一个 Agent：让它自动把零散笔记归类、生成标签，甚至回答「之前那篇讲 Flexbox 的文章在哪」。标签 `Agent` 下的笔记，都会记录这类实践。
