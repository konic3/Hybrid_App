function GameManager(size, InputManager, Actuator, ScoreManager,bestscore) {
  this.size         = size; // Size of the grid
  this.inputManager = new InputManager;
  this.scoreManager = new ScoreManager;
  this.actuator     = new Actuator;


  this.selectedCells = [];
  this.startTiles   = 2;
  this.inputManager.on("move", this.move.bind(this));
  this.inputManager.on("restart", this.restart.bind(this));
  this.inputManager.on("keepPlaying", this.keepPlaying.bind(this));
  this.bestScore = bestscore;
  
  this.setup();
}


var addCount = -2;


// Restart the game
GameManager.prototype.restart = function () {
  this.actuator.continue();
  this.setup();
};

// Keep playing after winning
GameManager.prototype.keepPlaying = function () {
  this.keepPlaying = true;
  this.actuator.continue();
};

GameManager.prototype.isGameTerminated = function () {
  if (this.over || (this.won && !this.keepPlaying)) {
    return true;
  } else {
    return false;
  }
};

// Set up the game
GameManager.prototype.setup = function () {
  this.grid        = new Grid(this.size);

  this.score       = 0;
  this.over        = false;
  this.won         = false;
  this.keepPlaying = false;
  // Add the initial tiles
  this.addStartTiles();

  // Update the actuator
  this.actuate();
};

// Set up the initial tiles to start the game with
GameManager.prototype.addStartTiles = function () {
  for (var i = 0; i < this.startTiles; i++) {
    this.addRandomTile();
  }
};

GameManager.prototype.addRandomTile = function () {

  if (this.grid.cellsAvailable()) {
    addCount++;
    if (addCount >= 5) {
      this.shuffleGrid();
      addCount = 0; // 카운트 초기화
      return;
    }

    var value = Math.random() < 0.9 ? 2 : 4;
    var random = Math.floor(Math.random() * 2);
    var tile = new Tile(this.grid.randomAvailableCell(), value, random);

    this.grid.insertTile(tile);
    
  }
};


GameManager.prototype.shuffleGrid = function () {
  var tiles = [];
  var self = this;

  // 모든 타일 수집 및 그리드에서 제거
  this.grid.eachCell(function (x, y, tile) {
    if (tile) {
      tiles.push(tile);
      self.grid.cells[x][y] = null;
    }
  });

  // 타일을 무작위 순서로 배열
  tiles.sort(function () { return 0.5 - Math.random(); });

  // 타일을 다시 그리드에 배치
  tiles.forEach(function (tile) {
    var position = self.grid.randomAvailableCell();
    tile.x = position.x;
    tile.y = position.y;
    self.grid.cells[position.x][position.y] = tile;
  });
};


// Sends the updated grid to the actuator
GameManager.prototype.actuate = function () {
  if (this.bestScore < this.score) {
    this.bestScore=this.score;
  }

  this.actuator.actuate(this.grid, {
    score:      this.score,
    over:       this.over,
    won:        this.won,
    bestScore:  this.bestScore,
    terminated: this.isGameTerminated()
  });

};

// Save all tile positions and remove merger info
GameManager.prototype.prepareTiles = function () {
  this.grid.eachCell(function (x, y, tile) {
    if (tile) {
      tile.mergedFrom = null;
      tile.savePosition();
    }
  });
};

// Move a tile and its representation
GameManager.prototype.moveTile = function (tile, cell) {
  this.grid.cells[tile.x][tile.y] = null;
  this.grid.cells[cell.x][cell.y] = tile;
  tile.updatePosition(cell);
};

