---
title: "代码块增强功能测试"
date: "2026-02-06"
description: "这是一篇用于验证代码块折叠、展开以及横向滑动功能的测试文章。"
---

## 功能测试文章

这是一篇专门用来测试我们刚刚实现的 **代码块折叠** 和 **横向滚动** 功能的文章。

## 1. 长代码折叠测试

下面的代码块行数非常多，应该会被自动折叠，并显示“展开全部”按钮。

```typescript
// 这是一个超长的测试代码块
function heavilyNestedFunction() {
    console.log("Starting deep dive...");
    if (true) {
        if (true) {
            if (true) {
                console.log("Deep level 1");
                for (let i = 0; i < 10; i++) {
                    console.log("Iteration " + i);
                    // 模拟大量代码行
                    // Line 1
                    // Line 2
                    // Line 3
                    // Line 4
                    // Line 5
                    // Line 6
                    // Line 7
                    // Line 8
                    // Line 9
                    // Line 10
                    // Line 11
                    // Line 12
                    // Line 13
                    // Line 14
                    // Line 15
                    // Line 16
                    // Line 17
                    // Line 18
                    // Line 19
                    // Line 20
                }
            }
        }
    }
    return "Finished!";
}

// 更多重复内容以确保超过 320px
console.log("Padding content...");
console.log("Padding content...");
console.log("Padding content...");
console.log("Padding content...");
console.log("Padding content...");
console.log("Padding content...");
console.log("Padding content...");
console.log("Padding content...");
console.log("Padding content...");
console.log("Padding content...");
```

## 2. 横向滑动测试

下面的代码包含一行极长的内容，应该可以在容器内横向滑动，而不会撑开页面布局。

```javascript
const veryLongString = "这是一行非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常长的字符串，用于测试 CSS 的 overflow-x: auto 属性是否生效。";

function testHorizontalScroll() {
    return {
        message: "如果你能看到这行末尾，说明滑动功能正常 ->",
        metadata: {
            timestamp: Date.now(),
            shards: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
        }
    };
}
```

## 3. 短代码块测试

短代码块不应被折叠，且不应出现“展开”按钮。

```python
print("Hello, World!")
def simple_sum(a, b):
    return a + b
```

---
测试结束。
