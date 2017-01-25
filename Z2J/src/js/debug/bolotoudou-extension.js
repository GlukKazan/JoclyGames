(function() {

var checkVersion = Model.Game.checkVersion;

Model.Game.checkVersion = function(design, name, value) {
  if (name !== "bolotoudou-extension") {
     (checkVersion)(design, name, value);
  }
}

var markEnemies = function(board, pos, dir, captured) {
  var design = Model.Game.design;
  var opposite = design.players[0][dir];
  for (var i = 0; i < design.dirs.length; i++) {
       var d = design.dirs[i];
       if ((d !== dir) && (d !== opposite)) {
           var p = design.navigate(board.player, pos, d);
           if (p !== null) {
               var piece = board.getPiece(p);
               if ((piece !== null) && (piece.player !== board.player)) {
                   captured.push(p);
               }
           }
       }
  }
}

var checkLine = function(board, pos, player, captured) {
  var design = Model.Game.design;
  for (var i = 0; i < design.dirs.length; i++) {
       var c = [];
       var p = design.navigate(player, pos, design.dirs[i]);
       (markEnemies)(board, pos, design.dirs[i], c);
       if (p !== null) {
           var piece = board.getPiece(p);
           if ((piece !== null) && (piece.player === player) {
               (markEnemies)(board, p, design.dirs[i], c);
               var q = design.navigate(player, p, design.dirs[i]);
               if (q !== null) {
                   piece = board.getPiece(q);
                   if ((piece !== null) && (piece.player === player) {
                      (markEnemies)(board, q, design.dirs[i]);
                      for (var i in c) {
                           if (Model.find(captured, c[i]) < 0) {
                               captured.push(c[i]);
                           }
                      }
                      return true;
                   }
               }
               q = design.navigate(0, pos, design.dirs[i]);
               if (q !== null) {
                   piece = board.getPiece(q);
                   if ((piece !== null) && (piece.player === player) {
                      (markEnemies)(board, q, design.dirs[i], c);
                      for (var i in c) {
                           if (Model.find(captured, c[i]) < 0) {
                               captured.push(c[i]);
                           }
                      }
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
  for (var i in board.moves) {
       var m = board.moves[i];
       for (var j in m.actions) {
            fp = m.actions[j][0];
            tp = m.actions[j][1];
            pn = m.actions[j][3];
            if ((fp === null) && (tp !== null)) {
                if ((checkLine)(board, tp[0], board.player, []) === true) {
                   m.failed = true;
                   break;
                }
            }
            if ((fp !== null) && (tp !== null)) {
                var b = board.apply(m);
                var captured = [];
                if ((checkLine)(b, tp[0], board.player, captured) === true) {
                    if (captured.length > 0) {
                        m.actions.push([captured, null, null, pn]);
                    }
                }
                break;
            }
       }
  }
  (CheckInvariants)(board);
}

})();
