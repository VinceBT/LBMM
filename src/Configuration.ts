import fs from "fs";
import path from "path";

interface SettingsMap {
  daemon: string;
  arguments: {
    on: string[],
    off: string[],
  },
  programs: string[];
  default: boolean,
  interval: number,
}

const settingsRaw = fs
  .readFileSync(path.resolve(process.cwd(), "settings.json"))
  .toString();
const settingsJson = JSON.parse(settingsRaw) as SettingsMap;

export abstract class Configuration {
  public static get Environment() {
    return process.env.NODE_ENV || "production";
  }

  public static get Debug() {
    return Configuration.Environment === "development";
  }

  public static get Settings() {
    return settingsJson;
  }
}
