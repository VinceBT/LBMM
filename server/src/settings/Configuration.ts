import { Service } from "typedi";

@Service()
export class Configuration {
  public get environment() {
    return process.env.NODE_ENV || "production";
  }

  public isProduction() {
    return this.environment === "production";
  }

  public isDevelopment() {
    return this.environment === "development";
  }
}
