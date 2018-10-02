import * as fs from "fs";
import { resolveWorkspacePath } from "./pathResolver";
import * as path from "path";

export function writeFile(path: string, content: string) {
  if (fs.existsSync(path)) {
    throw new Error("文件已存在");
  }
  fs.writeFileSync(path, content);
}

export function writeFileToWorkspace(title: string, content: string) {
  let workspacePath = resolveWorkspacePath();
  let filePath = path.join(workspacePath, title);
  if (fs.existsSync(filePath)) {
    throw new Error(`${title} 文件已存在`);
  }
  writeFile(filePath, content);
}

export function readObject(path: string): Object {
  if (!fs.existsSync(path)) {
    throw new Error("文件不存在");
  }
  let result = fs.readFileSync(path);
  return JSON.parse(result.toString());
}
