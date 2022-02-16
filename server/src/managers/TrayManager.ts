import os from "os";
import path from "path";

import SysTray, { MenuItem } from "systray2";
import { Service } from "typedi";

import { I18n } from "../settings/I18n";
import { Logger, pathToLogs } from "../settings/Logger";
import { pathToSettingsJson, Settings } from "../settings/Settings";
import { runCommandSync } from "../utils/processes";

import { MainDisplayManager } from "./MainDisplayManager";

declare module "systray2" {
  export interface MenuItem {
    click?: () => void;
  }
}

@Service()
export class TrayManager {
  private systray: SysTray;

  constructor(
    private i18n: I18n,
    private settings: Settings,
    private logger: Logger,
    private mainDisplayManager: MainDisplayManager,
  ) {
    this.systray = new SysTray({
      menu: {
        icon: path.join(process.cwd(), "assets", os.platform() === "win32" ? "iconset.ico" : "image.png"),
        isTemplateIcon: os.platform() === "darwin",
        title: "LBMM",
        tooltip: "LBMM - Little Big Mouse Manager",
        items: [
          this.openDebugger,
          SysTray.separator,
          this.openLocation,
          this.openSettings,
          this.openLogs,
          SysTray.separator,
          this.startWithWindows,
          SysTray.separator,
          this.itemExit,
        ],
      },
      debug: false,
      copyDir: false,
    });

    this.systray.onClick((clickEvent) => {
      if (clickEvent.item.click != null) {
        clickEvent.item.click();
      }
    });

    this.systray
      .ready()
      .then(() => {
        this.logger.log("Systray started!");
      })
      .catch((err) => {
        this.logger.log("Systray failed to start: " + err.message);
      });
  }

  private openDebugger: MenuItem = {
    title: this.i18n.t("tray.debugger.title"),
    tooltip: this.i18n.t("tray.debugger.title"),
    click: () => {
      this.mainDisplayManager.openWindow();
    },
  };

  private openLocation: MenuItem = {
    title: this.i18n.t("tray.location.title"),
    tooltip: this.i18n.t("tray.location.title"),
    click: () => {
      try {
        runCommandSync("explorer", [process.cwd()]);
      } catch (e) {}
    },
  };

  private openSettings: MenuItem = {
    title: this.i18n.t("tray.settings.title"),
    tooltip: this.i18n.t("tray.settings.title"),
    click: () => {
      try {
        runCommandSync("start", [pathToSettingsJson]);
      } catch (e) {}
    },
  };

  private openLogs: MenuItem = {
    title: this.i18n.t("tray.logs.title"),
    tooltip: this.i18n.t("tray.logs.title"),
    click: () => {
      try {
        runCommandSync("start", [pathToLogs]);
      } catch (e) {}
    },
  };

  private startWithWindows: MenuItem = {
    title: this.i18n.t("tray.startup.title"),
    tooltip: this.i18n.t("tray.startup.title"),
    checked: this.settings.startup,
    click: () => {
      this.settings.startup = !this.settings.startup;
      this.startWithWindows.checked = this.settings.startup;
      this.systray.sendAction({
        type: "update-item",
        item: this.startWithWindows,
      });
    },
  };

  private itemExit: MenuItem = {
    title: this.i18n.t("tray.exit.title"),
    tooltip: this.i18n.t("tray.exit.tooltip"),
    click: () => {
      this.systray.kill(true);
    },
  };
}
