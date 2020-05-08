import * as fs from "fs";
import { resolveJoinedPath } from "./pathResolver";
import { showInfo } from "./message";

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

export function existsFileInWorkspace(title: string): boolean {
  let filePath = resolveJoinedPath(title);
  return fs.existsSync(filePath);
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

export function readSampleInput(problemName: string) {
  let actualName = problemName.split(".")[0];
  let input = "";
  try {
    input = readFile(
      resolveJoinedPath("samples", actualName + ".in")
    ).toString();
  } catch (error) {
    showInfo(actualName + " 的 Sample Input 不存在");
  } finally {
    return input;
  }
}
