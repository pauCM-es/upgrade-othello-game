const initialBoard = [
  [3,3,3,3,3,3,3,3,3,3],
  [3,0,0,0,0,0,0,0,0,3],
  [3,0,0,0,1,0,0,0,0,3],
  [3,0,0,2,1,0,0,0,0,3],
  [3,0,0,0,1,2,0,0,0,3],
  [3,0,2,2,2,1,0,0,0,3],
  [3,0,0,0,0,0,1,0,0,3],
  [3,0,0,0,0,0,0,0,0,3],
  [3,0,0,0,0,0,0,0,0,3],
  [3,3,3,3,3,3,3,3,3,3],
]
// 3 = wall
// 0 = empty
// 1 = white
// 2 = black
let board = [...initialBoard]
let potentialMoves = []
let tokensCaptured = []

const players = [
  {token: 1, score: 0, color: "white", isMyTurn: false, oppositeToken: 2, oppositeColor: "black"},
  {token: 2, score: 0, color: "black", isMyTurn: true, oppositeToken: 1, oppositeColor: "white"}
]

const directions = [
  {row: -1, col: -1}, {row: -1, col: 0}, {row: -1, col: +1},
  {row:  0, col: -1},                    {row:  0, col: +1},
  {row: +1, col: -1}, {row: +1, col: 0}, {row: +1, col: +1},
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
      const firstTurn = `p${player.token}`
      const color = player.color
      firstTurn === p1$$ ? p1$$.classList.add("turn", color) : p2$$.classList.add("turn", color)

    } else {
      const secondTurn = `p${player.token}`
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

//con los vectores de direccion sacar la posicion de la siguiente celda
const idNextCell = (rowDir, colDir, idInitialCell) => {
  console.log(rowDir, colDir, idInitialCell)
  const rowInitialCell = idInitialCell[0]
  const colInitialCell = idInitialCell[1]
  const rowNextCell =  Number(rowInitialCell) + Number(rowDir)
  const colNextCell =  Number(colInitialCell) + Number(colDir)
  const next = [rowNextCell, colNextCell]
  // console.log( rowInitialCell, colInitialCell, rowNextCell, colNextCell)
  return next
}

//capturar y dar la vuelta a las fichas
const capture = (moveToCell, token, tokenToCapture) => {
  //ver cuantas fichas se pueden capturar en cada direccion.
  potentialMoves.map(dir => {
    let next = idNextCell(dir.direction[0], dir.direction[1], dir.id)
    const valueNextCell = board[next[0]][next[1]]
    console.log(valueNextCell)
    //si la siguiente es del que hace la jugada -> OK -> fin del mapeo -> captura token
    if (valueNextCell === token) {
      tokensCaptured = [...tokensCaptured, dir.id]
    } else if (valueNextCell === tokenToCapture) {
      
    } else return false
  })
  console.log(tokensCaptured)
  tokensCaptured.forEach(tkn => {
     board[tkn[0]][tkn[1]] = token
  })
}

const checkTokens = (cell, token) => {
  //ver en los alrededores de una token posibles capturas
  const surroundings = directions.map(nextCell => {
    const {row, col} = nextCell //direction: vectores x e y de la celda contigua
    const rowCell = cell.id[0]
    const colCell = cell.id[1]
    const idRowNextCell = Number(rowCell) + Number(row)
    const idColNextCell = Number(colCell) + Number(col)
    const value = board[idRowNextCell][idColNextCell]
    const idNextCell = `${idRowNextCell}${idColNextCell}`

    return {id: idNextCell, value: value, direction: [row, col]}
  })
  //filtramos solo las posiciones con fichas contrarias como posibles movimientos
  potentialMoves = surroundings.filter(potentialMove => potentialMove.value === token)
}

const moveIsPosible = (moveToCell) => {
  //iniciamos las capturas a 0
  tokensCaptured = []
  //que este vacia
  if (moveToCell.matches(".empty")) {
    players.forEach(player => {
      if (player.isMyTurn) {
        //que este al lado de un token del color contratio
        checkTokens(moveToCell, player.oppositeToken)
        if (potentialMoves.length > 0) {
          capture(moveToCell, player.token, player.oppositeToken)


          //pinta el tablero el token puesto
          moveToCell.classList.replace("empty", player.color)
          //modifica el array reflejando el token
          const rowCell = moveToCell.id[0]
          const colCell = moveToCell.id[1]
          board[rowCell][colCell] = player.token
          //pintamos en el tablero las capturadas al cabo de un tiempo
          setTimeout(() => {
            tokensCaptured.forEach(tkn => {
              const idElement = document.getElementById(`${tkn}`) 
              idElement.classList.replace(player.oppositeColor, player.color)
            })  
          }, 300);
        }
      }
    })
    console.log("true: empty and captures")
    return true
  } else {
    console.log("false: not empty")
    return false
  }
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
