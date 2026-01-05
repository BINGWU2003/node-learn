# Node.js fs

fs 是 Node.js 中的一个全局对象，它提供与文件系统相关的操作方法。

## fs.readFile()

用于异步读取文件，返回一个读取后的文件内容。

文档：https://nodejs.org/api/fs.html#fsreadfilepath-options-callback

```typescript
import path from "path";
import fs from "fs";
// 1. 准备路径
const filePath = path.join(__dirname, "data", "hello.txt");
console.log(filePath);
// 2. 读取文件
fs.readFile(filePath, "utf8", (err, data) => {
  // 错误优先原则：先判断有没有错
  if (err) {
    console.error("读取失败:", err);
    return;
  }

  // 成功！
  console.log("文件内容:", data);
});

console.log("我是最后一行代码，但我会先打印！");

// 输出
// E:\cdoe2\node-learn\src\data\hello.txt
// hello world
// 我是最后一行代码，但我会先打印！
```

## fs.readFileSync()

用于同步读取文件，返回一个读取后的文件内容。

```typescript
// 1. 准备路径
const filePath = path.join(__dirname, "data", "hello.txt");
console.log(filePath);
// 2. 读取文件
try {
  const data = fs.readFileSync(filePath, "utf8");
  console.log(data);
} catch (error) {
  console.error("读取失败:", error);
}

// 输出
// E:\cdoe2\node-learn\src\data\hello.txt
// hello world
```

## fs.writeFile()

用于异步写入文件。

```typescript
import fs from "fs";
import path from "path";

const filePath = path.join(__dirname, "message.txt");
const content = "Hello, this is Node.js11!";

// 参数：路径, 内容, 编码(可选,默认utf8), 回调函数
fs.writeFile(filePath, content, "utf8", (err) => {
  if (err) {
    console.error("写入失败:", err);
    return;
  }
  console.log("写入成功！");
});

console.log("我会先打印，因为写入是异步的");
```

如果文件不存在，则创建文件。如果文件存在，则覆盖文件。

如果路径中的文件夹不存在，会直接报错。

## fs.writeFileSync()

用于同步写入文件。

```typescript
import fs from "fs";
import path from "path";

const filePath = path.join(__dirname, "message.txt");
const content = "Hello, this is Node.js!";

try {
  fs.writeFileSync(filePath, content);
  console.log("写入成功！");
} catch (error) {
  console.error("写入失败:", error);
}

// 输出
// 写入成功！
```

## fs.readdir()

用于读取目录，返回一个读取后的目录内容。

```typescript
import fs from "fs";
import path from "path";

const dirPath = path.join(__dirname);

fs.readdir(dirPath, (err, data) => {
  if (err) {
    console.error("读取失败:", err);
    return;
  }
  console.log(data);
  // 输出示例: [ 'data', 'index.ts', 'message.txt', 'utils' ]
  // 注意：这里既有文件，也有文件夹，混在一起
});
```

## fs.readdirSync()

用于同步读取目录，返回一个读取后的目录内容。

```typescript
import fs from "fs";
import path from "path";

const dirPath = path.join(__dirname);

try {
  const files = fs.readdirSync(dirPath);
  console.log("目录下的文件:", files);
} catch (err) {
  console.error("目录不存在或没权限", err);
}
```

## 递归读取目录中的所有文件

```typescript
import fs from "fs";
import path from "path";

// 递归读取目录
function readDirRecursive(dir: string): string[] {
  const files: string[] = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });

  for (const item of items) {
    const fullPath = path.join(dir, item.name);

    if (item.isDirectory()) {
      files.push(...readDirRecursive(fullPath));
    } else {
      files.push(fullPath);
    }
  }

  return files;
}

const dirPath = path.join(__dirname);
const files = readDirRecursive(dirPath);
console.log(files);

// 输出
// [ 'E:\\cdoe2\\node-learn\\src\\data\\hello.txt',
//   'E:\\cdoe2\\node-learn\\src\\index.ts',
//   'E:\\cdoe2\\node-learn\\src\\message.txt',
//   'E:\\cdoe2\\node-learn\\src\\utils' ]
```
