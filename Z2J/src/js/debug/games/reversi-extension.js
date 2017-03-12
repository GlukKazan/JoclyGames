(function() {

var checkVersion = Model.Game.checkVersion;
var othelloMode  = false;

Model.Game.checkVersion = function(design, name, value) {
  if (name == "reversi-extension") {
      othelloMode = false;
      return;
  }
  if (name == "othello-extension") {
      othelloMode = true;
      return;
  }
  checkVersion(design, name, value);
}

var checkNeighbors = function(board, pos) {
  var design = Model.Game.design;
  for (var i = 0; i < design.dirs.length; i++) {
       var p = design.navigate(board.player, pos, design.dirs[i]);
       if (p !== null) {
           var piece = board.getPiece(p);
           if ((piece !== null) && (piece.player === board.player)) {
               return true;
           }
       }
  }
  return false;
}

var checkDir = function(board, pos, dir, changed) {
  var r = false;
  var design = Model.Game.design;
  var p = design.navigate(board.player, pos, dir);
  while (p !== null) {
      var piece = board.getPiece(p);
      if (piece === null) return false;
      if (piece.player === board.player) break;
      changed.push(p);
      p = design.navigate(board.player, p, dir);
      r = true;
  }
  return r;
}

var CheckInvariants = Model.Game.CheckInvariants;

Model.Game.CheckInvariants = function(board) {
  var design = Model.Game.design;
  var moves = [];
  for (var i in board.moves) {
       var m = board.moves[i];
       var f = false;
       if ((m.actions.length === 1) && (m.actions[0][0] === null) && (m.actions[0][1] !== null)) {
           var pos = m.actions[0][1][0];
           for (var j = 0; j < design.dirs.length; j++) {
                var changed = [];
                if (checkDir(board, pos, design.dirs[j], changed) === true) {
                    while (changed.length > 0) {
                        m.dropPiece(changed.pop(), Model.Game.createPiece(0, board.player), 1);
                        f = true;
                    }
                }
           }
           if (f === true) {
               moves.push(m);
           }
       }
  }
  if ((moves.length === 0) && (othelloMode === false)) {
       for (var p = 0; p < len; p++) {
            if ((board.getPiece(p) === null) && (checkNeighbors(board, p) === true)) {
                 m = Model.Game.createMove();
                 m.dropPiece(p, Model.Game.createPiece(0, board.player), 1);
                 moves.push(m);
            }
       }
  }
  board.moves = moves;
  CheckInvariants(board);
}

})();
