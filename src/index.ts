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
