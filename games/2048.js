// if we have an array that is 4 x 4, then we assume that the origin is at the lower left hand corner of the array, at [0][0]. To it's left would be [1][0], and above it would be [0][1].
var gameBoard = [];
var pastGameStates = new maxStack(30);

// Possible keys to register.
var possibleKeys = ['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'];

initialize();

// Game Loop
// On keyup, handle key press
document.addEventListener('keyup', function(e) {
    if(!possibleKeys.includes(e.key)) return;
    handleKey(e.key);
});

// Gets adjacent tile from the direction given
function getTile(x, y, direction)
{
    switch(direction){
        case 'up':
            if(x - 1 < 0) return null;
            return gameBoard[x - 1][y];
        case 'down':
            if(x + 1 > 3) return null;
            return gameBoard[x + 1][y];
        case 'left':
            if(y - 1 < 0) return null;
            return gameBoard[x][y - 1];
        case 'right':
            if(y + 1 > 3) return null;
            return gameBoard[x][y + 1];
        default:
            console.log('huh?');
            break;
    }
}

function findFreeSpots() {
    var freeSpots = [];
    loopBoard((x, y) => {
        if(gameBoard[x][y].value == 0) {
            freeSpots.push([x, y]);
        }
    });

    return freeSpots;
}

function createTile(freeSpots) {
    var tile = freeSpots[getRandomInt(freeSpots.length)];
    var value = 2;

    if(freeSpots.length < 5) {
        if(getRandomInt(5) == 1) value = 4;
    }

    gameBoard[tile[0]][tile[1]].value = value;
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function startShift(direction) {
    var moved = {value: false};

    switch(direction) {
        case 'up':
            for (let y = 0; y < gameBoard.length; y++) {
                for(let x = 0; x < gameBoard.length; x++) {
                    shift(x, y, direction, moved);
                }
            }
            break;
        case 'down':
            for (let y = 0; y < gameBoard.length; y++) {
                for(let x = 3; x >= 0; x--) {
                    shift(x, y, direction, moved);
                }
            }
            break;
        case 'left':
            for (let x = 0; x < gameBoard.length; x++) {
                for(let y = 0; y < gameBoard.length; y++) {
                    shift(x, y, direction, moved);
                }
            }
            break;
        case 'right':
            for (let x = 0; x < gameBoard.length; x++) {
                for(let y = 3; y >= 0; y--) {
                    shift(x, y, direction, moved);
                }
            }
            break;
    }

    return moved.value;
}

function shift(x, y, direction, moved) {
    var currentTile = gameBoard[x][y];
    var belowTile = getTile(x, y, direction);

    // if there is no tile to the below, ignore this, it's one of the edges of the board.
    // also ignore if the current line is empty
    if(belowTile == null || currentTile.value == 0) return;

    // if there is a tile to the below, and it has the same value, then let's merge.
    if(belowTile.value == currentTile.value && !belowTile.merged && !currentTile.merged) {
        moved.value = true;

        belowTile.value = belowTile.value * 2;
        belowTile.merged = true;
        currentTile.value = 0;
    }

    // if there is an empty tile to the below, shift.
    if(belowTile.value == 0) {
        moved.value = true;

        belowTile.value = currentTile.value;
        belowTile.merged = currentTile.merged;
        currentTile.value = 0;
        currentTile.merged = false
    }
}

function loopBoard(foo) {
    for (let x = 0; x < gameBoard.length; x++) {
        for (let y = 0; y < gameBoard.length; y++) {
            foo(x, y);
        }
    }
}

function clearMerged(){
    loopBoard((x, y) => gameBoard[x][y].merged = false);
}

function drawBoard() {
    let htmlBoard = document.querySelector('.game-board');
    htmlBoard.innerHTML = '';

    for (let x = 0; x < gameBoard.length; x++) {
        var row = document.createElement('div');
        row.classList.add('game-row');
        for (let y = 0; y < gameBoard.length; y++) {
            var cellValue = gameBoard[x][y].value;
            var cell = document.createElement('div');
            cell.classList.add('game-cell');
            cell.classList.add(`game-cell-${cellValue}`);
            cell.innerHTML = cellValue;
            row.appendChild(cell);
        }

        htmlBoard.appendChild(row);
    }
}

function getDirectionByKey(key) {
    switch(key){
        case 'ArrowLeft':
            return 'left';
        case 'ArrowRight':
            return 'right';
        case 'ArrowDown':
            return 'down';
        case 'ArrowUp':
            return 'up';
    }
}

function handleKey(key) {
    var tempSerializedGameState = JSON.stringify(gameBoard);

    var moved, movedAtAll = false;
    var direction = getDirectionByKey(key);

    do {
        moved = startShift(direction);
        if(moved) {
            movedAtAll = true;
        }
    } while(moved);
    
    if(movedAtAll) {
        pastGameStates.push(tempSerializedGameState);
        createTile(findFreeSpots());
    } else {
        // TODO: Oops?
        if(checkForLockout())
        {
            endGame();
        }
    }

    clearMerged();
    drawBoard();

    // Combine into one method?
    if(isBoardFull() && checkForLockout())
    {
        endGame();
    }
}

function undoMove() {
    if(pastGameStates.isEmpty()){
        alert("You can't undo anymore!");
    } else {
        gameBoard = JSON.parse(pastGameStates.pop());
        drawBoard();
    }
}

function initialize() {
    for(i = 0; i < 4; i++){
        gameBoard.push([]);
        for(z = 0; z < 4; z++){
            gameBoard[i][z] = {value: 0, merged: false};
        }
    }

    createTile(findFreeSpots());
    drawBoard();
}

function checkForLockout() {
    // This needs to check if there is any possible solution.
    // If there isn't, we return true.
    // Otherwise, we return false.
    console.time('lockout');
    var isLockedOut = true;
    var possibleDirections = ['up', 'down', 'left', 'right'];
    loopBoard((x, y) => {
        for (const direction of possibleDirections) {
            if(gameBoard[x][y].value == getTile(x, y, direction)?.value) {
                isLockedOut = false;
                return isLockedOut;
            } 
        }
    });

    console.timeEnd('lockout');

    return isLockedOut;
}

function isBoardFull() {
    var isFull = true;

    loopBoard((x, y) => {
        if(gameBoard[x][y].value == 0) isFull = false;
    });

    return isFull;
}

function endGame() {
    // This needs to kill the game state somehow. Maybe offer a dialog and reset the board?
    // We might need to add a variable that is checked when handling key presses to ignore key presses when the game is 'over'.
}

function generateFullBadBoard() {
    var z = 1;
    loopBoard((x, y) => {
        gameBoard[x][y].value = z;
        z++;
    });
}

var undoButton = document.querySelector('#undo-button');
undoButton.addEventListener('click', undoMove);

document.addEventListener('touchstart', handleTouchStart, false);
document.addEventListener('touchmove', handleTouchMove, false);

var xDown = null;
var yDown = null;

function getTouches(evt) {
    return evt.touches ||             // browser API
        evt.originalEvent.touches; // jQuery
}

function handleTouchStart(evt) {
    const firstTouch = getTouches(evt)[0];
    xDown = firstTouch.clientX;
    yDown = firstTouch.clientY;
};

function handleTouchMove(evt) {
    if ( ! xDown || ! yDown ) {
        return;
    }

    var xUp = evt.touches[0].clientX;
    var yUp = evt.touches[0].clientY;

    var xDiff = xDown - xUp;
    var yDiff = yDown - yUp;

    if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/
        if ( xDiff > 0 ) {
            handleKey('ArrowLeft');
        } else {
            handleKey('ArrowRight');
        }
    } else {
        if ( yDiff > 0 ) {
            handleKey('ArrowUp');
        } else {
            handleKey('ArrowDown');
        }
    }
    /* reset values */
    xDown = null;
    yDown = null;
};