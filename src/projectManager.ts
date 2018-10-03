import * as vscode from "vscode";
import * as fs from "fs";
import { showInfo } from "./utils/message";
import { resolveConfigPath } from "./utils/pathResolver";
import { writeFile, readObject } from "./utils/file";
import { fetchHomeworkListFromVjudge } from "./utils/spider";

export interface HomeworkConfig {
  num: string;
  title: string;
  language?: string;
  oj?: string;
  inputSample: string;
  outputSample: string;
}

export class ProjectConfig {
  defaultLanguage: string;
  templates: Array<string>;
  homeworkList: Array<HomeworkConfig>;
  constructor() {
    this.defaultLanguage = "cpp";
    this.templates = ["cpp"];
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

    vscode.window.showQuickPick(options).then(value => {
      try {
        if (!value) {
          return;
        }
        let configPath = resolveConfigPath();
        if (fs.existsSync(configPath)) {
          throw new Error("配置文件已存在");
        }
        if (value === options[0]) {
          this.createEmptyProject(configPath);
        } else if (value === options[1]) {
          this.createFromVjudge(configPath);
        }
      } catch (error) {
        showInfo(error.message);
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
        let homeworkList = this.generateHomeworkList(nums);
        writeFile(configPath, this.generateConfigData(homeworkList));
      });
  }

  private createFromVjudge(configPath: string) {
    vscode.window
      .showInputBox({ placeHolder: "请输入 'Vjudge Contest' 的网址" })
      .then(value => {
        if (!value) {
          return;
        }
        fetchHomeworkListFromVjudge(value)
          .then(resultList => {
            writeFile(configPath, this.generateConfigData(resultList));
          })
          .catch(e => {
            throw new Error("读取 Vjudge 失败");
          });
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
        title: "Problem " + num,
        inputSample: "",
        outputSample: ""
      });
    }
    return homeowrkList;
  }

  public dispose() {
    console.log("dispose");
  }
}
