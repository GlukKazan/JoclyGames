(function() {

var checkVersion = Model.Game.checkVersion;
var multiMode = false;

Model.Game.checkVersion = function(design, name, value) {
  if (name === "morris-extension") {
      if (value === "multi") {
          multiMode = true;
      }
  } else {
      checkVersion(design, name, value);
  }
}

var getFriendPositions = function(board) {
  var r = [];
  var design = Model.Game.design;
  var len = design.positions.length;
  for (var p = 0; p < len; p++) {
       var piece = board.getPiece(p);
       if ((piece !== null) && (piece.player === board.player)) {
           r.push(p);
       }
  }
  return r;
}

var countLines = function(board, pos, player) {
  var r = 0;
  var design = Model.Game.design;
  for (var i = 0; i < design.dirs.length; i++) {
       var p = design.navigate(player, pos, design.dirs[i]);
       if (p !== null) {
           var piece = board.getPiece(p);
           if ((piece !== null) && (piece.player === player) {
               var q = design.navigate(player, p, design.dirs[i]);
               if (q !== null) {
                   piece = board.getPiece(q);
                   if ((piece !== null) && (piece.player === player) {
                      r++;
                   }
               }
               q = design.navigate(0, pos, design.dirs[i]);
               if (q !== null) {
                   piece = board.getPiece(q);
                   if ((piece !== null) && (piece.player === player) {
                      r++;
                   }
               }
           }
       }
  }
  return r;
}

var generateMoves = function(board, moves, pos) {
  var design = Model.Game.design;
  var m = Model.Game.createMove();
  var len = design.positions.length;
  for (var p = 0; p < len; p++) {
       if (board.getPiece(p) === null) {
           var b = board.copy();
           b.setPiece(pos, null);
           var cnt = countLines(b, p, board.player);
           if (cnt > 0) {
               m.actions.push([ [pos], null, null, 1]);
           }
           if (typeof m.actions[0][1] === "undefined") {
               m.actions[0][1] = [];
           }
           m.actions[0][1].push(p);
       }
  }
  if (m.actions.length > 0) {
      moves.push(m);
  }
}

var CheckInvariants = Model.Game.CheckInvariants;

Model.Game.CheckInvariants = function(board) {
  var design = Model.Game.design;
  var friend = getFriendPositions(board);
  var dropMode = false;
  for (var i in board.moves) {
       var m = board.moves[i];
       for (var j in m.actions) {
           if (m.actions[0][0] === null) {
               dropMode = true;
               break;
           }
       }
       if (dropMode === true) break;
  }
  if ((dropMode !== true) && (friend.length === 3)) {
      var moves = [];
      for (var i in board.moves) {
           var m = board.moves[i];
           if (m.actions[0][0] !== null) {
               for (var j = 0; j < 3; j++) {
                   generateMoves(board, moves, friend[j]);
               }
               board.moves = moves;
               break;
           }
      }
  }
  for (var i in board.moves) {
       var m = board.moves[i];
       var b = board.apply(m);
       for (var j in m.actions) {
            fp = m.actions[j][0];
            tp = m.actions[j][1];
            pn = m.actions[j][3];
            if ((dropMode === true) && (fp !== null)) {
                m.failed = true;
                break;
            }
            if ((fp !== null) && (tp !== null)) {
                var cnt = countLines(b, tp[0], board.player);
                if (cnt > 0) {
                    if (multiMode !== true) {
                        cnt = 1;
                    }
                    var all = [];
                    var captured = [];
                    var len = design.positions.length;
                    for (var p = 0; p < len; p++) {
                         var piece = b.getPiece(p);
                         if (piece.player !== board.player) {
                             if (countLines(b, p, b.player) === 0) {
                                 captured.push(p);
                             }
                             all.push(p);
                         }
                    }
                    if (captured.length === 0) {
                        captured = all;
                    }
                    if (captured.length > 0) {
                        captured.push(null);
                        for (k = 0; k < cnt; k++) {
                            m.actions.push([captured, null, null, pn]);
                        }
                    }
                }
                break;
           }
       }
  }
  CheckInvariants(board);
}

})();
