import * as vscode from "vscode";
import * as fs from "fs";
import { showInfo, showError } from "./utils/message";
import { resolveConfigPath, resolveJoinedPath } from "./utils/pathResolver";
import { writeFile, readObject, createDir } from "./utils/file";
import { fetchHomeworkListFromVjudge } from "./utils/spider";
import { StatusManager } from "./utils/status";
import { getDefaultTemplate } from "./utils/template";
import { workspace } from "vscode";

export interface ProblemConfig {
  num: string;
  title: string;
  language?: string;
  oj?: string;
  inputSample?: string;
  outputSample?: string;
}

export class ProjectConfig {
  defaultLanguage: string;
  problemList: ProblemConfig[];
  sourceURL?: string;
  constructor() {
    this.defaultLanguage = "cpp";
    this.problemList = [];
  }
  public addProblem(problem: ProblemConfig) {
    this.problemList.push(problem);
  }
}

export class ProjectManager implements vscode.Disposable {
  config = new ProjectConfig();

  public readConfig(): ProjectConfig {
    try {
      let configPath = resolveConfigPath();
      let plainObj = readObject(configPath);
      let config = Object.assign(new ProjectConfig(), plainObj);
      return config;
    } catch (e) {
      showError("配置文件不存在");
      return new ProjectConfig();
    }
  }

  public async initProject() {
    let configPath = resolveConfigPath();
    if (fs.existsSync(configPath)) {
      showInfo("配置文件已存在");
      return;
    }
    const options = ["新建自定义项目", "从 Vjudge 中爬取"];
    const value = await vscode.window.showQuickPick(options);
    if (!value) {
      return;
    }
    try {
      if (value === options[0]) {
        await this.createEmptyProject(configPath);
      } else if (value === options[1]) {
        await this.createFromVjudge(configPath);
      }
    } catch (error) {
      showInfo(error.message);
      StatusManager.stopLoadingText("失败");
    }
  }

  private async createEmptyProject(configPath: string) {
    const inputNumber: string | undefined = await vscode.window.showInputBox({
      placeHolder: "请输入题目个数",
      validateInput(input: string) {
        if (!Number(input)) {
          return "格式错误: " + inputNumber;
        }
        const num = Number(input);
        if (num <= 0 || num >= 26) {
          return "错误的题目个数";
        }
        return "";
      },
    });
    if (!inputNumber) {
      return;
    }
    StatusManager.setLoadingText("生成自定义项目配置");
    const problemList = this.generateProblemList(Number(inputNumber));
    writeFile(configPath, this.generateConfigData(problemList));
    await this.createTemplateFolder(problemList);
    StatusManager.stopLoadingText("$(check) 配置生成完成");
  }

  private async createFromVjudge(configPath: string) {
    const url = await vscode.window.showInputBox({ placeHolder: "请输入 'Vjudge Contest' 的URL" });
    if (!url) {
      return;
    }
    try {
      StatusManager.setLoadingText("从 Vjudge 上获取项目");
      const problemList = await fetchHomeworkListFromVjudge(url);
      writeFile(configPath, this.generateConfigData(problemList, url));
      await this.createTemplateFolder(problemList);
      StatusManager.stopLoadingText("$(check) 配置生成完成");
    } catch (error) {
      StatusManager.stopLoadingText("配置生成失败");
      showError("配置生成失败");
    }
  }

  private async createTemplateFolder(resultList: ProblemConfig[]) {
    let shouldCreateTemplates = true;
    if (!!workspace.getConfiguration("better-oj").get("globalTemplatesFolder")) {
      // 若配置了全局模版文件，询问是否要额外生成本地路径
      const select = await vscode.window.showQuickPick(["使用全局模版", "创建本地模版"], {
        placeHolder: "检测到全局模版配置",
      });
      shouldCreateTemplates = select === "创建本地模版";
    }
    if (shouldCreateTemplates) {
      createDir("templates");
      ["cpp", "c"].forEach(item => {
        writeFile(resolveJoinedPath("templates", `template.${item}`), getDefaultTemplate(item));
      });
    }
    createDir("samples");
    resultList.forEach(item => {
      writeFile(resolveJoinedPath("samples", `${item.num}.in`), "");
    });
  }

  private generateConfigData(problemList: ProblemConfig[], sourceURL?: string): string {
    this.config = new ProjectConfig();
    this.config.problemList = problemList;
    if (sourceURL) {
      this.config.sourceURL = sourceURL;
    }
    return JSON.stringify(this.config, undefined, 2);
  }

  private generateProblemList(questionNumber: number): ProblemConfig[] {
    let problemList: ProblemConfig[] = [];
    for (let index = 0; index < questionNumber; index++) {
      let num = String.fromCharCode("A".charCodeAt(0) + index);
      problemList.push({
        num: num,
        language: "",
        title: "Problem " + num,
      });
    }
    return problemList;
  }

  public dispose() {}
}
