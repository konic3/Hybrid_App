function HTMLActuator() {
  this.tileContainer    = document.querySelector(".tile-container");
  this.scoreContainer   = document.querySelector(".score-container");
  this.bestContainer    = document.querySelector(".best-container");
  this.messageContainer = document.querySelector(".game-message");

  
  this.score = 0;
}

HTMLActuator.prototype.actuate = function (grid, metadata) {
  var self = this;

  window.requestAnimationFrame(function () {
    self.clearContainer(self.tileContainer);

    grid.cells.forEach(function (column) {
      column.forEach(function (cell) {
        if (cell) {
          self.addTile(cell);
        }
      });
    });

    self.updateScore(metadata.score);
    self.updateBestScore(metadata.bestScore);

    if (metadata.terminated) {
      if (metadata.over) {
        self.message(false); // You lose
      } else if (metadata.won) {
        self.message(true); // You win!
      }
    }

  });
};

// Continues the game (both restart and keep playing)
HTMLActuator.prototype.continue = function () {
  this.clearMessage();
};

HTMLActuator.prototype.clearContainer = function (container) {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
};

HTMLActuator.prototype.addTile = function (tile) {
  var self = this;

  var wrapper   = document.createElement("div");
  var inner     = document.createElement("div");
  var position  = tile.previousPosition || { x: tile.x, y: tile.y };
  var positionClass = this.positionClass(position);

  // We can't use classlist because it somehow glitches when replacing classes
  var classes = ["tile", "tile-" + tile.value +"-"+tile.Border , positionClass];

  // if (tile.value > 2048) classes.push("tile-super");

  this.applyClasses(wrapper, classes);

  inner.classList.add("tile-inner");
  inner.textContent = tile.value;

  if (tile.previousPosition) {
    // Make sure that the tile gets rendered in the previous position first
    window.requestAnimationFrame(function () {
      classes[2] = self.positionClass({ x: tile.x, y: tile.y });
      self.applyClasses(wrapper, classes); // Update the position
    });
  } else if (tile.mergedFrom) {
    classes.push("tile-merged");
    this.applyClasses(wrapper, classes);

    // Render the tiles that merged
    tile.mergedFrom.forEach(function (merged) {
      self.addTile(merged);
    });
  } else {
    classes.push("tile-new");
    this.applyClasses(wrapper, classes);
  }

  // Add the inner part of the tile to the wrapper
  wrapper.appendChild(inner);

  // Put the tile on the board
  this.tileContainer.appendChild(wrapper);
};

HTMLActuator.prototype.applyClasses = function (element, classes) {
  element.setAttribute("class", classes.join(" "));
};

HTMLActuator.prototype.normalizePosition = function (position) {
  var map = [
    [{r: 2, theta: 120}, {r: 2, theta: 90}, {r: 2, theta: 60}],
    [{r: 2, theta: 150}, {r: 1, theta: 120}, {r: 1, theta: 60}, {r: 2, theta: 30}],
    [{r: 2, theta: 180}, {r: 1, theta: 180}, {r: 0, theta: 0}, {r: 1, theta: 0}, {r: 2, theta: 0}],
    [{r: 2, theta: 210}, {r: 1, theta: 240}, {r: 1, theta: 300}, {r: 2, theta: 330}],
    [{r: 2, theta: 240}, {r: 2, theta: 270}, {r: 2, theta: 300}],
  ]
  return map[position.y][position.x];
};

HTMLActuator.prototype.positionClass = function (position) {
  position = this.normalizePosition(position);
  return "tile-position-" + position.r + "-" + position.theta;
};

HTMLActuator.prototype.updateScore = function (score) {
  this.clearContainer(this.scoreContainer);

  var difference = score - this.score;
  this.score = score;

  this.scoreContainer.textContent = this.score;

  if (difference > 0) {
    var addition = document.createElement("div");
    addition.classList.add("score-addition");
    addition.textContent = "+" + difference;

    this.scoreContainer.appendChild(addition);
  }
};

HTMLActuator.prototype.updateBestScore = function (bestScore) {
  this.bestContainer.textContent = bestScore;
  updateBestScore(bestScore);
};

HTMLActuator.prototype.message = function (won) {
  var type    = won ? "game-won" : "game-over";
  var message = won ? "You win!" : "Game over!";
  document.getElementsByClassName("endscore-container")[0].innerHTML=this.score;
  document.getElementsByClassName("endbest-container")[0].innerHTML= document.getElementsByClassName("best-container")[0].innerHTML;
  if(this.score<1000){
    document.getElementsByClassName("endscore-container")[0].style.marginleft= "66px";
  }else if(this.score>=1000){
    document.getElementsByClassName("endscore-container")[0].style.marginleft= "50px";
  }
  sortbyscore();

  this.messageContainer.classList.add(type);
  this.messageContainer.getElementsByTagName("p")[0].textContent = message;
};

HTMLActuator.prototype.clearMessage = function () {
  // IE only takes one value to remove at a time.
  this.messageContainer.classList.remove("game-won");
  this.messageContainer.classList.remove("game-over");
};


function updateBestScore(newBestScore) {
  if (loggedInUserId === null) {
    alert('No user is logged in.');
    return;
  }

  fetch(`http://localhost:3000/updateBestScore/${loggedInUserId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ bestscore: newBestScore }), 
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      //alert(`Best score updated to: ${newBestScore}`);
    } else {
      alert(`Failed to update best score: ${data.error}`);
    }
  })
  .catch(error => {
    console.error('Error during best score update request:', error);
    alert('Failed to update best score. Please try again.');
  });
}


function sortbyscore(){
  // var sorteddata;
  fetch('http://localhost:3000/readrank')
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    sorteddata = data;
    // 1위
    let element = data[0].id;
    let upperCaseText = element.toUpperCase();
    document.getElementById("first_pro").innerHTML=upperCaseText.substring(0,2);
    document.getElementById("name_1").innerHTML=data[0].id;
    document.getElementById("score_1").innerHTML=data[0].bestscore;
    // 2위 
    element = data[1].id;
    upperCaseText = element.toUpperCase();
    document.getElementById("second_pro").innerHTML=upperCaseText.substring(0,2);
    document.getElementById("name_2").innerHTML=data[1].id;
    document.getElementById("score_2").innerHTML=data[1].bestscore;
    // 3위
    element = data[2].id;
    upperCaseText = element.toUpperCase();
    document.getElementById("third_pro").innerHTML=upperCaseText.substring(0,2);
    document.getElementById("name_3").innerHTML=data[2].id;
    document.getElementById("score_3").innerHTML=data[2].bestscore;
    
    for (let index = 0; index < data.length-3; index++) {
      document.getElementsByClassName("rankname")[index].innerHTML=data[index+3].id;
      document.getElementsByClassName("rankscore")[index].innerHTML=data[index+3].bestscore;
    }
  })
  .catch(error => {
    console.error('오류 발생:', error);
  });
  

}