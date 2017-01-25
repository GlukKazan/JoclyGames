(function() {

var checkVersion = Model.Game.checkVersion;

Model.Game.checkVersion = function(design, name, value) {
  if (name !== "morris-extension") {
     (checkVersion)(design, name, value);
  }
}

var getPieceCount = function(board) {
  var r = 0;
  var design = Model.Game.design;
  var len = design.positions.length;
  for (var p = 0; p < len; p++) {
       var piece = board.getPiece(p);
       if ((piece !== null) && (piece.player === board.player)) {
           r++;
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

var CheckInvariants = Model.Game.CheckInvariants;

Model.Game.CheckInvariants = function(board) {
  var design = Model.Game.design;
  var cnt = (getPieceCount)(board);
  for (var i in board.moves) {
       var m = board.moves[i];
       var b = board.apply(m);
       for (var j in m.actions) {
            fp = m.actions[j][0];
            tp = m.actions[j][1];
            pn = m.actions[j][3];
            if ((fp !== null) && (tp !== null)) {
                if ((checkLine)(b, tp[0], board.player) === true) {
                    var all = [];
                    var captured = [];
                    var len = design.positions.length;
                    for (var p = 0; p < len; p++) {
                         var piece = b.getPiece(p);
                         if (piece.player !== board.player) {
                             if ((checkLine)(b, p, b.player) === false) {
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
                if (cnt === 3) {
                    var len = design.positions.length;
                    for (var p = 0; p < len; p++) {
                        if (p !== tp[0]) {
                            var piece = board.getPiece(p);
                            if (piece === null) {
                                tp.push(p);
                            }
                        }
                    }
                }
                break;
           }
       }
  }
  (CheckInvariants)(board);
}

})();
