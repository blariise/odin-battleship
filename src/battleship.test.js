import Battleship from "./battleship.js";

describe("Battleship class", () => {
  test("constructor", () => {
    const battleship = new Battleship(false);
    battleship.players.forEach((player) => {
      expect(player.type).toBe("human");
    });

    const battleship2 = new Battleship();
    expect(battleship2.players[0].type).toBe("human");
    expect(battleship2.players[1].type).toBe("bot");

    const battleship3 = new Battleship(true);
    expect(battleship3.players[0].type).toBe("human");
    expect(battleship3.players[1].type).toBe("bot");
  });

  test("playerTurn(x, y)", () => {
    const battleship = new Battleship();
    battleship.playerTurn(0, 0);
    expect(battleship.players[1].gameboard.board[0][0].value).toBe("miss");
    expect(battleship.playerToHit).toBe(battleship.players[1]);

    const battleship2 = new Battleship();
    battleship2.playerTurn(2, 1);
    expect(battleship2.players[1].gameboard.board[2][1].value).toBe("hit");
    expect(battleship2.playerToHit).toBe(battleship2.players[0]);
  });
});
