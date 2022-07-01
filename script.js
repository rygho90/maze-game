const gameBoardElement = document.querySelector('[data-game-board]')
const startBtn = document.querySelector('[data-start-btn]')

let gameActive = false;
let inStart = true;
let gameBoard = generateGameBoard();
let roadblocks = [];
let enemies = [];
let round = 1;
let currentCell = null;

document.addEventListener('keypress', (e) => {
    const startCell = document.querySelector('[data-start-cell]');
    const endCell = document.querySelector('[data-end-cell]');
    const cellSpaces = document.querySelectorAll('[data-num]');
    
    // Press Enter to Start/Restart Game
    if (e.key === 'Enter') {
        if (!gameActive) {
            startBtn.style.display = 'none';
            endCell.style.backgroundColor = 'lightgreen'
            startCell.style.backgroundColor = 'black'
            gameActive = true;
            roadblocks = generateRoadBlocks();
            enemies = generateEnemies();
            console.log(enemies);
            let enemyTimeout = setTimeout(enemyMove, 1000);
        }     
    }

    if (!gameActive) return;

    // Press W to Move Up
    if (e.key === 'w' || e.key === 'W') {
        if (inStart) {
            startCell.style.backgroundColor = 'white';
            cellSpaces[90].style.backgroundColor = 'black';
            currentCell = 90;
            inStart = false;
        } else if (currentCell === 9) {
            // Win condition
            cellSpaces[9].style.backgroundColor = 'white';
            endCell.style.backgroundColor = 'black';
            nextRound();
        } else {
            if (currentCell > 9 && !roadblocks.includes(currentCell - 10)) {
                cellSpaces[currentCell].style.backgroundColor = 'white';
                currentCell -= 10;
                cellSpaces[currentCell].style.backgroundColor = 'black';
                checkCollision();
            }
        }
    }

    // Press S to Move Down
    if (e.key === 's' || e.key === 'S') {
        if (inStart) return;
        if (currentCell < 90 && !roadblocks.includes(currentCell + 10)) {
            cellSpaces[currentCell].style.backgroundColor = 'white';
            currentCell += 10;
            cellSpaces[currentCell].style.backgroundColor = 'black';
            checkCollision();
        }
    }

    // Press A to Move Left
    if (e.key === 'a' || e.key === 'A') {
        if (inStart) return;
        if (currentCell % 10 !== 0 && !roadblocks.includes(currentCell - 1)) {
            cellSpaces[currentCell].style.backgroundColor = 'white';
            currentCell -= 1;
            cellSpaces[currentCell].style.backgroundColor = 'black';
            checkCollision();
        }
    }

    // Press D to Move Right
    if (e.key === 'd' || e.key === 'D') {
        if (inStart) return;
        if ((currentCell - 9) % 10 !== 0 && !roadblocks.includes(currentCell + 1)) {
            cellSpaces[currentCell].style.backgroundColor = 'white';
            currentCell += 1;
            cellSpaces[currentCell].style.backgroundColor = 'black';
            checkCollision();
        }
    }
})


function generateGameBoard() {
    const gameBoard = [];
    for (let i = 0; i < 10; i++) {
        // Generate Rows
        let row = []
        for (let j = 0; j < 10; j++) {
            row.push(j + (i*10));
        }
        gameBoard.push(row);
    }   
    return gameBoard;
}

function drawBoard() {
    clearElement(gameBoardElement);
    drawTopRow();
    drawMainArea();
    drawBotRow();
}

function drawTopRow() {
    const rowElement = document.createElement('div');
    rowElement.classList.add('row');
    for (let i = 0; i < 10; i++) {
        if (i < 9) {
            const cellElement = document.createElement('div');
            cellElement.classList.add('borderless-cell');
            rowElement.append(cellElement);
        } else {
            const cellElement = document.createElement('div');
            cellElement.classList.add('cell');
            cellElement.style.backgroundColor = 'lightgreen'
            cellElement.setAttribute('data-end-cell', '')
            rowElement.append(cellElement);
        }
    }
    gameBoardElement.append(rowElement)
}

function drawMainArea() {
    let cellNum = 0;
    gameBoard.forEach(row => {
        const rowElement = document.createElement('div');
        rowElement.classList.add('row');
        row.forEach(cell => {
            const cellElement = document.createElement('div');
            cellElement.classList.add('cell');
            cellElement.setAttribute('data-num', cellNum)
            cellNum += 1;
            rowElement.append(cellElement);
        })
        gameBoardElement.append(rowElement);
    })
}

function drawBotRow() {
    const rowElement = document.createElement('div');
    rowElement.classList.add('row');
    for (let i = 0; i < 10; i++) {
        if (i > 0) {
            const cellElement = document.createElement('div');
            cellElement.classList.add('borderless-cell');
            rowElement.append(cellElement);
        } else {
            const cellElement = document.createElement('div');
            cellElement.classList.add('cell');
            cellElement.setAttribute('data-start-cell', '')
            cellElement.style.backgroundColor = 'black'
            rowElement.append(cellElement);
        }
    }
    gameBoardElement.append(rowElement)
}

