import { ProjectManager } from "./projectManager";
import { writeFileToWorkspace } from "./utils/file";
import { showInfo, showError } from "./utils/message";
import { generateTemplate } from "./utils/template";

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
          let lang = defaultLanguage;
          writeFileToWorkspace(
            `${i.num}.${lang}`,
            generateTemplate(lang, i.title)
          );
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
