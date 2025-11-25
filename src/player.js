import Gameboard from "./gameboard.js";

export default class Player {
  gameboard;
  
  constructor() {
    this.gameboard = new Gameboard();
    this.gameboard.populateBoard();
  }
}
