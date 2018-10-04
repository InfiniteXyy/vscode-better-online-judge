import * as fs from "fs";
import { resolveJoinedPath } from "./pathResolver";

export function writeFile(path: string, content: string) {
  if (fs.existsSync(path)) {
    throw new Error("文件已存在");
  }
  fs.writeFileSync(path, content);
}

export function readFile(path: string) {
  if (!fs.existsSync(path)) {
    throw new Error(`${path} 文件不存在`);
  }
  return fs.readFileSync(path);
}

export function writeFileToWorkspace(title: string, content: string) {
  let filePath = resolveJoinedPath(title);
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

export function createDir(name: string) {
  let dirPath = resolveJoinedPath(name);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath);
  }
}