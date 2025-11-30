import "./styles.css";
import Battleship from "./battleship.js";

const battleship = new Battleship();
const player1 = battleship.players[0];
const player2 = battleship.players[1];
const player1BoardDiv = document.querySelector(".player1.board");
const player2BoardDiv = document.querySelector(".player2.board");
let playerToHit = player1;

initGame();

function initGame() {
  setVisibilityClassOnBoardDOM();
  renderBoard(player1, player1BoardDiv);
  renderBoard(player2, player2BoardDiv);
  updateCellStatusOnBoard(player1, player1BoardDiv);
  updateCellStatusOnBoard(player2, player2BoardDiv);

  const boardsDiv = document.querySelector(".boards");
  boardsDiv.addEventListener("click", async (e) => {
    if (e.target.className == "cell") {
      const enemyPlayerName = e.target.parentElement.parentElement.parentElement.classList[0];
      const x = e.target.dataset.x;
      const y = e.target.dataset.y;
      if (battleship.playAgainstBot) {
        const enemyPlayer = getPlayerByName(enemyPlayerName);
        if (playerToHit !== player1) {
          return;
        }
        await gameCycleVsBot(enemyPlayer, x, y);
      }
    }
  });
}

async function gameCycleVsBot(player, x, y) {
  if (playerToHit === player1) {
    while (playerTurn(player, x, y));
  }
  if (playerToHit.type === "bot") {
    while (await botTurn() === "hit");
  }
}

function playerTurn(attackedPlayer, x, y) {
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
      showGameOverDialog();
      break;
    default:
      return;
  }
  updateCellStatusOnBoard(attackedPlayer, getPlayerBoardDiv(attackedPlayer));
}

function botTurn() {
  return new Promise((resolve) => setTimeout(() => {
    switch(battleship.botTurn()) {
      case "miss":
        changePlayerToHit();
        resolve("miss");
        break;
      case "hit":
        resolve("hit");
        break;
      case "game-over":
        showGameOverDialog();
        resolve("hit");
        break;
      default:
        return;
    }
    updateCellStatusOnBoard(player1, player1BoardDiv);
  }, 500));
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

function getPlayerBoardDiv(player) {
  return player === player1 ? player1BoardDiv : player2BoardDiv;
}

function playAgainstBot() {
  battleship.playAgainstBot = true;
}

function playAgainstHuman() {
  battleship.playAgainstBot = false;
}

function setVisibilityClassOnBoardDOM() {
  if (player2.type === "bot") {
    player1BoardDiv.classList.add("show");
  }
}

const dialog = document.querySelector(".game-over-dialog");
const closeGameOverDialogButton = document.querySelector(".reset");

function showGameOverDialog() {
  dialog.showModal();
}
closeGameOverDialogButton.addEventListener("click", (e) => {
  battleship.resetGame();
  updateCellStatusOnBoard(player1, player1BoardDiv);
  updateCellStatusOnBoard(player2, player2BoardDiv);
  dialog.close();
});

const reloadButton = document.querySelector(".reload-board");
reloadButton.addEventListener("click", (e) => {
  battleship.resetGame();
  updateCellStatusOnBoard(player1, player1BoardDiv);
  updateCellStatusOnBoard(player2, player2BoardDiv);
});

