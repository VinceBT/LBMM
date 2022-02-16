import { EventEmitter } from "events";

import { exiftool, Tags } from "exiftool-vendored";
import { Window, windowManager } from "node-window-manager";
import { Service } from "typedi";

import { Settings } from "../settings/Settings";
import { ActiveWindow } from "../types/Common";

declare module "node-window-manager" {
  interface Window {
    getExif(): Promise<Tags> | undefined;
  }
}

declare module "exiftool-vendored" {
  interface Tags {
    FileDescription: string | undefined;
  }
}

Window.prototype.getExif = function () {
  return exiftool.read(this.path);
};

export type ActiveWindowListenerCallback = (activeWindow?: ActiveWindow) => void;

@Service()
export class ActiveWindowListener {
  public eventEmitter = new EventEmitter.EventEmitter();
  private activeWindow?: ActiveWindow = undefined;
  private timeoutId?: NodeJS.Timeout = undefined;

  constructor(private settings: Settings) {
    this.timeoutId = setTimeout(() => this.loop());
  }

  addListener(cb: ActiveWindowListenerCallback) {
    this.eventEmitter.on("changed", cb);
  }

  removeAllListeners() {
    this.eventEmitter.removeAllListeners("changed");
  }

  private loop() {
    const currentActiveWindow = windowManager.getActiveWindow();
    const isActiveBlacklisted = this.settings.blacklist.some(
      (window) => currentActiveWindow.path.indexOf(window, currentActiveWindow.path.length - window.length) != -1,
    );

    if (!this.activeWindow || this.activeWindow.window.processId !== currentActiveWindow.processId) {
      this.activeWindow = {
        window: currentActiveWindow,
        isBlacklisted: isActiveBlacklisted,
      };
      this.eventEmitter.emit("changed", this.activeWindow);
    }

    this.timeoutId = setTimeout(() => this.loop(), this.settings.interval);
  }
}
