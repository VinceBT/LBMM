import i18next from "i18next";
import { Service } from "typedi";

@Service()
export class I18n {
  constructor() {
    i18next.init({
      lng: "en",
      debug: false,
      resources: {
        en: {
          translation: require("../../locales/en-US.json"),
        },
      },
    });
  }

  public t = i18next.t;
}
