# Node.js path

path 是 Node.js 中的一个全局对象，它提供与路径相关的操作方法。

## path.join()

用于拼接路径，返回一个拼接后的相对路径。

```typescript
import path from "path";
const fullPath = path.join("users", "admin", "files");
console.log(fullPath);
// 在 Mac/Linux 上输出:  users/admin/files
// 在 Windows 上输出:    users\admin\files  <-- 注意斜杠方向自动变了
```

为什么不直接使用字符串拼接？
因为不同的操作系统，路径的分割符是不同的。
Mac/Linux 使用 `/`，Windows 使用 `\`。
如果直接使用字符串拼接，会导致在不同的操作系统上无法正常运行。
所以需要使用 path.join() 来拼接路径。

## path.resolve()

用于解析绝对路径，返回一个解析后的绝对路径。

假设当前目录是 `/Users/dev`

```typescript
import path from "path";

// 1. 普通拼接
console.log(path.join("a", "b"));
// 输出: a/b  (依然是相对路径)

console.log(path.resolve("a", "b"));
// 输出: /Users/dev/a/b (变成了绝对路径！)

// 2. 遇到根目录符号 '/'
console.log(path.join("/a", "b"));
// 输出: /a/b (只是拼接)

console.log(path.resolve("/a", "b"));
// 输出: /a/b (因为它认为 /a 是根目录，所以忽略了 /Users/dev)
```

`vite.config.ts` 中使用：

```typescript
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path"; // 引入 path 模块

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      // 这里的核心逻辑：
      // 1. __dirname 拿到当前配置文件所在的绝对路径
      // 2. 'src' 是相对路径
      // 3. resolve 把它们拼成一个完整的绝对路径，比如 /Users/me/project/src
      "@": path.resolve(__dirname, "src"),
    },
  },
});
```

## path.dirname()

用于获取父级目录。

```typescript
import path from "path";

// 场景 1：给它一个文件的完整路径
const p1 = "/Users/me/project/index.js";
console.log(path.dirname(p1));
// 输出: /Users/me/project
// (也就是把 index.js 去掉了)

// 场景 2：给它一个文件夹的路径
const p2 = "/Users/me/project";
console.log(path.dirname(p2));
// 输出: /Users/me
// (它把 project 当作最后一部分砍掉了，实际上相当于“返回上一级”)
```

与`__dirname`的关系：

`__dirname` 返回当前文件的父级目录。

```typescript
import path from "path";
const dirname = path.dirname(__filename);
console.log(dirname === __dirname);
// 输出: true
```

## path.basename()

用于获取文件名。

```typescript
import path from "path";
// 场景：你有一个文件的完整路径
const filePath = "/Users/me/project/src/utils/format.ts";

const name = path.basename(filePath);

console.log(name);
// 输出: format.ts

// 第二个参数告诉它：把 .ts 切掉
const nameWithoutExt = path.basename(filePath, ".ts");

console.log(nameWithoutExt);
// 输出: format
```

## path.extname()

用于获取文件扩展名。

```typescript
import path from "path";
const filePath = "/Users/me/project/src/utils/format.ts";
const ext = path.extname(filePath);
console.log(ext);
// 输出: .ts
```
