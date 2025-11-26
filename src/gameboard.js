import Ship from "./ship.js";

export default class Gameboard {
  width;
  height;
  board;
  #ships = new Array();

  constructor(width = 10, height = 10) {
    this.width = width;
    this.height = height;
    this.board = this.#initBoard();
  }

  addShip(ship, x, y, direction) {
    if (!this.#isPositionValid(x, y)) {
      return false;
    }
    let start;
    let endCell;
    let axis;
    switch (direction) {
      case "vertical":
        start = y; // [x][i]
        axis = "y";
        endCell = start + ship.length - 1;
        if (!this.#isPositionValid(x, endCell)) {
          return false;
        }
        break;
      case "horizontal":
        start = x; // [i][y]
        axis = "x";
        endCell = start + ship.length - 1;
        if (!this.#isPositionValid(endCell, y)) {
          return false;
        }
        break;
      default:
        throw new Error("Bad direction");
    }

    if (!this.#isPositionValid(x, endCell)) {
      return false;
    }

    const positions = new Array();
    let position;
    for (let i = start; i <= endCell; ++i) {
      const cell = (axis === "x") ? this.board[i][y] : this.board[x][i];
      position = (axis === "x") ? [i, y] : [x, i];
      if (cell.value == "ship") {
        throw new Error(`Ship already placed at ${position}`);
      }
      cell.value = "ship"
      cell.ship = ship;
      positions.push(position);
    }
    const borderPositions = this.#getBorderPositions(positions);
    this.#setBorderPositionsOnBoard(borderPositions);
    this.#ships.push({ship, positions, borderPositions, direction});
    return true;
  }

  populateBoard() {
    const ships = this.#generateShips();
    this.addShip(ships.carrier,    2, 1, "horizontal");
    this.addShip(ships.battleship, 5, 3, "vertical");
    this.addShip(ships.cruiser,    1, 5, "horizontal");
    this.addShip(ships.submarine,  8, 6, "vertical");
    this.addShip(ships.destroyer,  3, 9, "horizontal");
    console.log(this.#ships);
    console.log(this.board);
  }

  receiveAttack(x, y) {
    const cell = this.board[x][y];
    switch(cell.value) {
      case "ship":
        cell.value = "hit";
        cell.ship.hit();
        if (cell.ship.sunk) {
          console.log("SUNK");
        }
        return cell.value;
      case "clear":
        cell.value = "miss";
        return cell.value;
      default:
        return null;
    }
    return null;
  }

  isGameOver() {
    for (const ship of this.#ships) {
      if (!ship.sunk)
        return false;
    }
    return true;
  }

  getShips() {
    return this.#ships;
  }

  #initBoard() {
    let board = new Array(this.height);
    for (let x = 0; x < this.height; ++x) {
      board[x] = new Array(this.width);
      for (let y = 0; y < this.width; ++y) {
        board[x][y] = new Cell("clear", null);
      }
    }
    return board;
  }

  #generateShips() {
    const carrier = new Ship(5);
    const battleship = new Ship(4);
    const cruiser = new Ship(3);
    const submarine = new Ship(3);
    const destroyer = new Ship(2);
    return {carrier, battleship, cruiser, submarine, destroyer};
  }

  #isPositionValid(x, y) {
    return !((x < 0 || x >= this.width) || (y < 0 || y >= this.height));
  }

  #getBorderPositions(shipPositions) {
    if (!shipPositions) {
      return false;
    }

    const outPositions = new Array();
    for (let i = 0; i < shipPositions.length; ++i) {
      const shipX = shipPositions[i][0];
      const shipY = shipPositions[i][1];
      if (i === 0 && this.#isPositionValid(shipX - 1, shipY)) {
        outPositions.push([shipX-1, shipY]);
      }
      if (i === shipPositions.length - 1 && this.#isPositionValid(shipX + 1, shipY)) {
        outPositions.push([shipX+1, shipY]);
      }
      
      if (this.#isPositionValid(shipX, shipY - 1)) {
        outPositions.push([shipX, shipY - 1]);
      }

      if (this.#isPositionValid(shipX, shipY + 1)) {
        outPositions.push([shipX, shipY + 1]);
      }
    }
    return outPositions;
  }

  #setBorderPositionsOnBoard(positions) {
    for (const pos of positions) {
      const x = pos[0];
      const y = pos[1];
      const cell = this.board[x][y];
      cell.value = "border";
    }
  }
}

class Cell {
  value;  // miss, hit, clear, ship, border
  ship;  // Ship, if cell is without a ship then null

  constructor(value, ship) {
    this.value = value;
    this.ship = ship;
  }
}

