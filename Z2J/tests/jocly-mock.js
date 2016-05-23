var Model   = {};
Model.Game  = {};
Model.Board = {
  game: Model.Game,
  mWho: 1,
  forks: [],
  pieces: [],
  addFork: function(aGen) {
     this.forks.push(aGen);
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
