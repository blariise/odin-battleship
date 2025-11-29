import "./styles.css";
import Battleship from "./battleship.js";

const battleship = new Battleship(true);
const player1 = battleship.players[0];
const player2 = battleship.players[1];
const player1BoardDiv = document.querySelector(".player1.board");
const player2BoardDiv = document.querySelector(".player2.board");
let playerToHit = player1;

initGame();

function initGame() {
  const boardsDiv = document.querySelector(".boards");
  boardsDiv.addEventListener("click", (e) => {
    if (e.target.className == "cell") {
      const playerName = e.target.parentElement.parentElement.parentElement.classList[0];
      const x = e.target.dataset.x;
      const y = e.target.dataset.y;
      playerTurn(playerName, x, y);
      while (playerToHit.type === "bot") {
        botTurn();
      }
    }
  });
  renderBoard(player1, player1BoardDiv);
  renderBoard(player2, player2BoardDiv);
}

function playerTurn(playerName, x, y) {
  const attackedPlayer = getPlayerByName(playerName);
  if (attackedPlayer === playerToHit) {
    return;
  }
  switch (attackedPlayer.gameboard.receiveAttack(x, y)) {
    case "miss":
      changePlayerToHit();
      break;
    case "hit":
      break;
    case "game-over":
      break;
    default:
      return;
  }
  updateCellStatusOnBoard(attackedPlayer, getPlayerBoardDiv(playerName));
}

function botTurn() {
  switch(battleship.botTurn()) {
    case "miss":
      changePlayerToHit();
      break;
    case "hit":
      break;
    case "game-over":
      break;
    default:
      return;
  }
  updateCellStatusOnBoard(player1, player1BoardDiv);
}

function renderBoard(player, playerBoardDiv) {
  const boardTable = createBoardDOM();
  playerBoardDiv.appendChild(boardTable);
}

function updateCellStatusOnBoard(player, playerBoardDiv) {
  const rowNodes = playerBoardDiv.childNodes[0].childNodes;
  const playerBoard = player.gameboard.board;
  let x = 0;
  playerBoard.forEach((row) => {
    let y = 0;
    row.forEach((cell) => {
      const cellNodes = rowNodes[y].childNodes;
      const cellDOM = cellNodes[x];
      switch(cell.value) {
        case "ship":
          cellDOM.dataset.status = "ship";
          break;
        case "clear":
          cellDOM.dataset.status = "clear";
          break;
        case "hit":
          cellDOM.dataset.status = "hit";
          break;
        case "miss":
          cellDOM.dataset.status = "miss";
          break;
        case "border":
          cellDOM.dataset.status = "border";
          break;
        default:
          break;
      }
      ++y;
    });
    ++x;
  });
}

function createBoardDOM() {
  const table = document.createElement("table");
  for (let y = 0; y < 10; ++y) {
    const tr = document.createElement("tr");
    tr.className = "board-row";
    for (let x = 0; x < 10; ++x) {
      const td = document.createElement("td");
      td.className = "cell";
      td.dataset.x = x;
      td.dataset.y = y;
      td.dataset.status = "clear";
      tr.appendChild(td);
    }
    table.appendChild(tr);
  }
  return table;
}

function changePlayerToHit() {
  playerToHit = playerToHit === player1 ? player2 : player1;
}

function getPlayerByName(playerName) {
  return playerName === "player1" ? player1 : player2;
}

function getPlayerBoardDiv(playerName) {
  return playerName === "player1" ? player1BoardDiv : player2BoardDiv;
}

function playAgainstBot() {
  battleship.playAgainstBot = true;
}

function playAgainstHuman() {
  battleship.playAgainstBot = false;
}
