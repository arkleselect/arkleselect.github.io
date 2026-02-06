---
title: 功能测试文档
date: 2024-02-02
description: 用于测试 Markdown 渲染、目录、代码高亮与表格
---

## 基础段落

这是一段普通文字，用于测试基础渲染与排版。

## 列表与引用

- 无序列表 1
- 无序列表 2
- 无序列表 3
1. 有序列表 1
2. 有序列表 2
3. 有序列表 3

> 这是一段引用文字，用于测试 blockquote。

## 链接与强调

这里有一个链接：[OpenAI](https://www.openai.com)

**加粗文字**、*斜体文字*、~~删除线~~。

## 表格（GFM）

| 功能          | 状态  | 备注               |
| ----------- | --- | ---------------- |
| Markdown 渲染 | ✅   | 基础渲染             |
| 目录生成        | ✅   | H2/H3            |
| 代码高亮        | ✅   | rehype-highlight |

## 代码块（JS）

```js
function hello(name) {
  console.log(`Hello, ${name}!`);
}

hello('world');
```

## 代码块（TS）

```ts
type User = {
  id: string;
  name: string;
};

const user: User = {
  id: 'u_01',
  name: 'Alex'
};

console.log(user);
```

## 内联代码

这是一段 `inline code` 示例。

## 图片

![](https://raw.githubusercontent.com/arkleselect/blog/main/img/Normalized.jpg)

## 三段落

第一段。

第二段。

第三段。

## 二级标题下的三级标题

### 小节 A

内容 A。

### 小节 B

内容 B。
