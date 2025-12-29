# 常用的一些全局变量

- \_\_dirname: 当前文件的目录
- \_\_filename: 当前文件的文件名
- process: 当前进程
- console: 控制台
- require: 加载模块
- module: 当前模块
- exports: 导出模块
- global: 全局对象
- Buffer: 缓冲区
- process: 当前进程
- console: 控制台

## \_\_dirname

用于获取当前文件的目录，不包含文件名。

```typescript
console.log(__dirname);
// 输出: /Users/your-username/your-project
```

## \_\_filename

用于获取当前文件的文件名，包含文件名。

```typescript
console.log(__filename);
// 输出: /Users/your-username/your-project/index.ts
```
