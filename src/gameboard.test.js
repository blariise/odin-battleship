import Gameboard from "./gameboard.js";
import Ship from "./ship.js";

describe("Gameboard class", () => {
  test("initBoard()", () => {
    const gameboard = new Gameboard(10, 10);
    expect(gameboard.board.length).toBe(10);
    expect(gameboard.board[9].length).toBe(10);
  });

  test("addShip()", () => {
    const gameboard = new Gameboard();
    const carrier = new Ship(5);
    gameboard.addShip(carrier, 0, 0, "vertical");
    expect(gameboard.board[0][0].value).toBe(1);
    expect(gameboard.board[0][1].value).toBe(1);
    expect(gameboard.board[0][2].value).toBe(1);
    expect(gameboard.board[0][3].value).toBe(1);
    expect(gameboard.board[0][4].value).toBe(1);

    const battleship = new Ship(4);
    gameboard.addShip(battleship, 2, 6, "horizontal");
    expect(gameboard.board[2][6].value).toBe(1);
    expect(gameboard.board[3][6].value).toBe(1);
    expect(gameboard.board[4][6].value).toBe(1);
    expect(gameboard.board[5][6].value).toBe(1);
    
    expect(() => {
      gameboard.addShip(battleship, 7, 8, "horizontal");
    }).toThrow("Ship out of bound");

    expect(() => {
      gameboard.addShip(battleship, 0, 2, "horizontal");
    }).toThrow('Ship already placed at');
  });

  test("receiveAttack()", () => {
    const gameboard = new Gameboard();
    const carrier = new Ship(5);
    gameboard.addShip(carrier, 0, 0, "vertical");
    expect(gameboard.receiveAttack(0, 0)).toBeTruthy();
    expect(gameboard.receiveAttack(1, 0)).toBeFalsy();
  });
});

