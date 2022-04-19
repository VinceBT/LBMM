import { EventEmitter } from "events";
import fs from "fs";
import path from "path";

import { debounce } from "lodash";
import { Service } from "typedi";

import { StartupManager } from "../managers/StartupManager";

import { Logger } from "./Logger";

export const pathToSettingsJson = path.resolve(process.cwd(), "settings.json");

interface SettingsMap {
  daemon: string;
  interval: number;
  debounce: number;
  startup: boolean;
  blacklist: string[];
}

export type SettingsChangeCallback = () => void;

@Service()
export class Settings {
  public eventEmitter = new EventEmitter.EventEmitter();
  private json: SettingsMap;
  private watcher: fs.FSWatcher;

  constructor(private startupManager: StartupManager, private logger: Logger) {
    this.json = this.loadJsonFile();
    this.applySettings();
    this.watcher = this.watchJsonFile();
  }

  get daemon() {
    return this.json.daemon;
  }

  get interval() {
    return this.json.interval;
  }

  get debounce() {
    return this.json.debounce;
  }

  get startup() {
    return this.json.startup;
  }

  set startup(value: boolean) {
    this.json.startup = value;
    this.saveJsonFile();
    this.applySettings();
  }

  get blacklist() {
    return this.json.blacklist;
  }

  addListener(cb: SettingsChangeCallback) {
    this.eventEmitter.on("changed", () => {
      cb();
    });
  }

  private loadJsonFile() {
    const settingsRaw = fs.readFileSync(pathToSettingsJson).toString();
    try {
      const json = JSON.parse(settingsRaw) as SettingsMap;
      this.logger.log("Loaded JSON settings successfully");
      return json;
    } catch (e) {
      this.logger.log("Settings JSON malformed");
      throw e;
    }
  }

  private watchJsonFile() {
    return fs.watch(
      pathToSettingsJson,
      debounce(() => {
        this.logger.log("JSON settings file was updated, applying new configuration");
        this.json = this.loadJsonFile();
        this.eventEmitter.emit("changed");
      }, 500),
    );
  }

  private saveJsonFile() {
    this.watcher.close();
    fs.writeFileSync(pathToSettingsJson, JSON.stringify(this.json, null, 2));
    this.logger.log("Saved JSON settings file successfully");
    this.watcher = this.watchJsonFile();
  }

  private applySettings() {
    if (this.json.startup) {
      if (!this.startupManager.existsShortcut()) {
        this.startupManager.createShortcut();
      }
    } else {
      if (this.startupManager.existsShortcut()) {
        this.startupManager.deleteShortcut();
      }
    }
  }
}
