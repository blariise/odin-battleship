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
    this.#checkCordinates(x, y);
    let start;
    let endCell;
    let axis;
    switch (direction) {
      case "vertical":
        start = y; // [x][i]
        axis = "y";
        endCell = start + ship.length - 1;
        this.#checkCordinates(x, endCell); // if cordinates are bad, throw error
        break;
      case "horizontal":
        start = x; // [i][y]
        axis = "x";
        endCell = start + ship.length - 1;
        this.#checkCordinates(endCell, y); // if cordinates are bad, throw error
        break;
      default:
        throw new Error("Bad direction");
    }

    for (let i = start; i <= endCell; ++i) {
      const cell = (axis === "x") ? this.board[i][y] : this.board[x][i];
      const cords = (axis === "x") ? `(${i}, ${y})` : `(${x}, ${i})`;
      if (cell.value == "ship") {
        throw new Error(`Ship already placed at ${cords}`);
      }
      cell.value = "ship"
      cell.ship = ship;
    }
    this.#ships.push({ship, x, y, direction});
    return true;
  }

  populateBoard() {
    const ships = this.#generateShips();
    this.addShip(ships.carrier,    2, 1, "horizontal");
    this.addShip(ships.battleship, 5, 3, "vertical");
    this.addShip(ships.cruiser,    1, 5, "horizontal");
    this.addShip(ships.submarine,  8, 6, "vertical");
    this.addShip(ships.destroyer,  3, 9, "horizontal");
  }

  receiveAttack(x, y) {
    const cell = this.board[x][y];
    switch(cell.value) {
      case "ship":
        cell.value = "hit";
        cell.ship.hit();
        return true;
      case "clear":
        cell.value = "miss";
        return true;
      default:
        return false;
    }
    return false;
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

  #checkCordinates(x, y) {
    if ((x < 0 || x >= this.width) || (y < 0 || y >= this.height)) {
      throw new Error("Cordinates are out of bound");
    }
    return true;
  }

  printBoard() {
    let i = 0;
    let line = "";
    for (let i = -1; i < 10; ++i) {
      if (i === -1) {
        line += `---`;
      } else {
        line += `y${i} `;
      }
      for (let j = -1; j < 10; ++j) {
        if (i === -1) {
          if (j !== -1) {
            line += `x${j} `;
          }
        } else if (j !== -1) {
          const val = this.board[i][j].value[0];
          line += `${val}  `;
        }
      }
      line += '\n';
    }
    console.log(line);
  }
}

class Cell {
  value;  // miss, hit, clear, ship
  ship;  // Ship, if cell is without a ship then null

  constructor(value, ship) {
    this.value = value;
    this.ship = ship;
  }
}

