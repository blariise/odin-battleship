import Ship from "./ship.js";

export default class Gameboard {
  width;
  height;
  board;
  #ships;

  constructor(width = 10, height = 10) {
    this.width = width;
    this.height = height;
    this.board = this.#initBoard();
    this.#ships = this.#generateShips();
  }

  #initBoard() {
    let board = new Array(this.height);
    for (let x = 0; x < this.height; ++x) {
      board[x] = new Array(this.width);
      for (let y = 0; y < this.width; ++y) {
        board[x][y] = new Cell(0, null);
      }
    }
    return board;
  }

  addShip(ship, x, y, direction) {
    if (this.#checkCordinates()) {
      switch(direction) {
        case "vertical":
          this.#addShipVertical(ship, x, y);
          break;
        case "horizontal":
          this.#addShipHorizontal(ship, x, y);
          break;
        defualt:
          throw new Error("Bad direction");
      }
    }
  }

  #addShipVertical(ship, x, y) {
    const end_cell = ship.length + y - 1;
    if (end_cell >= this.height) {
      throw new Error("Ship out of bound");
    }
    for (let i = y; i <= end_cell; ++i) {
      const cell = this.board[x][i];
      if (cell.value == 1) {
        throw new Error(`Ship already placed at (${x},${i})`);
      }
      cell.value = 1;
      cell.owner = ship;
    }
  }

  #addShipHorizontal(ship, x, y) {
    const end_cell = ship.length + x - 1;
    if (end_cell >= this.width) {
      throw new Error("Ship out of bound");
    }
    for (let i = x; i <= end_cell; ++i) {
      const cell = this.board[i][y];
      if (cell.value == 1) {
        throw new Error(`Ship already placed at (${i},${y})`);
      }
      cell.value = 1;
      cell.owner = ship;
    }
  }

  receiveAttack(x, y) {
    if (this.#checkCordinates()) {
      const cell = this.board[x][y];
      if (cell.value) {
        cell.value = -1;
        cell.owner.hit();
        console.log(this.#doesGameEnd());
        return true;
      } else {
        cell.value = -2;
      }
    }
    return false;
  }

  #checkCordinates(x, y) {
    if ((x < 0 || x >= this.width) && (y < 0 || y >= this.height)) {
      throw new Error("Cordinates are out of bound");
    }
    return true;
  }

  #doesGameEnd() {
    for (const ship of this.#ships) {
      if (!ship.sunk)
        return false;
    }
    return true;
  }

  populateBoard() {
    const ships = this.#ships;
    this.addShip(ships.carrier,    2, 1, "horizontal");
    this.addShip(ships.battleship, 5, 3, "vertical");
    this.addShip(ships.cruiser,    1, 5, "horizontal");
    this.addShip(ships.submarine,  8, 6, "vertical");
    this.addShip(ships.destroyer,  3, 9, "horizontal");
  }

  #generateShips() {
    const carrier = new Ship(5);
    const battleship = new Ship(4);
    const cruiser = new Ship(3);
    const submarine = new Ship(3);
    const destroyer = new Ship(2);
    return {carrier, battleship, cruiser, submarine, destroyer};
  }

}

class Cell {
  value;  // -2: missed attack, -1: hit, 0: clear, 1: ship
  owner;  // Ship, if cell is without a ship then null

  constructor(value, owner) {
    this.value = value;
    this.owner = owner;
  }
}

