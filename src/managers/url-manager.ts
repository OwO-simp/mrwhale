import { Message, Content, Game, GameOverview } from "@mrwhale-io/gamejolt";

import { BotClient } from "../bot-client";
import { ListenerDecorators } from "../util/listener-decorators";
import { truncate } from "../util/truncate";

const { on, registerListeners } = ListenerDecorators;

/**
 * Format Game Jolt game data for displaying in chat
 * @param game Game Jolt game.
 * @param overview Game Jolt game overview.
 */
function formatGameInfo(game: Game, overview: GameOverview): string {
  if (!game || !game.developer || !overview) {
    return;
  }

  const max = 25;
  const data = {
    title: truncate(max, game.title),
    author: truncate(max, game.developer.display_name),
    follow: game.follower_count || 0,
    category: game.category,
    views: overview.profileCount,
    plays: overview.downloadCount + overview.playCount,
  };

  return `${data.title} By ${data.author} - Followers: ${data.follow}, Views: ${data.views}`;
}

/**
 * Dispatches content information about various URLs posted in chat
 */
export class UrlManager {
  constructor(private client: BotClient) {
    registerListeners(this.client, this);
  }

  @on("message")
  private async onMessage(message: Message): Promise<void> {
    const content = new Content();
    const gameregex = /(http:|https:)?\/\/(www\.)?(gamejolt.com)\/(games)\/[^/]+\/(\d+)/;

    // Check if this is a Game Jolt game url.
    if (message.toString().match(gameregex)) {
      const matches: RegExpExecArray = gameregex.exec(message.toString());
      if (matches) {
        const gameId = parseInt(matches[matches.length - 1], 10);
        const gameResult = await this.client.api.getGame(gameId);
        const overviewResult = await this.client.api.getGameOverview(gameId);
        const gameResponse = formatGameInfo(
          new Game(gameResult),
          new GameOverview(overviewResult)
        );
        if (gameResponse) {
          content.insertText(gameResponse);

          this.client.chat.sendMessage(content.contentJson(), message.room_id);
        }
      }
    }
  }
}
