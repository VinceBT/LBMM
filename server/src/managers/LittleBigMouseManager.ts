import path from "path";

import PQueue from "p-queue";
import { Service } from "typedi";

import { Configuration } from "../settings/Configuration";
import { Logger } from "../settings/Logger";
import { Settings, SettingsChangeCallback } from "../settings/Settings";
import { isRunning, runCommandSync } from "../utils/processes";

import { ActiveWindowListener, ActiveWindowListenerCallback } from "./ActiveWindowListener";
import { MainDisplayManager } from "./MainDisplayManager";
import { TrayManager } from "./TrayManager";

const RETRY_MS = 5000;

@Service()
export class LittleBigMouseManager {
  private isLBMActive = true;
  private shouldIgnoreNextCalls = false;
  private callQueue: PQueue;

  constructor(
    private logger: Logger,
    private configuration: Configuration,
    private settings: Settings,
    private trayManager: TrayManager,
    private activeWindowListener: ActiveWindowListener,
    private mainDisplayManager: MainDisplayManager,
  ) {
    logger.log(`Environment detected: ${configuration.environment}`);

    this.callQueue = new PQueue({ autoStart: false, concurrency: 1 });

    this.activeWindowListener.addListener(this.handleActiveWindowChange);
    settings.addListener(this.handleSettingsChange);

    this.checkRunning();
  }

  private isLBMRunning() {
    return isRunning(path.basename(this.settings.daemon));
  }

  private handleSettingsChange: SettingsChangeCallback = () => {
    this.logger.log("Settings changed");
  };

  private checkRunning = () => {
    const isRunning = this.isLBMRunning();
    if (isRunning) {
      this.logger.log("LBM is running, starting queue");
      this.callQueue.start();
    } else {
      this.logger.log(`LBM is not running, retrying in ${(RETRY_MS / 1e3).toFixed(1)}s...`);
      setTimeout(this.checkRunning, RETRY_MS);
    }
  };

  private handleActiveWindowChange: ActiveWindowListenerCallback = (activeWindow) => {
    if (activeWindow) {
      const activeWindowName = activeWindow.window.path || "Transitioning between windows";
      this.mainDisplayManager.sendEvent("window", activeWindow);
      this.logger.log(
        `Focused window (blacklisted=${activeWindow.isBlacklisted ? "true" : "false"}): ${activeWindowName}`,
      );
    }
    this.callQueue.clear();
    if (activeWindow && !activeWindow.isBlacklisted) {
      this.callQueue.add(async () => await this.turnOnLBM());
    } else {
      this.callQueue.add(async () => await this.turnOffLBM());
    }
  };

  private async changeLBMStatus(active: boolean) {
    if (this.isLBMRunning()) {
      runCommandSync(this.settings.daemon, [active ? "--start" : "--stop"]);
      if (active) {
        this.logger.log("LBM switched on");
      } else {
        this.logger.log("LBM switched off");
      }
    } else {
      this.callQueue.pause();
      this.checkRunning();
    }
  }

  private async turnOnLBM() {
    if (this.isLBMActive) {
      if (!this.shouldIgnoreNextCalls) {
        this.logger.log("LBM is already on, skipping and next logs will be muted...");
        this.shouldIgnoreNextCalls = true;
      }
    } else {
      this.shouldIgnoreNextCalls = false;
      this.isLBMActive = true;
      await this.changeLBMStatus(true);
    }
  }

  private async turnOffLBM() {
    if (!this.isLBMActive) {
      if (!this.shouldIgnoreNextCalls) {
        this.logger.log("LBM is already off, skipping and next logs will be muted...");
        this.shouldIgnoreNextCalls = true;
      }
    } else {
      this.shouldIgnoreNextCalls = false;
      this.isLBMActive = false;
      await this.changeLBMStatus(false);
    }
  }
}
