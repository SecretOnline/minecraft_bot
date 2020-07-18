import mineflayer from "mineflayer";
import pathfinderModule, {
  Movements,
  Pathfinder,
  goals,
} from "mineflayer-pathfinder";
import config from "../conf/bot.json";
import minecraftData from "minecraft-data";

const { GoalNear } = goals;

const bot = mineflayer.createBot(config.connection);

bot.loadPlugin((pathfinderModule as any).pathfinder);

function init() {
  const mcData = minecraftData(bot.version);

  const pathfinder = (bot as any).pathfinder as Pathfinder;
  const moves = new Movements(bot, mcData);
  pathfinder.setMovements(moves);
  // Disable block breaking
  (moves as any).digCost = Infinity;

  bot.on("whisper", (username, message, translate, json, matches) => {
    const player = bot.players[username];
    if (!player) {
      bot.whisper(username, "who even are you?");
      return;
    }

    if (config.superusers.includes(username)) {
      if (message.match(/^to me$/i)) {
        if (!player.entity) {
          bot.whisper(username, "i can't even see you");
          return;
        }

        const { x, y, z } = player.entity.position;

        bot.whisper(username, `to you (${x}, ${y}, ${z})`);
        pathfinder.setGoal(new GoalNear(x, y, z, 2));
      }
    } else {
      bot.whisper(username, "go bother someone else");
      return;
    }
  });
}

bot.on("spawn", init);
