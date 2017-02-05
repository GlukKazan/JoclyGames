(function() {

var checkVersion = Model.Game.checkVersion;

Model.Game.checkVersion = function(design, name, value) {
  if (name !== "morris-extension") {
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

var checkLine = function(board, pos, player) {
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
                      return true;
                   }
               }
               q = design.navigate(0, pos, design.dirs[i]);
               if (q !== null) {
                   piece = board.getPiece(q);
                   if ((piece !== null) && (piece.player === player) {
                      return true;
                   }
               }
           }
       }
  }
  return false;
}

var generateMoves = function(board, moves, pos) {
  var design = Model.Game.design;
  var a = Model.Game.createMove();
  var b = Model.Game.createMove();
  var len = design.positions.length;
  for (var p = 0; p < len; p++) {
       if (board.getPiece(p) === null) {
           var x = a.actions;
           if (checkLine(board, p, board.player) === true) {
               x = b.actions;
           }
           if (x.length === 0) {
               x.push([ [pos], [], null, 1]);
           }
           x[0][1].push(p);
       }
  }
  if (a.actions.length > 0) {
      moves.push(a);
  }
  if (b.actions.length > 0) {
      moves.push(b);
  }
}

var CheckInvariants = Model.Game.CheckInvariants;

Model.Game.CheckInvariants = function(board) {
  var design = Model.Game.design;
  var friend = getFriendPositions(board);
  if (friend.length === 3) {
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
            if ((fp !== null) && (tp !== null)) {
                if (checkLine(b, tp[0], board.player) === true) {
                    var all = [];
                    var captured = [];
                    var len = design.positions.length;
                    for (var p = 0; p < len; p++) {
                         var piece = b.getPiece(p);
                         if (piece.player !== board.player) {
                             if (checkLine(b, p, b.player) === false) {
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
                        m.actions.push([captured, null, null, pn]);
                    }
                }
                break;
           }
       }
  }
  CheckInvariants(board);
}

})();
