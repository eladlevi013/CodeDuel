import accountSchema from '../models/Account';
import { Player, LoggedInPlayer } from '../models/Room';

export const isLoggedinPlayer = (player: Player): player is LoggedInPlayer => {
  return (player as LoggedInPlayer).uid !== undefined;
};

export const updateWinnerPlayerScore = async (player: Player) => {
  // player not logged in
  if (!isLoggedinPlayer(player)) {
    return null;
  }

  let scoreToAdd = player.score == 0 ? 1 : 2;
  console.log(`Adding ${scoreToAdd} coins to ${player.username}🪙`);

  // updating player score
  try {
    const account = await accountSchema.findById(player.uid);

    if (!account) {
      console.error(`Account not found for uid: ${player.uid}`);
      return null;
    }

    account.score += scoreToAdd;
    await account.save();

    return account.score;
  } catch (error) {
    console.error('Error updating player score:', error);

    return null;
  }
};

export const updatePlayersScoreOnTie = async (players: Player[]) => {
  for (let player of players) {
    if (isLoggedinPlayer(player)) {
      try {
        const account = await accountSchema.findById(player.uid);

        if (!account) {
          console.error(`Account not found for uid: ${player.uid}`);
          return null;
        }

        account.score += 1;
        console.log(`Return coins on tie for ${player.username}👌`);

        await account.save();
      } catch (error) {
        console.error('Error updating player score:', error);
        return null;
      }
    }
  }
};

export const updatePariticipantScore = async (player: Player) => {
  const loggedInPlayer = player as LoggedInPlayer;

  if (loggedInPlayer && loggedInPlayer.uid !== null) {
    try {
      const account = await accountSchema.findById(loggedInPlayer.uid);

      if (account) {
        if (account.score > 0) {
          account.score -= 1;
          await account.save();
          console.log(`Taking 1 coin - ${loggedInPlayer.username} started a battle🏁`);
        }
      }
    } catch (err) {
      console.log(err);
    }
  }
};
