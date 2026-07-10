---
title: Git 工作流与那些救命命令
date: 2026-06-28
tags: [Git, 工具, 笔记]
excerpt: 从分支模型到 reset / rebase / cherry-pick，整理一组「出事时能救命」的 Git 命令与注意事项。
author: SANIKKI
cover: ''
updated: 2026-07-10
---

# Git 工作流与那些救命命令 🔧

Git 不可怕，可怕的是**不知道刚才发生了什么**。下面按场景整理。

## 🌳 推荐的分支模型

- `main`：永远可部署的稳定分支
- `feature/*`：新功能从 main 切出
- `fix/*`：修复分支

```bash
git switch -c feature/login origin/main
```

## 💊 常用「后悔药」

| 需求 | 命令 |
| --- | --- |
| 撤销最近一次提交（保留改动） | `git reset --soft HEAD~1` |
| 彻底丢弃最近一次提交 | `git reset --hard HEAD~1` |
| 把某次提交搬到当前分支 | `git cherry-pick <commit>` |
| 查看某行是谁改的 | `git blame <file>` |

## ♻️ rebase 让历史更干净

```bash
git fetch origin
git rebase origin/main
```

> ⚠️ **黄金法则**：不要对已经推送到远端的提交做 `rebase`，否则会打乱协作伙伴的历史。

## 📦 暂存现场

```bash
git stash        # 把改动收起来
git stash pop    # 恢复改动
```

把这几条命令存进肌肉记忆，大部分「 git 事故」都能从容应对。
