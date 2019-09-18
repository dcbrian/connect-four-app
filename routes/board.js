const BOARD_WIDTH = 7
const BOARD_HEIGHT = 8

module.exports = {

  fillBoard (board, column, pseudo) {
    let found = false
    let i = 0

    while (!found) {
      if (board[column][i] === undefined) {
        found = !found
        board[column][i] = pseudo
      } else {
        i++
      }
    }
  },

  hasWon (board, player) {
    // horizontalCheck
    for (let j = 0; j < BOARD_HEIGHT - 3; j++) {
      for (let i = 0; i < BOARD_WIDTH; i++) {
        if (board[i][j] === player && board[i][j + 1] === player && board[i][j + 2] === player && board[i][j + 3] === player) {
          return true
        }
      }
    }
    // verticalCheck
    for (let i = 0; i < BOARD_WIDTH - 3; i++) {
      for (let j = 0; j < BOARD_HEIGHT; j++) {
        if (board[i][j] === player && board[i + 1][j] === player && board[i + 2][j] === player && board[i + 3][j] === player) {
          return true
        }
      }
    }
    // ascendingDiagonalCheck
    for (let i = 3; i < BOARD_WIDTH; i++) {
      for (let j = 0; j < BOARD_HEIGHT - 3; j++) {
        if (board[i][j] === player && board[i - 1][j + 1] === player && board[i - 2][j + 2] === player && board[i - 3][j + 3] === player) {
          return true
        }
      }
    }
    // descendingDiagonalCheck
    for (let i = 3; i < BOARD_WIDTH; i++) {
      for (let j = 3; j < BOARD_HEIGHT; j++) {
        if (board[i][j] === player && board[i - 1][j - 1] === player && board[i - 2][j - 2] === player && board[i - 3][j - 3] === player) {
          return true
        }
      }
    }
    return false
  },

  create2DArray (rows) {
    var arr = []

    for (var i = 0; i < rows; i++) {
      arr[i] = []
    }

    return arr
  }
}
