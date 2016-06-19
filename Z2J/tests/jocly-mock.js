JocGame     = {
  PLAYER_A: 1,
  PLAYER_B: -1
};
var Model   = {};
Model.Game  = {
  mOptions: {
     initial: {
        "White": {
            "Man": ["a2", "b2", "c2", "d2", "e2", "f2", "g2", "h2", "a3", "b3", "c3", "d3", "e3", "f3", "g3", "h3"]
        },
        "Black": {
            "Man": ["a7", "b7", "c7", "d7", "e7", "f7", "g7", "h7", "a6", "b6", "c6", "d6", "e6", "f6", "g6", "h6"]
        }
      }
  },
  zobrist: {
      update: function(zSign, aType, aName, aPos) {
         return zSign;
      }
  }
};
Model.Board = {
  game:   Model.Game,
  mWho:   1,
  forks:  [],
  pieces: [],
  names:  []
};
Model.Move = {};

ZrfMove = function() {
  this.moves = [];
}

function ZrfGenStub() {
  this.board  = Model.Board;
  this.cc     = 0;
  this.cp     = null;
  this.stack  = [];
  this.mark   = null;
  this.backs  = [];
  this.flags  = [];
  this.move   = new ZrfMove();
  this.starts = [];
  this.stops  = [];
}

Model.Game.createGen = function(aTemplate, aParams) {
  return new ZrfGenStub();
}

ZrfGenStub.prototype.copyFrom = function(aGen) {
  this.board = aGen.board;
  this.cc = aGen.cc;
}

ZrfGenStub.prototype.isLastFrom = function(aPos) {
  return false;
}

ZrfGenStub.prototype.isLastTo = function(aPos) {
  return false;
}

ZrfGenStub.prototype.getValue = function(aName, aPos) {
  if (aPos >= 0) {
      return this.board.getValue(aName, aPos);
  }
  if (typeof this.flags[aName] === "undefined") {
      return false;
  }
  return this.flags[aName];
}

ZrfGenStub.prototype.setValue = function(aName, aPos, aValue) {
  if (aPos < 0) {
      this.flags[aName] = aValue;
  } else {
      this.board.setValue(aName, aPos, aValue);
  }
}

ZrfGenStub.prototype.getPiece = function(aPos) {
  return this.board.getPiece(aPos);
}

ZrfGenStub.prototype.getAttribute = function(aType, aName) {
  return false;
}

ZrfGenStub.prototype.setPiece = function(aPos, aPiece) {
  this.board.setPiece(aPos, aPiece);
}
