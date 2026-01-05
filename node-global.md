# 常用的一些全局变量

- \_\_dirname: 当前文件的目录
- \_\_filename: 当前文件的文件名
- process: 当前进程

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

## process

它提供与当前进程相关的信息和控制方法。
