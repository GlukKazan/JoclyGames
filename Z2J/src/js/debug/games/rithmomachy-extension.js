(function() {

var checkVersion = Model.Game.checkVersion;

Model.Game.checkVersion = function(design, name, value) {
  if (name !== "rithmomachy-extension") {
     checkVersion(design, name, value);
  }
}

var CheckInvariants = Model.Game.CheckInvariants;

Model.Game.CheckInvariants = function(board) {
  var design = Model.Game.design;
  _.each(board.moves, function (move) {
       var b = board.apply(move);
       var pos = move.action[0][1][0];
       _.chain(_.range(design.positions.length))
        .filter(function (p) {
            var piece = this.getPiece(p);
            if (piece === null) return false;
            return !Model.Game.isFriend(piece, board.player);
         }, b)
        .map(function (p) {
            return { pos: p, captured: [] };
         })
         // TODO: Siege, Equality, Ambush, Eruption

        .each(eruption, b)
        .filter(function (f) {
            return f.captured.length > 0;
         }, b)
        .each(function (f) {
            var piece = board.getPiece(f.pos);
            if (piece !== null) {
                var np = _.chain(_.range(piece.length))
                          .difference(f.captured)
                          .map(function (n) { return piece[n];})
                          .value();
                if (np.length === 0) {
                    this.capturePiece(f.pos, 1);
                } else {
                    this.movePiece(f.pos, f.pos, np, 1);
                }
            }
         }, move);
  });
  CheckInvariants(board);
}

})();