// Move tiles on the grid in the specified direction
GameManager.prototype.move = function (direction) {
  var self = this;
  if(addCount>=5){
    addCount=0;
    return;
  }
  if (this.isGameTerminated() || addCount >= 5) return;

  var cell, tile;
  if(addCount>=5)console.log(addCount,"move");
  var traversals = this.buildTraversals(direction);
  var moved      = false;

  // Save the current tile positions and remove merger information
  this.prepareTiles();

  // Traverse the grid in the right direction and move tiles
  traversals.forEach(function (cells) {
    cells.forEach(function (cell) {
      tile = self.grid.cellContent(cell);

      if (tile) {
        var positions = self.findFarthestPosition(cell, direction);
        var next      = self.grid.cellContent(positions.next);

        // Only one merger per row traversal?
        if ((next&&next.Border === tile.Border)&&(next && next.value === tile.value) &&!next.mergedFrom) {
          var merged = new Tile(positions.next, tile.value * 2,tile.Border);
          merged.mergedFrom = [tile, next];

          self.grid.insertTile(merged);
          self.grid.removeTile(tile);

          // Converge the two tiles' positions
          tile.updatePosition(positions.next);

          // Update the score
          self.score += merged.value;

        } else {
          self.moveTile(tile, positions.farthest);
        }

        if (!self.positionsEqual(cell, tile)) {
          moved = true; // The tile moved from its original cell!
        }
      }
    });
  });

  if (moved) {
    this.addRandomTile();
    // if (Math.random() > 0.25) {
    //   this.addRandomTile();
    // }
    if (!this.movesAvailable()) {
      this.over = true; // Game over!
    }

    this.actuate();
    return true;
  }
  return false;
};

// Get the vector representing the chosen direction
GameManager.prototype.getVector = function (direction, cell) {
  // Vectors representing tile movement
  var map = {
    0: { x: -1, y: 0 },  // left
    1: { x: 1,  y: 0 }   // right
  };

  if (map[direction]) {
    return map[direction];
  }

  var vector = {x: 0, y: 0};
  switch (direction) {
    case 2:
      if (cell.y < 3) {
        vector.x = -1;
      }
      vector.y = -1;
      break;
    case 3:
      if (cell.y < 2) {
        vector.x = 1;
      }
      vector.y = 1;
      break;
    case 4:
      if (cell.y > 2) {
        vector.x = 1;
      }
      vector.y = -1;
      break;
    case 5:
      if (cell.y > 1) {
        vector.x = -1;
      }
      vector.y = 1;
      break;
  }

  return vector;
};

// Build a list of positions to traverse in the right order
GameManager.prototype.buildTraversals = function (direction) {
  var map = {
    0: [
      [{ x: 0,  y: 0 }, { x: 1,  y: 0 }, { x: 2,  y: 0 }],
      [{ x: 0,  y: 1 }, { x: 1,  y: 1 }, { x: 2,  y: 1 }, { x: 3,  y: 1 }],
      [{ x: 0,  y: 2 }, { x: 1,  y: 2 }, { x: 2,  y: 2 }, { x: 3,  y: 2 }, { x: 4,  y: 2 }],
      [{ x: 0,  y: 3 }, { x: 1,  y: 3 }, { x: 2,  y: 3 }, { x: 3,  y: 3 }],
      [{ x: 0,  y: 4 }, { x: 1,  y: 4 }, { x: 2,  y: 4 }],
    ],
    2: [
      [{ x: 2,  y: 0 }, { x: 3,  y: 1 }, { x: 4,  y: 2 }],
      [{ x: 1,  y: 0 }, { x: 2,  y: 1 }, { x: 3,  y: 2 }, { x: 3,  y: 3 }],
      [{ x: 0,  y: 0 }, { x: 1,  y: 1 }, { x: 2,  y: 2 }, { x: 2,  y: 3 }, { x: 2,  y: 4 }],
      [{ x: 0,  y: 1 }, { x: 1,  y: 2 }, { x: 1,  y: 3 }, { x: 1,  y: 4 }],
      [{ x: 0,  y: 2 }, { x: 0,  y: 3 }, { x: 0,  y: 4 }],
    ],
    4: [
      [{ x: 0,  y: 0 }, { x: 0,  y: 1 }, { x: 0,  y: 2 }],
      [{ x: 1,  y: 0 }, { x: 1,  y: 1 }, { x: 1,  y: 2 }, { x: 0,  y: 3 }],
      [{ x: 2,  y: 0 }, { x: 2,  y: 1 }, { x: 2,  y: 2 }, { x: 1,  y: 3 }, { x: 0,  y: 4 }],
      [{ x: 3,  y: 1 }, { x: 3,  y: 2 }, { x: 2,  y: 3 }, { x: 1,  y: 4 }],
      [{ x: 4,  y: 2 }, { x: 3,  y: 3 }, { x: 2,  y: 4 }],
    ],
  };
  for (var i = 0; i < 6; i += 2) {
    map[i + 1] = [];
    for (var j = 0; j < map[i].length; j++) {
      map[i + 1].push(map[i][j].slice().reverse());
    }
  }
  return map[direction];
};

