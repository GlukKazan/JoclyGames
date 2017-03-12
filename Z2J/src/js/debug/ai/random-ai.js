(function() {

function RandomAi(design, params) {
  this.design   = design;
  this.params   = params;
  this.restrict = [];
}

var createBot = Model.Game.createBot;

Model.Game.createBot = function(design, type, params) {
  if (type === "random") {
      return new RandomAi(design, params);
  } else {
      if (!_.isUndefined(createBot)) {
          return createBot(design, type, params);
      }
  }
}

RandomAi.prototype.setBoard = function(board) {
  this.board = board;
  this.restrict = [];
}

RandomAi.prototype.getMove = function() {
  this.board.generate(this.design);
  var r = Model.Game.getRandom(this.board.moves, this.restrict, this.params.maxIterations);
  if (!_.isUndefined(r)) {
      return { move: this.board.moves[r], ai: (this.board.moves.length === 1) ? "once" : "random" };
  }
}

})();
