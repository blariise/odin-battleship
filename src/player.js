import Gameboard from "./gameboard.js";

export default class Player {
  gameboard;
  type;
  
  constructor(type) { // bot or human
    this.gameboard = new Gameboard();
    this.type = type;
  }
}
