import dialog from "node-native-dialog";
import "reflect-metadata";
import { Container } from "typedi";

import { LittleBigMouseManager } from "./managers/LittleBigMouseManager";
import { instancesRunning } from "./utils/ProcessesUtils";

if (instancesRunning("LBMM.exe") > 1) {
  dialog.show({
    title: "Already running",
    msg: "LBMM is already running",
    buttons: dialog.OK,
    defaultButton: dialog.RIGHT,
  });
} else {
  Container.get(LittleBigMouseManager);
}
