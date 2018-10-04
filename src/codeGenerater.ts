import { ProjectManager } from "./projectManager";
import { writeFileToWorkspace, readFile } from "./utils/file";
import { showInfo, showError } from "./utils/message";
import { resolveJoinedPath } from "./utils/pathResolver";

export class CodeGenerater {
  private _projectManager: ProjectManager;
  constructor(projectManager: ProjectManager) {
    this._projectManager = projectManager;
  }
  public generateSource() {
    let conflicts = new Array<string>();
    try {
      let { homeworkList, defaultLanguage } = this._projectManager.readConfig();
      homeworkList.forEach(i => {
        try {
          let lang = i.language ? i.language : defaultLanguage;
          let content =
            "// " +
            i.title +
            "\n" +
            readFile(resolveJoinedPath("templates", `template.${lang}`));
          writeFileToWorkspace(`${i.num}.${lang}`, content);
        } catch (error) {
          conflicts.push(i.num);
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
