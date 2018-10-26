import * as vscode from "vscode";
import * as fs from "fs";
import { showInfo, showError } from "./utils/message";
import { resolveConfigPath, resolveJoinedPath } from "./utils/pathResolver";
import { writeFile, readObject, createDir } from "./utils/file";
import { fetchHomeworkListFromVjudge } from "./utils/spider";
import { StatusManager } from "./utils/status";
import { getDefaultTemplate } from "./utils/template";

export interface HomeworkConfig {
  num: string;
  title: string;
  language?: string;
  oj?: string;
  inputSample?: string;
  outputSample?: string;
}

export class ProjectConfig {
  defaultLanguage: string;
  homeworkList: Array<HomeworkConfig>;
  constructor() {
    this.defaultLanguage = "cpp";
    this.homeworkList = [];
  }
  public addHomework(homework: HomeworkConfig) {
    this.homeworkList.push(homework);
  }
}

export class ProjectManager implements vscode.Disposable {
  config = new ProjectConfig();

  public readConfig(): ProjectConfig {
    let configPath = resolveConfigPath();
    let plainObj = readObject(configPath);
    let config = Object.assign(new ProjectConfig(), plainObj);
    return config;
  }

  public initProject() {
    let options = ["新建自定义项目", "从 Vjudge 中爬取"];
    let configPath = resolveConfigPath();
    if (fs.existsSync(configPath)) {
      showInfo("配置文件已存在");
      return;
    }
    vscode.window.showQuickPick(options).then(value => {
      try {
        if (!value) {
          return;
        }
        if (value === options[0]) {
          this.createEmptyProject(configPath);
        } else if (value === options[1]) {
          this.createFromVjudge(configPath);
        }
      } catch (error) {
        showInfo(error.message);
        StatusManager.stopLoadingText("失败");
      }
    });
  }

  private createEmptyProject(configPath: string) {
    vscode.window
      .showInputBox({ placeHolder: "请输入题目个数" })
      .then(inputNumber => {
        if (!inputNumber || !Number(inputNumber)) {
          throw new Error("格式错误: " + inputNumber);
        }
        let nums = Number(inputNumber);
        if (nums <= 0 || nums >= 26) {
          throw new Error("格式错误: " + inputNumber);
        }
        StatusManager.setLoadingText("生成自定义项目配置");
        let homeworkList = this.generateHomeworkList(nums);
        writeFile(configPath, this.generateConfigData(homeworkList));
        this.createTemplateFolder(homeworkList);
        StatusManager.stopLoadingText("$(check) 配置生成完成");
      });
  }

  private createFromVjudge(configPath: string) {
    vscode.window
      .showInputBox({ placeHolder: "请输入 'Vjudge Contest' 的网址" })
      .then(value => {
        if (!value) {
          return;
        }
        StatusManager.setLoadingText("从 Vjudge 上获取项目");
        fetchHomeworkListFromVjudge(value)
          .then(resultList => {
            writeFile(configPath, this.generateConfigData(resultList));
            this.createTemplateFolder(resultList);
            StatusManager.stopLoadingText("$(check) 配置生成完成");
          })
          .catch(e => {
            StatusManager.stopLoadingText("配置生成失败");
            showError("配置生成失败");
          });
      });
  }

  private createTemplateFolder(resultList: Array<HomeworkConfig>) {
    createDir("templates");
    ["cpp", "c"].forEach(item => {
      writeFile(
        resolveJoinedPath("templates", `template.${item}`),
        getDefaultTemplate(item)
      );
    });
    createDir("samples");
    resultList.forEach(item => {
      writeFile(resolveJoinedPath("samples", `${item.num}.in`), "");
    });
  }

  private generateConfigData(homeowrkList: Array<HomeworkConfig>): string {
    this.config = new ProjectConfig();
    this.config.homeworkList = homeowrkList;
    return JSON.stringify(this.config, undefined, 2);
  }

  private generateHomeworkList(questionNumber: number): Array<HomeworkConfig> {
    let homeowrkList: Array<HomeworkConfig> = [];
    for (let index = 0; index < questionNumber; index++) {
      let num = String.fromCharCode("A".charCodeAt(0) + index);
      homeowrkList.push({
        num: num,
        language: "",
        title: "Problem " + num
      });
    }
    return homeowrkList;
  }

  public dispose() {
    console.log("dispose");
  }
}
