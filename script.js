const cells = Array.from(document.querySelectorAll("[data-cell]"));
const statusMessage = document.querySelector("#status");
const restartButton = document.querySelector("#restart");
const shareButton = document.querySelector("#share");

const winningLines = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

let board = Array(9).fill("");
let currentPlayer = "X";
let gameOver = false;

function finishGame(message, winningCells = []) {
  gameOver = true;
  statusMessage.textContent = message;
  winningCells.forEach((index) => cells[index].classList.add("winner"));
  cells.forEach((cell) => { cell.disabled = true; });
}

function playTurn(event) {
  const cell = event.currentTarget;
  const index = Number(cell.dataset.cell);
  if (gameOver || board[index]) return;

  board[index] = currentPlayer;
  cell.textContent = currentPlayer;
  cell.classList.add(currentPlayer === "X" ? "mark-x" : "mark-o");
  cell.setAttribute("aria-label", `Row ${Math.floor(index / 3) + 1}, column ${(index % 3) + 1}, ${currentPlayer}`);
  cell.disabled = true;

  const winningLine = winningLines.find((line) => line.every((square) => board[square] === currentPlayer));
  if (winningLine) {
    finishGame(`${currentPlayer} wins! 🎉`, winningLine);
  } else if (board.every(Boolean)) {
    finishGame("It's a draw! 🤝");
  } else {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusMessage.textContent = `${currentPlayer}'s turn`;
  }
}

function startNewGame() {
  board = Array(9).fill("");
  currentPlayer = "X";
  gameOver = false;
  statusMessage.textContent = "X's turn";
  cells.forEach((cell, index) => {
    cell.textContent = "";
    cell.disabled = false;
    cell.classList.remove("mark-x", "mark-o", "winner");
    cell.setAttribute("aria-label", `Row ${Math.floor(index / 3) + 1}, column ${(index % 3) + 1}, empty`);
  });
}

function shareGame() {
  const message = `Play Tic Tac Toe with me: ${window.location.href}`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, "_blank", "noopener,noreferrer");
}

cells.forEach((cell) => cell.addEventListener("click", playTurn));
restartButton.addEventListener("click", startNewGame);
shareButton.addEventListener("click", shareGame);
