---
title: 《Schema——数据格式的八股文》
date: 2026-07-13
tags: [Agent, AI, Schema]
excerpt: 对Schema的个人理解，Schema就像大侠出招前必须填写的“投名状”，规定了参数名、类型、是否必填、取值范围。
@author: SANIKKI
cover: ''
updated: 2026-07-13
---

> **一句话心法：提示词管“怎么说”，Schema 管“怎么接”。没有 Schema 的 Agent 是野球拳，乱拳打死老师傅；有了 Schema 的 Agent 是太极拳，一招一式皆有法度。**

## Schema 是什么？

**Schema（模式/蓝图）** 本质上是一份 **“结构化数据的格式说明书”**。

在 Agent 开发中，它就像大侠出招前必须填写的 **“投名状”**，**规定了参数名、类型、是否必填、取值范围。**Agent 只有按 Schema 出招，Client（传令兵）才能把指令顺利传到 Server（分舵）。

也就是说，我们希望LLM**必须按照Scheme规定的要求**，进行输入输出，以确保程序的稳定性。

## 三大核心 Schema

### Tool Input Schema（输入约束 / JSON Schema）

定义 Agent 调用工具时必须传什么参数。

```json
{
  "type": "object",
  "properties": {
    "city": {"type": "string", "description": "城市名称"},
    "date": {"type": "string", "format": "date"}
  },
  "required": ["city"],           // ← 必填，少一个都不行
  "additionalProperties": false   // ← 禁加多余字段
}
```

**江湖教训**：如果把 `city` 写成可选，Agent 可能只回一句“查天气”却不传城市，导致 Tool 执行报错。

### Output Schema（输出约束 / Structured Output）

强制 Agent **只按指定的 JSON 结构返回**，专治“模型乱加字段、忘写 key、套三层反引号”等顽疾。

```json
# 强制要求输出格式
{
  "reasoning": "推理过程",
  "final_answer": "最终结论（必须是数字）"
}
```

**江湖教训**：**永远用 Strict Mode 锁死格式！** 否则大模型高兴了会在 JSON 外面套三个反引号 ```，或者把 `final_answer` 的布尔值写成字符串 `"True"`，解析直接崩溃。

### State Schema（状态约束）

多轮对话或 Workflow 中的“账本”结构，定义 `messages`（对话历史）、`step`（当前第几步）、`collected_info`（已收集信息）的存储格式。

**江湖教训**：不要把上一轮的几十页 RAG 检索结果全塞进 State 带去下一轮，否则上下文窗口会爆炸。

## 软硬皆施

Schema是一种”软“约束

1. 它只能“劝”不能“绑”：LLM看到 Schema 就像看到“建议书”。**它会尽量遵守，但脑子一抽就可能乱写**。比如把 `city` 写成 `{"city": 123}`（类型错误），或者干脆漏掉必填字段。**格式不是由 LLM “保证”的，而是由代码“拦截”的。** 如果代码没写校验，那 Schema 就是废纸一张。
2. 只能管“骨架”，管不了“血肉”：即使LLM保证了格式、约束等正确，但它**没办法保证内容的正确性**，比如你问“1+1=？” ，它规规矩矩地输出 `{"final_answer": 3}`，**格式完美，但答案扯淡**。Schema 管的是“长得像不像”，不管“算得对不对”。

因此，我们必须使用一些方法，确保出现问题时服务依旧能进行下去。

我们用的是 **“软硬兼施”的三板斧**：

1. **硬校验（LLM 靠不住，代码来兜底）**：拿到 LLM 的输出，别直接用，先 `try...catch` 做 JSON 解析 + Schema 校验。
2. **软兜底（失败后）**：**绝不把异常抛给用户！** 而是走 **Fallback（兜底）** 逻辑。比如如果解析失败，根据失败的情况，将错误的tool_call.id和错误类型**重新报告给LLM**，或者**直接返回预设话术**：“抱歉，系统出了点小差，请换个问法。”
3. **限死重试次数（防死循环）**：如果真的需要让大模型重试修正 JSON，**最多重试N次**。如果还错，直接放弃治疗，走 Fallback。

## Schema 定义的四大铁律

| 铁律                                  | 说明                                                         |
| ------------------------------------- | ------------------------------------------------------------ |
| **必填宁可多写**                      | 只要字段在业务上非空，一律 `required`。宁可让 Agent 少调用一次，也别让 Tool 收到空值。 |
| `**additionalProperties: false**`     | 只准有定义字段，多一个都不行。从源头杜绝模型“自作聪明”加奇怪字段。 |
| **代码写** `**try...catch**` **兜底** | 永远别信任大模型吐出的 JSON。解析失败就走Fallback（如“系统繁忙，请重试”），绝不重试模型（太贵）。 |
| **上线后只加不减**                    | Input/Output Schema 一旦上线，只许加新字段，不许删旧字段，不许改类型。否则正在执行中的旧任务会瞬间全崩。 |

## 避坑口诀（即用即查）

1. Input Schema 要填死，可选字段是大忌；
2. Output Schema 锁格式，Strict Mode 常开启；
3. additionalProperties false 记心间，模型乱加就给拒；
4. try catch 包严实，上线之后不乱劈。
    
