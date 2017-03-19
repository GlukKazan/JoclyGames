(function() {

var checkVersion = Dagaz.Model.checkVersion;

Dagaz.Model.checkVersion = function(design, name, value) {
  if (name !== "sliding-puzzle") {
     checkVersion(design, name, value);
  }
}

var CheckInvariants = Dagaz.Model.CheckInvariants;

Dagaz.Model.CheckInvariants = function(board) {
  _.chain(board.moves)
   .filter(function(move) {
       if (move.actions.length !== 1) return false;
       var action = move.actions[0];
       if (action[0] === null) return false;
       if (action[1] === null) return false;
       if (action[0] === action[1]) return false;
       if (board.getPiece(action[0][0]) === null) return false;
       return true;
    })
   .each(function(move) {
       var design = board.game.design;
       var action = move.actions[0];
       var pos    = action[0][0];
       var delta  = action[1][0] - pos;
       var piece  = board.getPiece(pos);
       var value  = piece.getValue(0);
       _.chain(_.range(design.positions.length))
        .filter(function(pos) {
            if (board.getPiece(pos) === null) return false;
            return board.getPiece(pos).getValue(0) === value;
         })
        .each(function(pos) {
            if ((pos + delta < 0) || 
                (pos + delta >= design.positions.length) ||
                (board.getPiece(pos + delta) !== null)) {
                move.failed = true;
            } else {
                move.movePiece(pos, pos + delta, null, 1);
            }
         });
    });
  CheckInvariants(board);
}

})();
