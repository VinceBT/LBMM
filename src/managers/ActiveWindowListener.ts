import { EventEmitter } from "events";

import { exiftool, Tags } from "exiftool-vendored";
import { Window, windowManager } from "node-window-manager";
import { Service } from "typedi";

import { Settings } from "../settings/Settings";

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

interface ActiveWindow {
  window: Window;
  isWatched: boolean;
}

@Service()
export class ActiveWindowListener {
  public eventEmitter = new EventEmitter.EventEmitter();
  private activeWindow?: ActiveWindow = undefined;
  private timeoutId?: NodeJS.Timeout = undefined;

  constructor(private settings: Settings) {
    this.timeoutId = setTimeout(() => this.loop());
  }

  clear() {
    this.eventEmitter.removeAllListeners("changed");
    this.stopLoop();
  }

  stopLoop() {
    if (this.timeoutId) clearTimeout(this.timeoutId);
  }

  addListener(cb: (activeWindow?: ActiveWindow) => void) {
    this.eventEmitter.on("changed", (activeWindow: ActiveWindow) => {
      cb(activeWindow);
    });
  }

  private loop() {
    const currentActiveWindow = windowManager.getActiveWindow();
    const isActiveWatched = this.settings.blacklist.some((window) => currentActiveWindow.path.indexOf(window, currentActiveWindow.path.length - window.length) != -1);

    if (!this.activeWindow || this.activeWindow.window.processId !== currentActiveWindow.processId) {
      this.activeWindow = {
        window: currentActiveWindow,
        isWatched: isActiveWatched,
      };
      this.eventEmitter.emit("changed", this.activeWindow);
    }

    this.timeoutId = setTimeout(() => this.loop(), this.settings.interval);
  }
}
