(function() {

function SgfAi(design, params) {
  this.design   = design;
  this.params   = params;
  this.frames   = [];
  this.restrict = [];
  if (!_.isUndefined(params.sgf)) {
      this.ix = 0;
      this.frames.push({
          board: Model.Game.getInitBoard(),
          sgf:   params.sgf,
          pos:   0
      });
  }
}

var createBot = Model.Game.createBot;

Model.Game.createBot = function(design, type, params) {
  if (type === "sgf") {
      return new SgfAi(design, params);
  } else {
      if (!_.isUndefined(createBot)) {
          return createBot(design, type, params);
      }
  }
}

var compareMove = Model.Game.compareMove;

Model.Game.compareMove = function(move, notation, board) {
  if ((move.actions.length > 0) && (move.actions[0][1] !== null)) {
      var s = Model.Game.posToString(move.actions[0][1][0], this.design);
      if (move.actions[0][0] !== null) {
          s = Model.Game.posToString(move.actions[0][0][0], this.design) + s;
      }
      if (s == notation) {
          return true;
      }
  }
  return compareMove(move, notation, board);
}

var getMoves = function(sgf, pos, r) {
  if (_.isUndefined(r)) {
      r = [];
  }
  if (pos >= sgf.length) return r;
  if (_.isArray(sgf[pos])) {
      for (var i = pos; i < sgf.length; i++) {
         getMoves(sgf[pos], 0, r);
      }
  } else {
      if (sgf[pos].arg.length > 0) {
         r.push({
            notation: sgf[pos].arg[0],
            sgf:      sgf,
            pos:      pos + 1
         });
      }
  }
  return r;
}

SgfAi.prototype.setBoard = function(board) {
  this.board = board;
  this.restrict = [];
  for (var i = 0; i < this.frames.length; i++) {
      if (board.isEquals(this.frames[i].board)) {
          this.ix = i;
          return;
      }
  }
  if (this.ix < this.frames.length) {
      var frame = this.frames[this.ix];
      delete this.ix;
      var moves = getMoves(frame.sgf, frame.pos);
      var variant = _.chain(moves)
       .filter(function(v) {
           return Model.Game.compareMove(this.board.move, v.notation, this.board.parent);
        })
       .first()
       .value();
      if (!_.isUndefined(variant)) {
          this.ix = this.frames.length;
          this.frames.push({
              board: this.board.parent,
              sgf:   variant.sgf,
              pos:   variant.pos
          });
      }
  } else {
      delete this.ix;
  }
}

SgfAi.prototype.getMove = function() {
  this.board.generate(this.design);
  if ((this.board.moves.length > this.restrict.length) && (this.ix < this.frames.length)) {
      var frame = this.frames[this.ix];
      delete this.ix;
      var moves = getMoves(frame.sgf, frame.pos);
      var r = Model.Game.getRandom(moves, this.restrict, this.params.maxIterations);
      var move = _.chain(this.board.moves)
       .filter(function(move) {
           return Model.Game.compareMove(move, moves[r].notation, this.board);
        })
       .first()
       .value();
      if (!_.isUndefined(move)) {
          this.ix = this.frames.length;
          this.frames.push({
              board: this.board,
              sgf:   moves[r].sgf,
              pos:   moves[r].pos
          });
          return { move: move, ai: (this.board.moves.length === 1) ? "once" : "sgf" };
      }
  } else {
      delete this.ix;
  }
}

})();
