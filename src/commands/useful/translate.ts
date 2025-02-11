import * as translate from "translate-google";
import { Message } from "@mrwhale-io/gamejolt";

import { Command } from "../command";
import { truncate } from "../../util/truncate";

export default class extends Command {
  constructor() {
    super({
      name: "translate",
      description:
        "Translate to specified language. Use langs command for supported languages.",
      type: "useful",
      usage: "<prefix>translate <lang>, <text>",
      examples: ["<prefix>translate es, Hello", "<prefix>translate auto, Hola"],
      cooldown: 3000,
    });
  }

  async action(
    message: Message,
    [lang, ...text]: [string, string[]]
  ): Promise<void> {
    const toTranslate = text.join();

    if (!toTranslate) {
      return message.reply("Please pass some text to translate.");
    }

    translate(toTranslate, { to: lang || "en" })
      .then((response) => {
        const max = 980;

        return message.reply(truncate(max, response));
      })
      .catch(() => {
        return message.reply(
          "Couldn't find specified language. Use lang command for available languages."
        );
      });
  }
}
