import { ProjectManager } from "./projectManager";
import { writeFileToWorkspace, readFile, existsFileInWorkspace } from "./utils/file";
import { showInfo, showError } from "./utils/message";
import { resolveJoinedPath, joinPath } from "./utils/pathResolver";
import * as fs from "fs";
import { getDefaultTemplate } from "./utils/template";
import { workspace } from "vscode";

// 从硬编码、全局或当前目录获取到模版文件
function getTemplateContent(ext: string): string {
  // 当前目录下的模版优先
  const localPath = resolveJoinedPath("templates", `template.${ext}`);
  if (fs.existsSync(localPath)) {
    return readFile(localPath).toString();
  }
  // 之后检查全局目录
  const globalFolder = workspace.getConfiguration("better-oj").get<string>("globalTemplatesFolder");
  const globalPath = joinPath(globalFolder ?? "", `template.${ext}`);
  if (globalFolder && fs.existsSync(globalPath)) {
    return readFile(globalPath).toString();
  }
  // 最后从硬编码中获取
  return getDefaultTemplate(ext);
}

// 根据模版文件输出代码，并替换模版数据
function renderTemplate(template: string, payload: any): string {
  const reg = /\{\{\s*(\w+)\s*\}\}/g;
  if (!reg.test(template)) {
    return template;
  }
  return template.replace(reg, (matched, key) => {
    if (payload.hasOwnProperty(key)) {
      return payload[key];
    }
    return matched;
  });
}

export class CodeGenerater {
  private _projectManager: ProjectManager;
  constructor(projectManager: ProjectManager) {
    this._projectManager = projectManager;
  }

  public generateSource() {
    const conflicts: string[] = [];
    const date = new Date().toLocaleString("zh-CN");
    try {
      const { problemList, defaultLanguage } = this._projectManager.readConfig();
      problemList.forEach(i => {
        const ext = i.language ? i.language : defaultLanguage;
        if (existsFileInWorkspace(`${i.num}.${ext}`)) {
          conflicts.push(i.num);
        } else {
          const payload = { title: i.title, date };
          const template = getTemplateContent(ext);
          const code = renderTemplate(template, payload);
          writeFileToWorkspace(`${i.num}.${ext}`, code);
        }
      });
    } catch (error) {
      showError(error.message);
    }
    if (conflicts.length !== 0) {
      showInfo(`已存在：${conflicts.join(", ")}`);
    }
  }
}
