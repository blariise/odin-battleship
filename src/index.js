import "./styles.css";
import Player from "./player.js";

const player1 = new Player();
const player2 = new Player();
initGame();

function initGame() {
  const boardsDiv = document.querySelector(".boards");
  boardsDiv.addEventListener("click", (e) => {
    if (e.target.className == "cell") {
      const player = e.target.parentElement.parentElement.parentElement.classList[0];
      const x = e.target.dataset.x;
      const y = e.target.dataset.y;
    }
  });
  
  const player1BoardDiv = document.querySelector(".player1.board");
  const player2BoardDiv = document.querySelector(".player2.board");
  renderBoard(player1, player1BoardDiv);
  renderBoard(player2, player2BoardDiv);
}

function renderBoard(player, destDiv) {
  const boardTable = createBoardDOM();
  destDiv.appendChild(boardTable);
}

function createBoardDOM() {
  console.log();
  const table = document.createElement("table");
  for (let y = 0; y < 10; ++y) {
    const tr = document.createElement("tr");
    tr.className = "board-row";
    for (let x = 0; x < 10; ++x) {
      const td = document.createElement("td");
      td.className = "cell";
      td.dataset.x = x;
      td.dataset.y = y;
      tr.appendChild(td);
    }
    table.appendChild(tr);
  }
  return table;
}

