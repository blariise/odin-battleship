import Player from "./player.js";

export default class Battleship {
  players = new Array(2);
  isGameOver;
  playerToHit;
  playAgainstBot;

  constructor(playAgainstBot = true) {
    this.playAgainstBot = playAgainstBot;
    this.players[0] = new Player("human");
    this.players[1] = playAgainstBot ? new Player("bot") : new Player("human");
    this.isGameOver = false;
    this.playerToHit = this.players[0];
  }

  botTurn() {
    const board = this.players[0].gameboard.board;
    let result;
    while(true) {
      const x = getRandomInt(10);
      const y = getRandomInt(10);
      const cellValue = board[x][y].value;
      switch (cellValue) {
        case "clear":
        case "ship":
          return this.players[0].gameboard.receiveAttack(x, y);
        default:
          break;
      }
    }
    return null;
  }

  #getSecondPlayer() {
    return this.playerToHit === this.players[0] ? this.players[1] : this.players[0];
  }
  
  resetGame() {
    for (const player of this.players) {
      player.gameboard.clearBoard();
      player.gameboard.generateShipsLayout();
    }
  }
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

