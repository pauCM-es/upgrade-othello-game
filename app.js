const initialBoard = [
  [3,3,3,3,3,3,3,3,3,3],
  [3,0,0,0,0,0,0,0,0,3],
  [3,0,0,0,0,0,0,0,0,3],
  [3,0,0,2,0,0,0,0,0,3],
  [3,0,0,1,1,2,0,0,0,3],
  [3,0,2,2,2,1,0,0,0,3],
  [3,0,0,0,0,0,0,0,0,3],
  [3,0,0,0,0,0,0,0,0,3],
  [3,0,0,0,0,0,0,0,0,3],
  [3,3,3,3,3,3,3,3,3,3],
]
// 3 = wall
// 0 = empty
// 1 = white
// 2 = black

const players = [
  {ficha: 1, score: 0, color: "white", isMyTurn: false},
  {ficha: 2, score: 0, color: "black", isMyTurn: true},
]

const board$$ = document.querySelector(".board")
const p1$$ = document.querySelector("#p1")
const p2$$ = document.querySelector("#p2")
const scoreP1$$ = document.querySelector("#scoreP1")
const scoreP2$$ = document.querySelector("#scoreP2")

//*SCORE

const updateScore = () => {
  //reseteamos a 0 el score de los jugadores para contar todo
  players[0].score = 0
  players[1].score = 0

  initialBoard.forEach(row => {
    row.forEach(cell => {
        cell === 1 ? players[0].score++  //player1 - whites
        : cell === 2 && players[1].score++ //player2 - blacks
    })
  })
}

const paintScore = () => {
  scoreP1$$.textContent = players[0].score
  scoreP2$$.textContent = players[1].score
}

//*TURNS
const firstTurn = (players) => {
  players.forEach(player => {
    if (player.isMyTurn) {
      const firstTurn = `p${player.ficha}`
      const color = player.color
      firstTurn === p1$$ ? p1$$.classList.add("turn", color) : p2$$.classList.add("turn", color)

    } else {
      const secondTurn = `p${player.ficha}`
      const color = player.color
      secondTurn === p1$$ ? p1$$.classList.add(color) : p1$$.classList.add(color)
    }
  })
}

const nextTurn = () => {
  updateScore()
  paintScore()

  players[0].isMyTurn = !players[0].isMyTurn
  players[1].isMyTurn = !players[1].isMyTurn
  console.log(players[0].isMyTurn ? "next Turn: Player 1" : "next Turn: Player 2")
  
  p1$$.classList.toggle("turn")
  p2$$.classList.toggle("turn")

}

//* MOVIMIENTOS
const wrongMove = (moveToCell) => {
  moveToCell.classList.add("error-move")
  setTimeout(() => {
    moveToCell.classList.remove("error-move")
  }, 100);
}

const capture = (moveToCell) => {
  let cellsCaptured = []
  //comprobar las 8 direcciones         
  //capturar y dar la vuelta a las fichas
}

const moveIsPosible = (moveToCell) => {
  //que este vacia
  if (moveToCell.matches(".empty")) {
    players.forEach(player => {
      if (player.isMyTurn) {
        //pinta el tablero
        moveToCell.classList.replace("empty", player.color)
        //modifica el array reflejando la ficha
        const rowCell = moveToCell.id[0]
        const colCell = moveToCell.id[1]
        initialBoard[rowCell][colCell] = player.ficha
        console.log(initialBoard)
      }
    }) 

    //que este al lado de una ficha del color contratio


    return true
  } else {return false}
}

const move = (e) => {
  const moveToCell = e.target
  moveIsPosible(moveToCell) ? nextTurn() : wrongMove(moveToCell)}


//*INICIAMOS TABLERO
const paintBoard = (boardArray) => {
  boardArray.forEach((row, i) => {
    const row$$ = document.createElement("div")
    row$$.className = "row"
    board$$.appendChild(row$$)

    for (let j = 0; j < row.length; j++) {
      const cell$$ = document.createElement("span")
      cell$$.id = `${i}${j}`
      cell$$.className = "cell"
      row$$.appendChild(cell$$)

      row[j] === 3 ? cell$$.classList.add("wall")
          : row[j] === 0 ? cell$$.classList.add("empty")
          : row[j] === 1 ? cell$$.classList.add("white")
          : cell$$.classList.add("black")

      cell$$.addEventListener("click", (e) => {
        move(e)
      })

    }
  })
}

paintBoard(initialBoard)
firstTurn(players)
updateScore()
paintScore()
