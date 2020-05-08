import { commands, ExtensionContext, Uri, env } from "vscode";
import { ProjectManager } from "./projectManager";
import { CodeGenerater } from "./codeGenerater";
import { CodeRunnder } from "./codeRunner";
import { showInfo } from "./utils/message";

export function activate(context: ExtensionContext) {
  const projectManager = new ProjectManager();
  const codeGenerater = new CodeGenerater(projectManager);
  const codeRunnder = new CodeRunnder(projectManager);
  let initProject = commands.registerCommand("betterOJ.initProject", () => {
    projectManager.initProject();
  });
  let generater = commands.registerCommand("betterOJ.generateProject", () => {
    codeGenerater.generateSource();
  });
  let runCode = commands.registerCommand("betterOJ.runCode", () => {
    codeRunnder.run(false);
  });
  let runCodeWithSampleInput = commands.registerCommand("betterOJ.runCodeWithSampleInput", () => {
    codeRunnder.run(true);
  });
  let runCurrentCode = commands.registerCommand("betterOJ.runCurrentCode", () => {
    codeRunnder.runCurrentCode();
  });
  let testCurrentCode = commands.registerCommand("betterOJ.testCurrentCode", () => {
    codeRunnder.runCurrentCode(true);
  });
  let openWebUI = commands.registerCommand("betterOJ.openProblemWebUI", () => {
    const url = projectManager.readConfig().sourceURL;
    if (url) {
      env.openExternal(Uri.parse(url));
    } else {
      showInfo("本地项目无法打开 Web 页面");
    }
  });
  // The command has been defined in the package.json file
  context.subscriptions.push(initProject);
  context.subscriptions.push(generater);
  context.subscriptions.push(runCode);
  context.subscriptions.push(runCodeWithSampleInput);
  context.subscriptions.push(runCurrentCode);
  context.subscriptions.push(testCurrentCode);
  context.subscriptions.push(openWebUI);
}

export function deactivate() {
  console.log("deactive");
}
