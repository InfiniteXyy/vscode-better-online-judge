import * as vscode from "vscode";
import * as fs from "fs";
import { showError, showInfo } from "./utils/message";
import { resolveConfigPath } from "./utils/pathResolver";
import { writeFile, readObject } from "./utils/file";

export class HomeworkConfig {
  title: string;
  inputSample: string;
  outputSample: string;
  constructor(title: string, inputSample: string, outputSample: string) {
    this.title = title;
    this.inputSample = inputSample;
    this.outputSample = outputSample;
  }
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

export class ConfigManager implements vscode.Disposable {
  config = new ProjectConfig();

  public readConfig(): ProjectConfig | undefined {
    try {
      let configPath = resolveConfigPath();
      let plainObj = readObject(configPath);
      let config = Object.assign(new ProjectConfig(), plainObj);
      return config;
    } catch (error) {
      showError(error.message);
    }
  }

  public createConfig() {
    let configPath = resolveConfigPath();
    try {
      if (fs.existsSync(configPath)) {
        showInfo("配置文件已存在");
      } else {
        vscode.window
          .showInputBox({ placeHolder: "请输入题目个数" })
          .then(inputNumber => {
            if (!inputNumber || !Number(inputNumber)) {
              showError("格式错误: " + inputNumber);
            } else {
              let nums = Number(inputNumber);
              if (nums <= 0 || nums >= 26) {
                showError("题目数不正确");
                return;
              }
              writeFile(
                configPath,
                this.generateConfigData(Number(inputNumber))
              );
            }
          });
      }
    } catch (error) {
      showError(error.message);
    }
  }

  private generateConfigData(questionNumber: number): string {
    this.config = new ProjectConfig();
    for (let index = 0; index < questionNumber; index++) {
      let title = String.fromCharCode("A".charCodeAt(0) + index);
      this.config.addHomework(new HomeworkConfig(title, "", ""));
    }

    return JSON.stringify(this.config, undefined, 2);
  }

  public dispose() {
    console.log("dispose");
  }
}
