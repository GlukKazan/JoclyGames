(function() {

var checkVersion = Dagaz.Model.checkVersion;

Dagaz.Model.checkVersion = function(design, name, value) {
  if (name !== "xiangqi-extension") {
     checkVersion(design, name, value);
  }
}

var kingsOpposite = function(board, player) {
  var design = board.game.design;
  var king = design.getPieceType("King");
  var pos = _.chain(_.range(design.positions.length))
   .filter(function(pos) {
       return board.getPiece(pos) !== null;
    })
   .filter(function(pos) {
       return board.getPiece(pos).type === king;
    })
   .filter(function(pos) {
       return board.getPiece(pos).player === player;
    })
   .value();
  var dir = design.getDirection("n");
  while (pos !== null) {
      pos = design.navigate(player, pos, dir);
      if (pos !== null) {
          var piece = board.getPiece(pos);
          if (piece === null) continue;
          if (piece.type !== king) break;
          if (piece.player !== player) return true;
      }
  }
  return false;
}

var CheckInvariants = Dagaz.Model.CheckInvariants;

Dagaz.Model.CheckInvariants = function(board) {
  var design = board.game.design;
  _.chain(board.moves)
   .filter(function(move) {
       return move.actions.length === 1;
    })
   .filter(function(move) {
       return (move.actions[0] !== null) && (move.actions[1] !== null);
    })
   .each(function(move) {
       var b = board.apply(move);
       if (kingsOpposite(b, board.player)) {
           move.failed = true;
       }
    });
  CheckInvariants(board);
}

})();
