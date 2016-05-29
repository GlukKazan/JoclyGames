var Model   = {};
Model.Game  = {};
Model.Board = {
  game: Model.Game,
  mWho: 1,
  forks: [],
  pieces: [],
  names: [],
  addFork: function(aGen) {
     this.forks.push(aGen);
  },
  getValue: function(aName, aPos) {
     if (typeof this.names[aName] === "undefined") {
         return null;
     }
     if (typeof this.names[aName][aPos] === "undefined") {
         return null;
     }
     return this.names[aName][aPos];
  },
  setValue: function(aName, aPos, aValue) {
     if (typeof this.names[aName] === "undefined") {
         this.names[aName] = [];
     }
     this.names[aName][aPos] = aValue;
  },
  getPiece: function(aPos) {
     if (typeof this.pieces[aPos] === "undefined") {
         return null;
     }
     return this.pieces[aPos];
  }
};
Model.Move  = {};

function ZrfGenStub() {
  this.board = Model.Board;
  this.cc = 0;
  this.cp = null;
  this.stack = [];
  this.mark = null;
  this.backs = [];
  this.flags = [];
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
