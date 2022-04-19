import path from "path";

import PQueue from "p-queue";
import { Service } from "typedi";

import { Configuration } from "../settings/Configuration";
import { Logger } from "../settings/Logger";
import { Settings, SettingsChangeCallback } from "../settings/Settings";
import { sleep } from "../utils/JavascriptUtils";
import { isRunning, runCommandSync } from "../utils/ProcessesUtils";

import { ActiveWindowListener, ActiveWindowListenerCallback } from "./ActiveWindowListener";
import { MainDisplayManager } from "./MainDisplayManager";
import { TrayManager } from "./TrayManager";

const RETRY_MS = 5000;

@Service()
export class LittleBigMouseManager {
  private isLBMActive = true;
  private shouldIgnoreNextCalls = false;
  private callQueue: PQueue;
  private canceller?: () => boolean;

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
    const hasCancelled = this.canceller?.(); // Cancel any pending promises
    this.callQueue.clear(); // Reduce queue to 0
    if (!hasCancelled) {
      if (activeWindow && !activeWindow.isBlacklisted) {
        this.callQueue.add(async () => await this.updateLBMStatus(true));
      } else {
        this.callQueue.add(async () => await this.updateLBMStatus(false));
      }
    }
  };

  private async updateLBMStatus(nextActive: boolean) {
    if (this.isLBMActive === nextActive) {
      if (!this.shouldIgnoreNextCalls) {
        this.logger.log(`LBM is already ${nextActive ? "on" : "off"}, skipping and next logs will be muted...`);
        this.shouldIgnoreNextCalls = true;
      }
    } else {
      this.shouldIgnoreNextCalls = false;
      if (this.isLBMRunning()) {
        if (nextActive) {
          try {
            this.logger.log(`Waiting ${this.settings.debounce} to turn on`);
            await sleep(this.settings.debounce, (cancel) => (this.canceller = cancel));
            runCommandSync(this.settings.daemon, ["--start"]);
            this.isLBMActive = true;
            this.logger.log(`LBM switched on`);
          } catch (e) {
            this.logger.log(`Cancelling switch-on due to debounce`);
          }
        } else {
          try {
            this.logger.log(`Waiting ${this.settings.debounce} to turn off`);
            await sleep(this.settings.debounce, (cancel) => (this.canceller = cancel));
            runCommandSync(this.settings.daemon, ["--stop"]);
            this.isLBMActive = false;
            this.logger.log(`LBM switched off`);
          } catch (e) {
            this.logger.log(`Cancelling switch-off due to debounce`);
          }
        }
      } else {
        this.callQueue.pause();
        this.checkRunning();
      }
    }
  }
}
