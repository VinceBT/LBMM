import fs from "fs";
import path from "path";

import { Service } from "typedi";
import ws from "windows-shortcuts";

import { Logger } from "../settings/Logger";

const pathToRunner = path.resolve(process.cwd(), "LBMM_run.vbs");
const workingDirPath = path.dirname(pathToRunner);
const shortcutPath = `${process.env.APPDATA}\\Microsoft\\Windows\\Start Menu\\Programs\\Startup\\LBMM.lnk`;

@Service()
export class StartupManager {
  constructor(private logger: Logger) {}

  createShortcut() {
    ws.create(
      shortcutPath,
      {
        target: pathToRunner,
        workingDir: workingDirPath,
      },
      (err: string | null) => {
        if (err) throw Error(err);
        else this.logger.log("Shortcut created!");
      },
    );
  }

  existsShortcut(): boolean {
    const fileExists = fs.existsSync(shortcutPath);
    if (fileExists) {
      this.logger.log("Shortcut exists!");
      this.updateShortcut();
    } else {
      this.logger.log("Shortcut does not exist!");
    }
    return fileExists;
  }

  updateShortcut() {
    ws.query(shortcutPath, (_, info) => {
      if (info) {
        this.logger.log(`Shortcut points to ${info.target}`);
        if (info.target !== pathToRunner || info.workingDir !== workingDirPath) {
          this.logger.log(`Updating shortcut to ${pathToRunner}`);
          ws.edit(shortcutPath, { target: pathToRunner, workingDir: path.dirname(pathToRunner) });
        }
      }
    });
  }

  deleteShortcut() {
    fs.unlinkSync(shortcutPath);
    this.logger.log("Shortcut deleted!");
  }
}
