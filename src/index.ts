import dotenv from "dotenv";
const env = dotenv.config();
const a = 1;

function add(a: number, b: number) {
  return a + b;
}
console.log(global);
console.log(__dirname);
console.log(__filename);
console.log(process.cwd());
console.log(process.argv);
console.log(process.env.NODE_ENV);
console.log(env);
console.log(add(a, 2));
