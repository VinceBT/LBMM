import "reflect-metadata";
import { Container } from "typedi";

import { LittleBigMouseManager } from "./managers/LittleBigMouseManager";

Container.get(LittleBigMouseManager);
