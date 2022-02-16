import fs from "fs";
import path from "path";

import { Service } from "typedi";

import { MainDisplayManager } from "../managers/MainDisplayManager";

export const pathToLogs = path.resolve(process.cwd(), "logs.txt");
export const formatLogs = (...anything: any[]) => `[${new Date().toISOString()}] ${anything.join() + "\n"}`;

@Service()
export class Logger {
  constructor(private mainDisplayManager: MainDisplayManager) {
    process
      .on("unhandledRejection", (reason, p) => {
        this.log(reason, "Unhandled Rejection at Promise", p);
      })
      .on("uncaughtException", (err) => {
        this.log(err, "Uncaught Exception thrown");
      });
  }

  public log(...anything: any[]) {
    console.log(...anything);
    const logLine = formatLogs(anything);
    this.writeToLogFile(logLine);
    this.mainDisplayManager.sendString(logLine);
  }

  private writeToLogFile(value: string) {
    try {
      fs.appendFile(pathToLogs, value, function (err) {
        if (err) throw err;
      });
    } catch (e) {
      console.error("Could not append logs to log file");
    }
  }
}
