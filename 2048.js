/**
 * Created by 12072 on 24/02/17.
 */

//Constants
const constants = {
    LEFT: "LEFT",
    RIGHT: "RIGHT",
    UP: "UP",
    DOWN: "DOWN"
};

/**
 * 2048 game initializer.
 * @param gridSize Total grid size
 * @param startCells how many default random cell to initialize
 * @constructor
 */
function TwentyFourtyEight(gridSize, startCells) {
    this.gridSize = gridSize;
    this.startCells = startCells;
    this.won = false;
    this.over = false;
    this.score = 0;
    this.cells = [];
    for (var x = 0; x < this.gridSize; x++) {
        var row = this.cells[x] = [];
        for (var y = 0; y < this.gridSize; y++) {
            row.push(null);
        }
    }

    this.start();
}


TwentyFourtyEight.prototype.start = function() {
    for (var i = 0; i < this.startCells; i++) {
        this.addRandomCells();
    }
};

TwentyFourtyEight.prototype.addRandomCells = function() {
    if (this.isFreeCell()) {
        var value = Math.random() < 0.9 ? 2 : 4;
        var position = this.getFreeRandomCell();
        this.insertValue(position, value);
    }
};

TwentyFourtyEight.prototype.insertValue = function(position, value) {
    this.cells[position.row][position.column] = value;
};

TwentyFourtyEight.prototype.isFreeCell = function() {
    return (this.freeCell().length != 0);
};

TwentyFourtyEight.prototype.freeCell = function() {
    var freeCells = [];
    for(var row = 0; row < this.gridSize; row++) {
        for(var column = 0; column < this.gridSize; column++) {
            if(!this.cells[row][column]) {
                freeCells.push({
                    row: row,
                    column: column
                });
            }
        }
    }
    
    return freeCells;
};

TwentyFourtyEight.prototype.getCells = function() {
    return this.cells;
};

TwentyFourtyEight.prototype.getFreeRandomCell = function() {
    var cells = this.freeCell();

    return cells[Math.floor(Math.random() * cells.length)];
};

TwentyFourtyEight.prototype.reverseByDirection = function (direction, list) {
    switch (direction) {
        case constants.RIGHT:
            list = list.reverse();
            break;
        case constants.DOWN:
            list = list.reverse();
            break;
    }

    return list;
}

TwentyFourtyEight.prototype.getTraversals = function(direction) {
    var traversals = {
        row: [],
        column: []
    };

    for (var pos = 0; pos < this.gridSize; pos++) {
        traversals.row.push(pos);
        traversals.column.push(pos);
    }

    traversals.row = this.reverseByDirection(direction, traversals.row);
    traversals.column = this.reverseByDirection(direction, traversals.column);

    return traversals;
};

TwentyFourtyEight.prototype.move = function(direction) {
    direction = constants[direction.toUpperCase()];
    var traversals = this.getTraversals(direction);
    this.applyMove(traversals, direction)
    this.addRandomCells();
};

TwentyFourtyEight.prototype.fillNull = function(summedList) {
    for(var i = 0; i<this.gridSize; i++) {
        if(!summedList[i]) {
            summedList[i] = null;
        }
    }
};

TwentyFourtyEight.prototype.applyMove = function(traversals, direction) {
    switch (direction) {
        case constants.LEFT:
        case constants.RIGHT:
            for(var i = 0; i<this.gridSize; i++) {
                this.traversalOnColumn(i, traversals.column, direction);
            }
            break;
        case constants.UP:
        case constants.DOWN:
            for(var i = 0; i<this.gridSize; i++) {
                this.traversalOnRow(i, traversals.row, direction);
            }
            break;
    }
};

TwentyFourtyEight.prototype.setWon = function(sumValue) {
    if(sumValue === 2048) {
        this.won = true;
    }
};

TwentyFourtyEight.prototype.updateScore = function(sumValue) {
    this.score += sumValue;
};

TwentyFourtyEight.prototype.getNextNonNullCellColumn = function(rowIndex, cells, index) {
    for (var i = index; i < this.gridSize; i++) {
        var cell = this.cells[rowIndex] ? this.cells[rowIndex][cells[i + 1]] : null;
        if(cell !== null) {
            return {
                cell: cell,
                index: (i + 1)
            }
        }
    }

};

TwentyFourtyEight.prototype.traversalOnColumn = function(rowIndex, cells, direction) {
    var i = 0, temp = [];
    while (i < this.gridSize) {
        var currentCell = this.cells[rowIndex][cells[i]];
        var nextCell = this.getNextNonNullCellColumn(rowIndex, cells, i);
        nextCell = nextCell ? nextCell : {};
        if(currentCell === nextCell.cell) {
            var sum = currentCell + nextCell.cell;
            if(sum !== 0) {
                this.setWon(sum);
                this.updateScore(sum);
                temp.push(sum);
            }
            if(nextCell.index) {
                i = nextCell.index + 1;
            }else {
                i += 2;
            }
        }else {
            if(currentCell)
                temp.push(currentCell);
            i++;
        }
    }

    this.fillNull(temp);
    this.cells[rowIndex] = this.reverseByDirection(direction, temp);
};

TwentyFourtyEight.prototype.getNextNonNullCellRow = function(columnIndex, cells, index) {
    for (var i = index; i < this.gridSize; i++) {
        var cell = this.cells[cells[i + 1]] ? this.cells[cells[i + 1]][columnIndex] : null;
        if(cell !== null) {
            return {
                cell: cell,
                index: (i + 1)
            }
        }
    }

};

TwentyFourtyEight.prototype.traversalOnRow = function(columnIndex, cells, direction) {
    var i = 0, temp = [];
    while (i < this.gridSize) {
        var currentCell = this.cells[cells[i]][columnIndex];
        var nextCell = this.getNextNonNullCellRow(columnIndex, cells, i);
        nextCell = nextCell ? nextCell : {};
        if(currentCell === nextCell.cell) {
            var sum = currentCell + nextCell.cell;
            if(sum !== 0) {
                this.setWon(sum);
                this.updateScore(sum);
                temp.push(sum);
            }
            if(nextCell.index) {
                i = nextCell.index + 1;
            }else {
                i += 2;
            }
        }else {
            if(currentCell)
                temp.push(currentCell);
            i++;
        }
    }

    this.fillNull(temp);
    i = 0;
    while (i < this.gridSize) {
        this.cells[cells[i]][columnIndex] = temp[i];
        i++;
    }

};

TwentyFourtyEight.prototype.print = function() {
    var str = "";
    for(var i = 0; i < this.gridSize; i++) {
        for(var j = 0; j < this.gridSize; j++) {
            str += this.cells[i][j] ? this.cells[i][j] + "  " : "n  "
        }
        str += '\n';
    }

    console.log(str)
};

module.exports = TwentyFourtyEight;