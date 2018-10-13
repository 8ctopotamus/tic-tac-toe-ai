window.onload = function() {
  let num
  let box
  let ctx
  let turn = 1
  let gameOver = false
  let human = 'X'
  let ai = 'O'
  let result = {}
  let filled = new Array()
  let symbol = new Array()
  let winner = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
  ]

  for (let i = 0; i < 9; i++) {
    filled[i] = false
    symbol[i] = ''
  }

  // drawing X's and O's
  function drawX() {
    box.style.backgroundColor = '#fb5181'
    ctx.beginPath()
    ctx.moveTo(15, 15)
    ctx.lineTo(85, 85)
    ctx.moveTo(85, 15)
    ctx.lineTo(15, 85)
    ctx.lineWidth = 21
    ctx.lineCap = "round"
    ctx.strokeStyle = 'white'
    ctx.stroke()
    ctx.closePath()

    symbol[num - 1] = human
  }

  function drawO(next) {
    box.style.backgroundColor = '#93f273'
    ctx.beginPath()
    ctx.arc(50, 50, 35, 0, 2*Math.PI)
    ctx.lineWidth = 20
    ctx.strokeStyle = 'white'
    ctx.stroke()
    ctx.closePath()

    symbol[next] = ai // O
  }

  // winner check
  function winnerCheck(symbol, player) {
    for (let j = 0; j < winner.length; j++) {
      if (symbol[winner[j][0]] == player &&
        symbol[winner[j][1]] == player &&
        symbol[winner[j][2]] == player) {
          return true
      }
    }
    return false
  }

  function boxClick(numId) {
    box = document.getElementById(numId)
    ctx = box.getContext('2d')

    switch(numId) {
      case 'canvas1':
        num = 1
        break
      case 'canvas2':
        num = 2
        break
      case 'canvas3':
        num = 3
        break
      case 'canvas4':
        num = 4
        break
      case 'canvas5':
        num = 5
        break
      case 'canvas6':
        num = 6
        break
      case 'canvas7':
        num = 7
        break
      case 'canvas8':
        num = 8
        break
      case 'canvas9':
        num = 9
        break
    }

    if (filled[num-1] === false) {
      if (gameOver === false) {
        // human turn
        if (turn % 2 !== 0) {
          drawX()
          turn++
          filled[num-1] = true

          if (winnerCheck(symbol, symbol[num-1]) === true) {
            document.getElementById('result').innerText = 'Player "' + symbol[num-1] + '" won!'
            gameOver = true
          }

          if (turn > 9 && gameOver !== true) {
            document.getElementById('result').innerText = 'Game over. It was a draw!'
            return
          }

          if (turn % 2 === 0) {
            playAI()
          }
        }
      }
      else {
        alert("Game over. Please click the New Game button to start again")
      }
    }
    else {
      	alert("This box was already filled. Please click on another one.")
    }
  }

  function emptyBoxes(newSymbol) {
    let j = 0
    let empty = []
    for (let i = 0; i < newSymbol.length; i++) {
      if (newSymbol[i] !== 'X' && newSymbol[i] !== 'O') {
        empty[j] = i
        j++
      }
    }
    return empty
  }

  function playAI() {
    let nextMove = miniMax(symbol, ai) // object that stores id of next move and score of the box for next move
    let nextId = "canvas" + (nextMove.index + 1)
    box = document.getElementById(nextId)
    ctx = box.getContext('2d')
    if (gameOver === false) {
      // human turn, if turn is even
      if (turn % 2 === 0) {
        drawO(nextMove.index)
        turn++
        filled[nextMove.index] = true

        // winner check
        if (winnerCheck(symbol, symbol[nextMove.index]) === true) {
          document.getElementById('result').innerText = 'Player"' + symbol[nextMove.index] + '" won!'
          gameOver = true
        }

        // tie condition
        if (turn > 9 && gameOver !== true) {
          document.getElementById('result').innerText = 'Game over. It was a tie!'
        }
      }
    }
    else {
      alert('Game is over. Please click the New Game button to start again.')
    }
  }

  function miniMax(newSymbol, player) {
    let empty = []
    empty = emptyBoxes(newSymbol)
    if (winnerCheck(newSymbol, human)) {
      return { score: -10 } // human wins
    } else if (winnerCheck(newSymbol, ai)) {
      return { score: 10 } // AI wins
    }
    else if (empty.length === 0) {
      if (winnerCheck(newSymbol, human)) {
        return { score: -10 }
      } else if (winnerCheck(newSymbol, ai)) {
        return { score: 10 }
      }
      return { score: 0 } // game is a tie
    }

    // possible moves - their indices and score values
    let possMoves = []
    for (let i = 0; i < empty.length; i++) {
      //  current move - {index of current move, score}
      let curMove = {}
      // generate the new board with the current move
      curMove.index = empty[i]
      newSymbol[empty[i]] = player

      if (player === ai) {
        result = miniMax(newSymbol, human)
        curMove.score = result.score
      } else {
        result = miniMax(newSymbol, ai)
        curMove.score = result.score
      }

      newSymbol[empty[i]] = ''

      possMoves.push(curMove)
    }

    // calculate score of intermediate states - best move + score with respect to that player + return statement
    let bestMove
    // AI - max player (always) -> choose max value
    // human - will choose min value
    if (player === ai) {
      let highestScore = -1000
      for (let j = 0; j < possMoves.length; j++) {
        if (possMoves[j].score > highestScore) {
          highestScore = possMoves[j].score
          bestMove = j
        }
      }
    } else {
      let lowestScore = 1000
      for (let j = 0; j < possMoves.length; j++) {
        if (possMoves[j].score < lowestScore) {
          lowestScore = possMoves[j].score
          bestMove = j
        }
      }
    }
    return possMoves[bestMove]
  }

  // canvas click
  let canvasElements = document.querySelectorAll('canvas')
  let canvases = [].slice.call(canvasElements)
  canvases.forEach(el => {
    el.addEventListener('click', (e) => {
      boxClick(e.target.id)
    })
  })

  // reset
  function newGame() {
    document.location.reload()
  }
  let n = document.getElementById('new')
  n.addEventListener('click', newGame)
}
