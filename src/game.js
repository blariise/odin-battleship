import Player from "./player.js";

export default class Game {
  players;
  activePlayer;
  isGameOver;

  constructor() {
    this.players.push(new Player());
    this.players.push(new Player());
    this.activePlayer = this.players[0];
    this.isGameOver = false;
  }

  cycle(x, y) {
    const players = this.players;
    const secondPlayer = (activePlayer === players[0]) ? players[1] : players[0];

    if (!enemyPlayer.gameboard.receiveAttack(x, y)) {
      return;
    }
    if (enemyPlayer.gameboard.isGameOver()) {
      this.isGameOver = true;
      console.log(`Game over ${activePlayer} won!`);
      return; 
    }
    activePlayer = secondPlayer;
  }
}
