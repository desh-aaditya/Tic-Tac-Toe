class TicTacToe {
  constructor() {
    this.board = Array(9).fill(null)
    this.currentPlayer = "X"
    this.gameActive = true
    this.history = [Array(9).fill(null)]
    this.currentMove = 0

    this.squares = document.querySelectorAll(".square")
    this.status = document.getElementById("status")
    this.resetBtn = document.getElementById("reset-btn")
    this.moveList = document.getElementById("move-list")

    this.initializeGame()
  }

  initializeGame() {
    this.squares.forEach((square, index) => {
      square.addEventListener("click", () => this.handleSquareClick(index))
    })

    this.resetBtn.addEventListener("click", () => this.resetGame())
    this.updateDisplay()
    this.updateMoveHistory()
  }

  handleSquareClick(index) {
    if (!this.gameActive || this.board[index]) {
      return
    }

    this.board[index] = this.currentPlayer
    this.history = this.history.slice(0, this.currentMove + 1)
    this.history.push([...this.board])
    this.currentMove = this.history.length - 1

    const winner = this.calculateWinner(this.board)
    if (winner) {
      this.gameActive = false
      this.highlightWinningSquares(winner.line)
      this.status.textContent = `Winner: ${winner.player}`
      this.status.classList.add("winner-announcement")
    } else if (this.board.every((square) => square !== null)) {
      this.gameActive = false
      this.status.textContent = "Game ended in a draw!"
      this.status.classList.add("draw-announcement")
    } else {
      this.currentPlayer = this.currentPlayer === "X" ? "O" : "X"
      this.status.textContent = `Next player: ${this.currentPlayer}`
    }

    this.updateDisplay()
    this.updateMoveHistory()
  }

  calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ]

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i]
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return {
          player: squares[a],
          line: lines[i],
        }
      }
    }
    return null
  }

  highlightWinningSquares(winningLine) {
    winningLine.forEach((index) => {
      this.squares[index].classList.add("winning")
    })
  }

  updateDisplay() {
    this.squares.forEach((square, index) => {
      square.textContent = this.board[index] || ""
      square.className = "square"

      if (this.board[index] === "X") {
        square.classList.add("x")
      } else if (this.board[index] === "O") {
        square.classList.add("o")
      }

      square.disabled = !this.gameActive || this.board[index] !== null
    })
  }

  updateMoveHistory() {
    this.moveList.innerHTML = ""

    this.history.forEach((squares, move) => {
      const li = document.createElement("li")
      const button = document.createElement("button")

      if (move > 0) {
        button.textContent = `Go to move #${move}`
      } else {
        button.textContent = "Go to game start"
      }

      button.addEventListener("click", () => this.jumpToMove(move))
      li.appendChild(button)
      this.moveList.appendChild(li)
    })
  }

  jumpToMove(move) {
    this.currentMove = move
    this.board = [...this.history[move]]
    this.currentPlayer = move % 2 === 0 ? "X" : "O"
    this.gameActive = true
    this.status.classList.remove("winner-announcement", "draw-announcement")

    const winner = this.calculateWinner(this.board)
    if (winner) {
      this.gameActive = false
      this.status.textContent = `Winner: ${winner.player}`
      this.status.classList.add("winner-announcement")
      this.highlightWinningSquares(winner.line)
    } else if (this.board.every((square) => square !== null)) {
      this.gameActive = false
      this.status.textContent = "Game ended in a draw!"
      this.status.classList.add("draw-announcement")
    } else {
      this.status.textContent = `Next player: ${this.currentPlayer}`
    }

    this.updateDisplay()
  }

  resetGame() {
    this.board = Array(9).fill(null)
    this.currentPlayer = "X"
    this.gameActive = true
    this.history = [Array(9).fill(null)]
    this.currentMove = 0

    this.status.textContent = "Next player: X"
    this.status.classList.remove("winner-announcement", "draw-announcement")

    this.updateDisplay()
    this.updateMoveHistory()
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new TicTacToe()
})
