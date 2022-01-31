import { Window, windowManager } from "node-window-manager";
import { EventEmitter } from "events";
import { exiftool, Tags } from "exiftool-vendored";
import {Configuration} from "./Configuration";

declare module "node-window-manager" {
  interface Window {
    getExif(): Promise<Tags> | undefined;
  }
}

declare module "exiftool-vendored" {
  interface Tags {
    FileDescription: String | undefined;
  }
}

Window.prototype.getExif = function () {
  return exiftool.read(this.path);
};

interface ActiveWindow {
  window: Window;
  isWatched: boolean;
}

export class ActiveWindowListener {
  public eventEmitter = new EventEmitter.EventEmitter();
  private activeWindow?: ActiveWindow = undefined;
  private timeoutId?: NodeJS.Timeout = undefined;

  constructor(
    private watchedWindowNames: string[],
    private interval = Configuration.Settings.interval,
  ) {
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
    const isActiveWatched = this.watchedWindowNames.some(
      (window) =>
        currentActiveWindow.path.indexOf(
          window,
          currentActiveWindow.path.length - window.length,
        ) != -1,
    );

    if (
      !this.activeWindow ||
      this.activeWindow.window.processId !== currentActiveWindow.processId
    ) {
      this.activeWindow = {
        window: currentActiveWindow,
        isWatched: isActiveWatched,
      };
      this.eventEmitter.emit("changed", this.activeWindow);
    }

    this.timeoutId = setTimeout(() => this.loop(), this.interval);
  }
}
