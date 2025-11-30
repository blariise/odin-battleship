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
    this.generateShipsLayout();
  }

  addShip(ship, x, y, direction) {
    if (!this.#checkIfLegalPositionsOfShip(ship, x, y, direction)) {
      return false;
    }

    let start;
    let endCell;
    switch (direction) {
      case "vertical":
        start = y; // [x][i]
        endCell = start + ship.length - 1;
        break;
      case "horizontal":
        start = x; // [i][y]
        endCell = start + ship.length - 1;
        break;
    }

    const positions = new Array();
    let position;
    for (let i = start; i <= endCell; ++i) {
      const cell = (direction === "horizontal") ? this.board[i][y] : this.board[x][i];
      position = (direction === "horizontal") ? [i, y] : [x, i];
      cell.value = "ship"
      cell.ship = ship;
      positions.push(position);
    }
    const borderPositions = this.#getBorderPositions(positions, direction);
    this.#ships.push({ship, positions, borderPositions, direction});
    this.#setPositionsValueOnBoard(borderPositions, "border");
    return true;
  }

  generateShipsLayout() {
    const objShips = this.#generateShips();
    const ships = Object.values(objShips); 
    this.clearBoard();
    for (const ship of ships) {
      while (true) {
        const x = getRandomInt(9);
        const y = getRandomInt(9);
        const direction = getRandomInt(2) === 0 ? "vertical" : "horizontal";
        if (this.addShip(ship, x, y, direction)) {
          break;
        }
      }
    }
  }

  receiveAttack(x, y) {
    const cell = this.board[x][y];
    switch(cell.value) {
      case "ship": {
        cell.value = "hit";
        cell.ship.hit();
        if (cell.ship.sunk) {
          const ship = this.#getShip(cell.ship);
          this.#setPositionsValueOnBoard(ship.borderPositions, "miss");
        }
        if (this.isGameOver()) {
          return "game-over";
        }
        return "hit";
      }
      case "clear":
      case "border": {
        cell.value = "miss";
        return "miss";
      }
      default:
        return null;
    }
    return null;
  }

  isGameOver() {
    for (const ship of this.#ships) {
      if (!ship.ship.sunk) {
        return false;
      }
    }
    return true;
  }

  getShips() {
    return this.#ships;
  }

  clearBoard() {
    this.board = this.#initBoard();
    this.#ships = [];
  }

  #getShip(cellShip) {
    for (const ship of this.#ships) {
      if (cellShip === ship.ship) {
        return ship;
      }
    }
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

  #getBorderPositions(shipPositions, direction) {
    if (!shipPositions) {
      return false;
    }
    const outPositions = new Array();
    for (let j = 0; j < shipPositions.length; ++j) {
      const x = shipPositions[j][0];
      const y = shipPositions[j][1];
      const left = x - 1;
      const right = x + 1;
      const down = y - 1;
      const up = y + 1;

      if (direction === "vertical") {
        if (this.#isPositionValid(left, y)) {
          outPositions.push([left, y]);
        }
        if (this.#isPositionValid(right, y)) {
          outPositions.push([right, y]);
        }
      }
      if (direction === "horizontal") {
        if (this.#isPositionValid(x, down)) {
          outPositions.push([x, down]);
        }
        if (this.#isPositionValid(x, up)) {
          outPositions.push([x, up]);
        }
      }
    }

    const sidePositions = this.#getBorderPositionsWithCorners(shipPositions, direction);
    return outPositions.concat(sidePositions);
  }

  #getBorderPositionsWithCorners(positions, direction) {
    const startX = positions[0][0];
    const startY = positions[0][1];
    const endX = positions[positions.length-1][0];
    const endY = positions[positions.length-1][1];
    const outPositions = new Array();

    switch (direction) {

      case "horizontal": {
        let x = startX -1;
        let y = startY;
        let i = 0;
        while (i < 2) {
          if (i === 1) {
            x = endX + 1;
            y = endY;
          }
          for (let j = y-1; j < y + 2; ++j) {
            if(this.#isPositionValid(x, j)) {
              outPositions.push([x, j])
            }
          }
          ++i;
        }
        return outPositions;
      }
      case "vertical": {
        let x = startX;
        let y = startY - 1;
        let i = 0;
        while (i < 2) {
          if (i === 1) {
            x = endX;
            y = endY + 1;
          }
          for (let i = x-1; i < x + 2; ++i) {
            if(this.#isPositionValid(i, y)) {
              outPositions.push([i, y]);
            }
          }
          ++i;
        }
      return outPositions;
      }
      default:
        break;
    }
    return null;
  }

  #setPositionsValueOnBoard(positions, value) {
    for (let pos of positions) {
      let x = pos[0];
      let y = pos[1];
      this.board[x][y].value = value;
    }
  }

  #checkIfLegalPositionsOfShip(ship, x, y, direction) {
    if (!this.#isPositionValid(x, y)) {
      return false;
    }
    let start;
    let endCell;
    switch (direction) {
      case "vertical":
        start = y; // [x][i:]
        endCell = start + ship.length - 1;
        if (!this.#isPositionValid(x, endCell)) {
          return false;
        }
        break;
      case "horizontal":
        start = x; // [i][y]
        endCell = start + ship.length - 1;
        if (!this.#isPositionValid(endCell, y)) {
          return false;
        }
        break;
      default:
        return false;
    }

    if (!this.#isPositionValid(x, endCell)) {
      return false;
    }

    const positions = new Array();
    let position;
    for (let i = start; i <= endCell; ++i) {
      const cell = (direction === "horizontal") ? this.board[i][y] : this.board[x][i];
      position = (direction === "horizontal") ? [i, y] : [x, i];
      if (cell.value === "ship" || cell.value === "border") {
        return false;
      }
    }
    return true;
  }
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

class Cell {
  value;  // miss, hit, clear, ship, border
  ship;  // Ship, if cell is without a ship then null

  constructor(value, ship) {
    this.value = value;
    this.ship = ship;
  }
}

