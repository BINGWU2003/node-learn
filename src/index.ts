import dotenv from "dotenv";
import path from "path";

const env = dotenv.config();

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

// __dirname 和 path.dirname() 的关系：
const dirname = path.dirname(__filename);
console.log(dirname === __dirname);
// 输出: true
