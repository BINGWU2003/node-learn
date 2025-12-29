# Node.js process

process 是 Node.js 中的一个全局对象，它提供与当前进程相关的信息和控制方法。

## process.cwd()

用于获取当前工作目录(当前执行命令的目录)。

```typescript
console.log(process.cwd());
// 输出: /Users/your-username/your-project
```

取决于在哪执行了命令，就会输出对应的目录。

## process.exit()

用于退出当前进程。

```typescript
process.exit(0);
// 输出: 0
```

## process.argv

用于获取当前命令行参数。

```typescript
console.log(process.argv);
// 运行命令: node index.ts a b c
// 输出: [ 'nodejs可执行文件的绝对路径', '当前文件的绝对路径', 'a', 'b', 'c' ]
```

`process.argv` 是一个数组，里面的内容顺序是固定的。通常包含三个部分：

- 索引 0 (argv[0]): Node.js 可执行文件的绝对路径（即你电脑上 node 程序在哪里）。
- 索引 1 (argv[1]): 正在被执行的 JavaScript 文件的绝对路径。
- 索引 2 及以后 (argv[2...]): 真正的用户参数（你在命令行里敲在文件名后面的那些东西）。

工具库推荐：

- [commander.js](https://www.npmjs.com/package/commander)
- [minimist](https://www.npmjs.com/package/minimist)
- [yargs](https://www.npmjs.com/package/yargs)

## process.env

用于获取当前环境变量。

```typescript
console.log(process.env);
// 输出: { NODE_ENV: 'development' } 或者 { NODE_ENV: 'production' }
```

一般用来判断当前是开发环境还是生产环境。

借助 .env 文件+dotenv 库来获取环境变量。

.env 文件内容：

```bash
MY_ENV = 1111
```

```typescript
import dotenv from "dotenv";
const env = dotenv.config();
console.log(env.parsed);
// 输出: { MY_ENV: '1111' }
```
