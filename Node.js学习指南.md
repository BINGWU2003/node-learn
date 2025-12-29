# Node.js 学习指南

> 专注于命令行脚本开发和 Vite 文件流插件开发

## 📚 目录

1. [Node.js 基础](#nodejs-基础)
2. [命令行脚本开发](#命令行脚本开发)
3. [文件流处理](#文件流处理)
4. [Vite 插件开发](#vite-插件开发)
5. [实战项目](#实战项目)
6. [推荐资源](#推荐资源)

---

## Node.js 基础

### 1. 核心模块

#### 1.1 文件系统 (fs)
- **同步 vs 异步操作**
  - `fs.readFileSync()` / `fs.readFile()`
  - `fs.writeFileSync()` / `fs.writeFile()`
  - `fs.mkdirSync()` / `fs.mkdir()`
- **流式操作**
  - `fs.createReadStream()`
  - `fs.createWriteStream()`
- **路径操作**
  - `fs.stat()` / `fs.statSync()` - 获取文件信息
  - `fs.readdir()` / `fs.readdirSync()` - 读取目录
  - `fs.watch()` - 监听文件变化

**学习重点：**
```typescript
import fs from 'fs';
import path from 'path';

// 递归读取目录
function readDirRecursive(dir: string): string[] {
  const files: string[] = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      files.push(...readDirRecursive(fullPath));
    } else {
      files.push(fullPath);
    }
  }
  
  return files;
}
```

#### 1.2 路径处理 (path)
- `path.join()` - 拼接路径
- `path.resolve()` - 解析绝对路径
- `path.dirname()` - 获取目录名
- `path.basename()` - 获取文件名
- `path.extname()` - 获取扩展名
- `path.parse()` - 解析路径对象

#### 1.3 进程管理 (process)
- `process.argv` - 命令行参数
- `process.cwd()` - 当前工作目录
- `process.env` - 环境变量
- `process.exit()` - 退出进程
- `process.stdin` / `process.stdout` / `process.stderr` - 标准输入输出

#### 1.4 流 (Stream)
- **可读流 (Readable Stream)**
  - `fs.createReadStream()`
  - `process.stdin`
- **可写流 (Writable Stream)**
  - `fs.createWriteStream()`
  - `process.stdout`
- **转换流 (Transform Stream)**
  - 自定义转换逻辑
- **管道操作**
  - `stream.pipe()`
  - `stream.pipeline()`

**学习重点：**
```typescript
import { Transform } from 'stream';

class UpperCaseTransform extends Transform {
  _transform(chunk: Buffer, encoding: string, callback: Function) {
    this.push(chunk.toString().toUpperCase());
    callback();
  }
}

// 使用示例
readStream
  .pipe(new UpperCaseTransform())
  .pipe(writeStream);
```

### 2. 常用工具库

#### 2.1 Commander.js
用于构建命令行工具

```bash
pnpm add commander
```

```typescript
import { Command } from 'commander';

const program = new Command();

program
  .name('my-cli')
  .description('CLI工具描述')
  .version('1.0.0');

program
  .command('build')
  .description('构建项目')
  .option('-o, --output <dir>', '输出目录', 'dist')
  .option('-w, --watch', '监听模式')
  .action((options) => {
    console.log('构建选项:', options);
  });

program.parse();
```

#### 2.2 Inquirer.js
交互式命令行提示

```bash
pnpm add inquirer @types/inquirer
```

```typescript
import inquirer from 'inquirer';

const questions = [
  {
    type: 'input',
    name: 'name',
    message: '请输入项目名称:',
  },
  {
    type: 'list',
    name: 'template',
    message: '选择模板:',
    choices: ['react', 'vue', 'vanilla'],
  },
];

const answers = await inquirer.prompt(questions);
```

#### 2.3 Chalk
终端颜色输出

```bash
pnpm add chalk
```

```typescript
import chalk from 'chalk';

console.log(chalk.blue('信息'));
console.log(chalk.green('成功'));
console.log(chalk.red('错误'));
console.log(chalk.yellow('警告'));
```

#### 2.4 Ora
优雅的加载动画

```bash
pnpm add ora
```

```typescript
import ora from 'ora';

const spinner = ora('正在处理...').start();

try {
  // 执行任务
  await doSomething();
  spinner.succeed('完成！');
} catch (error) {
  spinner.fail('失败！');
}
```

#### 2.5 Globby
文件匹配工具

```bash
pnpm add globby
```

```typescript
import { globby } from 'globby';

const files = await globby(['**/*.ts', '!**/*.test.ts']);
```

---

## 命令行脚本开发

### 1. 基础 CLI 工具结构

```
my-cli/
├── bin/
│   └── cli.js          # 入口文件（shebang: #!/usr/bin/env node）
├── src/
│   ├── commands/       # 命令模块
│   ├── utils/          # 工具函数
│   └── index.ts
├── package.json
└── tsconfig.json
```

### 2. package.json 配置

```json
{
  "name": "my-cli",
  "version": "1.0.0",
  "bin": {
    "my-cli": "./bin/cli.js"
  },
  "files": [
    "bin",
    "dist"
  ]
}
```

### 3. 命令行参数解析

#### 3.1 使用 process.argv

```typescript
// 解析命令行参数
const args = process.argv.slice(2);
const command = args[0];
const options: Record<string, string | boolean> = {};

for (let i = 1; i < args.length; i++) {
  const arg = args[i];
  if (arg.startsWith('--')) {
    const key = arg.slice(2);
    const nextArg = args[i + 1];
    if (nextArg && !nextArg.startsWith('--')) {
      options[key] = nextArg;
      i++;
    } else {
      options[key] = true;
    }
  } else if (arg.startsWith('-')) {
    const key = arg.slice(1);
    options[key] = true;
  }
}
```

#### 3.2 使用 Commander.js（推荐）

```typescript
import { Command } from 'commander';

const program = new Command();

program
  .name('file-processor')
  .description('文件处理工具')
  .version('1.0.0');

program
  .command('transform <input>')
  .description('转换文件')
  .option('-o, --output <path>', '输出路径')
  .option('-w, --watch', '监听模式')
  .action(async (input, options) => {
    // 处理逻辑
  });

program.parse();
```

### 4. 文件监听

```typescript
import chokidar from 'chokidar';

const watcher = chokidar.watch('src/**/*.ts', {
  ignored: /node_modules/,
  persistent: true,
});

watcher
  .on('add', (path) => console.log(`文件添加: ${path}`))
  .on('change', (path) => console.log(`文件修改: ${path}`))
  .on('unlink', (path) => console.log(`文件删除: ${path}`));
```

### 5. 进度显示

```typescript
import cliProgress from 'cli-progress';

const bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

bar.start(100, 0);

// 更新进度
for (let i = 0; i <= 100; i++) {
  await processFile();
  bar.update(i);
}

bar.stop();
```

---

## 文件流处理

### 1. Node.js Stream API

#### 1.1 基础流操作

```typescript
import fs from 'fs';
import { pipeline } from 'stream/promises';

// 读取文件流
const readStream = fs.createReadStream('input.txt');

// 写入文件流
const writeStream = fs.createWriteStream('output.txt');

// 管道连接
await pipeline(readStream, writeStream);
```

#### 1.2 转换流

```typescript
import { Transform } from 'stream';

class ReplaceTransform extends Transform {
  constructor(private search: string, private replace: string) {
    super();
  }

  _transform(chunk: Buffer, encoding: string, callback: Function) {
    const result = chunk.toString().replace(this.search, this.replace);
    this.push(result);
    callback();
  }
}

// 使用
readStream
  .pipe(new ReplaceTransform('old', 'new'))
  .pipe(writeStream);
```

#### 1.3 批量处理

```typescript
import { Transform } from 'stream';

class BatchTransform extends Transform {
  private buffer: Buffer[] = [];
  private batchSize: number;

  constructor(batchSize: number = 10) {
    super({ objectMode: true });
    this.batchSize = batchSize;
  }

  _transform(chunk: any, encoding: string, callback: Function) {
    this.buffer.push(chunk);
    
    if (this.buffer.length >= this.batchSize) {
      this.push([...this.buffer]);
      this.buffer = [];
    }
    
    callback();
  }

  _flush(callback: Function) {
    if (this.buffer.length > 0) {
      this.push([...this.buffer]);
    }
    callback();
  }
}
```

### 2. 文件处理库

#### 2.1 Vinyl
虚拟文件对象

```bash
pnpm add vinyl
```

```typescript
import File from 'vinyl';

const file = new File({
  cwd: '/',
  base: '/test/',
  path: '/test/file.js',
  contents: Buffer.from('const a = 1;'),
});

console.log(file.relative); // 'file.js'
console.log(file.extname);  // '.js'
```

#### 2.2 Through2
简化流操作

```bash
pnpm add through2
```

```typescript
import through from 'through2';

const transform = through.obj((file, enc, cb) => {
  if (file.isBuffer()) {
    const content = file.contents.toString();
    file.contents = Buffer.from(content.toUpperCase());
  }
  cb(null, file);
});
```

#### 2.3 Gulp 风格插件

```typescript
import through from 'through2';
import File from 'vinyl';

function myPlugin(options = {}) {
  return through.obj((file: File, enc, cb) => {
    if (file.isNull()) {
      return cb(null, file);
    }

    if (file.isStream()) {
      return cb(new Error('不支持流模式'));
    }

    try {
      const content = file.contents.toString();
      const transformed = transformContent(content, options);
      file.contents = Buffer.from(transformed);
      cb(null, file);
    } catch (err) {
      cb(err);
    }
  });
}
```

---

## Vite 插件开发

### 1. Vite 插件基础

#### 1.1 插件结构

```typescript
import type { Plugin } from 'vite';

export function myVitePlugin(options = {}): Plugin {
  return {
    name: 'my-vite-plugin',
    enforce: 'pre', // 'pre' | 'post'
    
    // 构建开始
    buildStart() {
      console.log('构建开始');
    },
    
    // 解析 ID
    resolveId(id) {
      if (id === 'virtual:module') {
        return id; // 返回虚拟模块 ID
      }
    },
    
    // 加载模块
    load(id) {
      if (id === 'virtual:module') {
        return 'export default "virtual module"';
      }
    },
    
    // 转换代码
    transform(code, id) {
      if (id.endsWith('.vue')) {
        // 转换 Vue 文件
        return {
          code: transformedCode,
          map: null,
        };
      }
    },
    
    // 生成代码
    generateBundle(options, bundle) {
      // 修改或添加输出文件
    },
  };
}
```

#### 1.2 文件处理插件

```typescript
import type { Plugin } from 'vite';
import { readFileSync } from 'fs';
import { resolve } from 'path';

export function fileLoaderPlugin(): Plugin {
  return {
    name: 'file-loader',
    
    load(id) {
      // 处理特殊文件扩展名
      if (id.endsWith('.custom')) {
        const filePath = id.replace(/\?.*$/, '');
        const content = readFileSync(filePath, 'utf-8');
        
        // 转换为 ES 模块
        return `export default ${JSON.stringify(content)};`;
      }
    },
  };
}
```

#### 1.3 虚拟模块插件

```typescript
import type { Plugin } from 'vite';

export function virtualModulePlugin(): Plugin {
  const virtualModuleId = 'virtual:config';
  const resolvedVirtualModuleId = '\0' + virtualModuleId;

  return {
    name: 'virtual-module',
    
    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId;
      }
    },
    
    load(id) {
      if (id === resolvedVirtualModuleId) {
        return `export const config = ${JSON.stringify({
          version: '1.0.0',
          env: process.env.NODE_ENV,
        })};`;
      }
    },
  };
}
```

### 2. 文件流处理插件

#### 2.1 文件转换插件

```typescript
import type { Plugin } from 'vite';
import { Transform } from 'stream';
import { createReadStream, createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';

class FileTransform extends Transform {
  constructor(private transformFn: (content: string) => string) {
    super();
  }

  _transform(chunk: Buffer, encoding: string, callback: Function) {
    const content = chunk.toString();
    const transformed = this.transformFn(content);
    this.push(Buffer.from(transformed));
    callback();
  }
}

export function fileTransformPlugin(options: {
  include?: string[];
  transform: (content: string, id: string) => string;
}): Plugin {
  return {
    name: 'file-transform',
    
    transform(code, id) {
      const shouldTransform = options.include?.some(pattern => 
        id.match(new RegExp(pattern))
      ) ?? true;

      if (shouldTransform) {
        return {
          code: options.transform(code, id),
          map: null,
        };
      }
    },
  };
}
```

#### 2.2 文件监听插件

```typescript
import type { Plugin } from 'vite';
import chokidar from 'chokidar';

export function fileWatcherPlugin(options: {
  watch: string[];
  onFileChange: (path: string) => void;
}): Plugin {
  let watcher: chokidar.FSWatcher | null = null;

  return {
    name: 'file-watcher',
    
    buildStart() {
      watcher = chokidar.watch(options.watch);
      watcher.on('change', options.onFileChange);
    },
    
    buildEnd() {
      watcher?.close();
    },
  };
}
```

#### 2.3 批量处理插件

```typescript
import type { Plugin } from 'vite';
import { globby } from 'globby';

export function batchProcessPlugin(options: {
  pattern: string[];
  processor: (files: string[]) => Promise<void>;
}): Plugin {
  return {
    name: 'batch-process',
    
    async buildStart() {
      const files = await globby(options.pattern);
      await options.processor(files);
    },
  };
}
```

### 3. 常用 Vite 插件 API

#### 3.1 钩子函数

- **`resolveId`** - 解析模块 ID
- **`load`** - 加载模块内容
- **`transform`** - 转换代码
- **`buildStart`** - 构建开始
- **`buildEnd`** - 构建结束
- **`generateBundle`** - 生成输出文件
- **`writeBundle`** - 写入文件后

#### 3.2 工具函数

```typescript
import { normalizePath } from 'vite';

// 规范化路径
const normalized = normalizePath('path/to/file');

// 使用 Vite 的解析器
import { createFilter } from '@rollup/pluginutils';

const filter = createFilter(
  ['**/*.ts', '**/*.tsx'],
  ['**/*.test.ts', 'node_modules/**']
);

if (filter(id)) {
  // 处理文件
}
```

---

## 实战项目

### 项目 1: 文件批量重命名工具

**功能：**
- 批量重命名文件
- 支持正则替换
- 支持预览模式

**技术栈：**
- Commander.js
- Inquirer.js
- Chalk
- Globby

### 项目 2: 代码转换工具

**功能：**
- 转换代码格式
- 批量处理文件
- 支持自定义转换规则

**技术栈：**
- Stream API
- Through2
- Vinyl

### 项目 3: Vite 文件处理插件

**功能：**
- 自动处理特定文件类型
- 文件内容转换
- 虚拟模块生成

**技术栈：**
- Vite Plugin API
- Stream API
- File System API

### 项目 4: 开发工具 CLI

**功能：**
- 项目初始化
- 代码生成
- 文件监听和自动处理

**技术栈：**
- Commander.js
- Chokidar
- File System API

---

## 推荐资源

### 官方文档
- [Node.js 官方文档](https://nodejs.org/docs/)
- [Vite 插件开发指南](https://vitejs.dev/guide/api-plugin.html)
- [Stream 文档](https://nodejs.org/api/stream.html)

### 学习资源
- **Node.js Stream 手册** - 深入理解流的概念
- **Commander.js 文档** - CLI 工具开发
- **Vite 源码** - 学习插件开发最佳实践

### 推荐库
- **commander** - CLI 框架
- **inquirer** - 交互式提示
- **chalk** - 终端颜色
- **ora** - 加载动画
- **globby** - 文件匹配
- **chokidar** - 文件监听
- **through2** - 流处理
- **vinyl** - 虚拟文件对象

### 实践建议
1. **从简单开始** - 先实现基础的文件读写
2. **理解流的概念** - 掌握 Stream API
3. **学习现有插件** - 阅读 Vite 官方插件源码
4. **逐步增加复杂度** - 从单一功能到完整工具
5. **测试驱动** - 编写测试确保功能正确

---

## 学习路径

### 第一阶段：基础掌握（1-2周）
- [ ] Node.js 核心模块（fs, path, process, stream）
- [ ] TypeScript 基础
- [ ] 简单的命令行脚本

### 第二阶段：工具开发（2-3周）
- [ ] 使用 Commander.js 构建 CLI
- [ ] 文件系统操作
- [ ] 流处理基础

### 第三阶段：高级应用（3-4周）
- [ ] 复杂流处理
- [ ] Vite 插件开发
- [ ] 文件监听和处理

### 第四阶段：实战项目（持续）
- [ ] 开发自己的工具
- [ ] 优化和重构
- [ ] 开源贡献

---

**祝你学习愉快！** 🚀

