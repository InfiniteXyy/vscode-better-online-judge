import { commands, ExtensionContext } from "vscode";
import { ProjectManager } from "./projectManager";
import { CodeGenerater } from "./codeGenerater";
import { CodeRunnder } from "./codeRunner";
import { fetchHomeworkListFromVjudge } from "./utils/spider";

export function activate(context: ExtensionContext) {
  console.log('"Better Online Judge" now active!');
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
    codeRunnder.run();
  });
  let runCurrentCode = commands.registerCommand(
    "betterOJ.runCurrentCode",
    () => {
      codeRunnder.runCurrentCode();
    }
  );
  // The command has been defined in the package.json file
  context.subscriptions.push(initProject);
  context.subscriptions.push(generater);
  context.subscriptions.push(runCode);
  context.subscriptions.push(runCurrentCode);
}

export function deactivate() {
  console.log("deactive");
}
