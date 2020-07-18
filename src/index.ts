import mineflayer from "mineflayer";
import config from "../conf/bot.json";

const bot = mineflayer.createBot(config.connection);

function test() {
  bot.chat("test");
}

bot.on("spawn", test);