function generateRoadBlocks() {
    let roadBlockSpaces = [];
    for (i = 5; i < 90; i = i+5) {
        // Generate random number between min (i) and max (i+10)
        let num = Math.floor(Math.random() * ((i+10) - i + 1) ) + i;
        if (num !== 90 && num !== 9 && num !== 80 && num !== 19 && num !== 18 && num != 81) {
            roadBlockSpaces.push(num);
        }
    }

    let possibleSpaces = document.querySelectorAll('[data-num]');
    possibleSpaces.forEach(space => {
        space.style.backgroundColor = 'white';
        let spaceNum = space.getAttribute('data-num');

        if (roadBlockSpaces.includes(parseInt(spaceNum))) {
            space.style.backgroundColor = 'brown';
        }
    })

    if (roadBlockSpaces.includes(60) && roadBlockSpaces.includes(71) && roadBlockSpaces.includes(82) && roadBlockSpaces.includes(93)) {
        generateRoadBlocks();
    } else if (roadBlockSpaces.includes(6) && roadBlockSpaces.includes(17) && roadBlockSpaces.includes(28) && roadBlockSpaces.includes(39)) {
        generateRoadBlocks();
    } else return roadBlockSpaces;
}

function generateEnemies() {
    let enemySpaces = [];
    for (i = 0; i < round; i++) {
        let num = Math.floor(Math.random() * (69 - 11)) + 21;
        enemySpaces.push(num)
    }

    let possibleSpaces = document.querySelectorAll('[data-num]');
    possibleSpaces.forEach(space => {
        
        let spaceNum = space.getAttribute('data-num');

        if (enemySpaces.includes(parseInt(spaceNum))) {
            space.style.backgroundColor = 'red';
        }
    })

    roadblocks = roadblocks.filter(roadblock => {
        return !enemySpaces.includes(roadblock);
    })

    return enemySpaces;
}

function checkCollision() {
    if (enemies.includes(currentCell)) {
        resetGame();
    }
}

function enemyMove() {
    const cellSpaces = document.querySelectorAll('[data-num]');

    for (let i = 0; i < enemies.length; i++) {
        let randomNum = Math.floor(Math.random() * 4);
        let enemyCell = enemies[i];

        switch(randomNum) {
            case 0:
                if (enemyCell > 9 && !roadblocks.includes(enemyCell - 10)) {
                    cellSpaces[enemyCell].style.backgroundColor = 'white';
                    enemyCell -= 10;
                    cellSpaces[enemyCell].style.backgroundColor = 'red';
                    checkCollision();
                    enemies[i] = enemyCell;
                }
                break;
            case 1:
                if (enemyCell < 90 && !roadblocks.includes(enemyCell + 10)) {
                    cellSpaces[enemyCell].style.backgroundColor = 'white';
                    enemyCell += 10;
                    cellSpaces[enemyCell].style.backgroundColor = 'red';
                    checkCollision();
                    enemies[i] = enemyCell;
                }
                break;
            case 2:
                if (enemyCell % 10 !== 0 && !roadblocks.includes(enemyCell - 1)) {
                    cellSpaces[enemyCell].style.backgroundColor = 'white';
                    enemyCell -= 1;
                    cellSpaces[enemyCell].style.backgroundColor = 'red';
                    checkCollision();
                    enemies[i] = enemyCell;
                }
                break;
            case 3:
                if ((enemyCell - 9) % 10 !== 0 && !roadblocks.includes(enemyCell + 1)) {
                    cellSpaces[enemyCell].style.backgroundColor = 'white';
                    enemyCell += 1;
                    cellSpaces[enemyCell].style.backgroundColor = 'red';
                    checkCollision();
                    enemies[i] = enemyCell;
                }
                break;
        }
    }

    enemyTimeout = setTimeout(enemyMove, 1000);    
    console.log(enemyTimeout)
}

function resetGame() {
    gameActive = false;
    inStart = true;
    gameBoard = generateGameBoard();
    roadblocks = [];
    currentCell = null;
    startBtn.style.display = 'initial';
    enemies = [];
    round = 1;
    clearTimeout(enemyTimeout)
}

function nextRound() {
    const startCell = document.querySelector('[data-start-cell]');
    const endCell = document.querySelector('[data-end-cell]');
    inStart = true;
    gameBoard = generateGameBoard();
    currentCell = null;
    round += 1;
    clearTimeout(enemyTimeout)
    endCell.style.backgroundColor = 'lightgreen'
    startCell.style.backgroundColor = 'black'
    roadblocks = generateRoadBlocks();
    enemies = generateEnemies();
    enemyTimeout = setTimeout(enemyMove, 1000);
}

function clearElement(element) {
    while (element.firstChild) {
        element.firstChild.remove();
    }
}

drawBoard();
console.log(gameBoard)