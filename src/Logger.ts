import { Configuration } from "./Configuration";

export abstract class Logger {
  public static log(...anything: any) {
    if (Configuration.Debug) {
      console.log(...anything);
    }
  }
}
