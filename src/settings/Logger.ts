import fs from "fs";
import path from "path";

import { Service } from "typedi";

export const pathToLogs = path.resolve(process.cwd(), "logs.txt");

@Service()
export class Logger {
  public log(...anything: any) {
    console.log(...anything);

    try {
      fs.appendFile(pathToLogs, `[${new Date().toISOString()}] ${anything.join() + "\n"}`, function (err) {
        if (err) throw err;
      });
    } catch (e) {
      console.error("Could not append logs to log file");
    }
  }
}
