function KeyboardInputManager() {
  this.events = {};

  this.listen();
}


KeyboardInputManager.prototype.on = function (event, callback) {
  if (!this.events[event]) {
    this.events[event] = [];
  }
  this.events[event].push(callback);
};

KeyboardInputManager.prototype.emit = function (event, data) {
  var callbacks = this.events[event];
  var result;
  if (callbacks) {
    callbacks.forEach(function (callback) {
      result = callback(data);
    });
  }
  return result;
};

KeyboardInputManager.prototype.listen = function () {
  var self = this;

  var moveMap = {
    81: 2, // Q
    67: 3, // C
    69: 4, // E
    90: 5  // Z
  };

  var horizontalMap = {
    37: 0, // Left
    39: 1, // Right
    72: 0, // vim
    76: 1,
    65: 0, // A
    68: 1  // D
  }

  var verticalMap = {
    81: 2, //q
    69: 4,//e
    67: 3, //c
    90: 5, //z
  };

  var lastLRDereiction = 0;

  document.addEventListener("keydown", function (event) {
    if (verticalMap[event.which] || horizontalMap[event.which]) {
      event.preventDefault();
    }
  });

  document.addEventListener("keyup", function (event) {
    
    var modifiers = event.altKey || event.ctrlKey || event.metaKey ||
                    event.shiftKey;
    var hMapped = horizontalMap[event.which]; 
    var vMapped = verticalMap[event.which];
    if (!modifiers) {
      if (hMapped !== undefined) {
        event.preventDefault();
        if (self.emit("move", hMapped)) {
          lastLRDereiction = hMapped;
        }
      }
      if (vMapped !== undefined) {
        switch (vMapped) {
          case 2:
            vMapped = 2;
            break;
          case 4:
            vMapped = 4;
            break;
          case 5:
            vMapped = 5;
            break;
          case 3:
            vMapped = 3;
            break;
        }
        event.preventDefault();
        self.emit("move", vMapped);
      }
      if (event.which === 32) self.restart.bind(self)(event);
    }
  });

  var retry = document.querySelector(".retry-button");
  retry.addEventListener("click", this.restart.bind(this));
  retry.addEventListener("touchend", this.restart.bind(this));
  var rr = document.querySelector("#rr");
  rr.addEventListener("click", this.restart.bind(this));
  rr.addEventListener("touchend", this.restart.bind(this));

  

  var keepPlaying = document.querySelector(".keep-playing-button");
  keepPlaying.addEventListener("click", this.keepPlaying.bind(this));
  keepPlaying.addEventListener("touchend", this.keepPlaying.bind(this));

  // Listen to swipe events
  var touchStartClientX, touchStartClientY;
  var gameContainer = document.getElementsByClassName("game-container")[0];

  gameContainer.addEventListener("touchstart", function (event) {
    if (event.touches.length > 1) return;

    touchStartClientX = event.touches[0].clientX;
    touchStartClientY = event.touches[0].clientY;
    event.preventDefault();
  });

  gameContainer.addEventListener("touchmove", function (event) {
    event.preventDefault();
  });

  gameContainer.addEventListener("touchend", function (event) {
    if (event.touches.length > 0) return;

    var dx = event.changedTouches[0].clientX - touchStartClientX;
    var absDx = Math.abs(dx);

    var dy = event.changedTouches[0].clientY - touchStartClientY;
    var absDy = Math.abs(dy);

    if (Math.max(absDx, absDy) > 10) {
      if (absDx > absDy) {
        if (self.emit("move", dx > 0 ? 1 : 0)) {
          lastLRDereiction = dx > 0 ? 1 : 0;
        }
      } else {
        self.emit("move", dy < 0 ? 4 - lastLRDereiction * 2 : 3 + lastLRDereiction * 2);
      }
    }
  });
};

KeyboardInputManager.prototype.restart = function (event) {
  event.preventDefault();
  this.emit("restart");
};

KeyboardInputManager.prototype.keepPlaying = function (event) {
  event.preventDefault();
  this.emit("keepPlaying");
};