GameManager.prototype.findFarthestPosition = function (cell, direction) {
  var previous, vector;

  // Progress towards the vector direction until an obstacle is found
  do {
    vector = this.getVector(direction, cell);
    previous = cell;
    cell     = { x: previous.x + vector.x, y: previous.y + vector.y };
  } while (this.grid.withinBounds(cell) &&
           this.grid.cellAvailable(cell));

  return {
    farthest: previous,
    next: cell // Used to check if a merge is required
  };
};

GameManager.prototype.movesAvailable = function () {
  return this.grid.cellsAvailable() || this.tileMatchesAvailable();
};

// Check for available matches between tiles (more expensive check)
GameManager.prototype.tileMatchesAvailable = function () {
  var self = this;

  var tile;

  for (var x = 0; x < this.size; x++) {
    for (var y = 0; y < this.size; y++) {
      tile = this.grid.cellContent({ x: x, y: y });

      if (tile) {
        for (var direction = 0; direction < 6; direction++) {
          var vector = self.getVector(direction, { x: x, y: y });
          var cell   = { x: x + vector.x, y: y + vector.y };

          var other  = self.grid.cellContent(cell);

          if (other && other.value === tile.value&&other.Border===tile.Border) {
            return true; // These two tiles can be merged
          }
        }
      }
    }
  }

  return false;
};



GameManager.prototype.positionsEqual = function (first, second) {
  return first.x === second.x && first.y === second.y;
};

// 셀 선택 로직
GameManager.prototype.selectCell = function (x, y) {
  // 이미 선택된 셀을 다시 선택하지 않도록 함

  if (!this.selectedCells.some(c => c.x === x && c.y === y)) {
    if (this.selectedCells.length < 2) {
      // 최대 두 개의 셀만 선택
      this.selectedCells.push({x: x, y: y});
    } else {
      // 이미 두 셀이 선택되어 있으면, 새로운 선택을 위해 기존 선택 초기화
      this.selectedCells = [{x: x, y: y}];
    }
  }
};



// 셀 위치 교환
GameManager.prototype.swapCells = function () {

  if (this.selectedCells.length === 2) {
    var cell1 = this.selectedCells[0];
    var cell2 = this.selectedCells[1];

    var temp = this.grid.cells[cell1.x][cell1.y];
    this.grid.cells[cell1.x][cell1.y] = this.grid.cells[cell2.x][cell2.y];
    this.grid.cells[cell2.x][cell2.y] = temp;


    // 선택 초기화
    this.selectedCells = [];

    var tiles = [];
    var self = this;

    if (temp) {
      temp.updatePosition(cell2);
    }
    if (this.grid.cells[cell1.x][cell1.y]) {
      this.grid.cells[cell1.x][cell1.y].updatePosition(cell1);
    }

    // 선택 초기화
    this.selectedCells = [];

    // 화면 업데이트를 위해 actuate 메소드를 호출합니다.
    this.actuate();
  }
};


