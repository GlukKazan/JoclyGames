(function() {

var checkVersion = Model.Game.checkVersion;

Model.Game.checkVersion = function(design, name, value) {
  if (name !== "bahrain-dama-extension") {
     (checkVersion)(design, name, value);
  }
}

var checkDir = function(board, player, pos, name) {
  var design = Model.Game.design;
  var dir = design.getDirection(name);
  if (dir !== null) {
      var piece = board.getPiece(pos);
      var p = design.navigate(player, pos, dir);
      if ((p === null) || (piece === null)) {
          return false;
      }
      if (piece.type > 0) {
          var isEmpty = true;
          while (board.getPiece(p) === null) {
              p = design.navigate(player, p, dir);
              if ((p === null) || (piece === null)) {
                  return false;
              }
          }
      }
      piece = board.getPiece(p);
      if ((piece !== null) && (piece.player !== player)) {
          p = design.navigate(player, p, dir);
          if ((p === null) || (piece === null)) {
              return false;
          }
          if (board.getPiece(p) === null) {
              return true;
          }
      }
  }
  return false;
}

var kish = function(board) {
  var design = Model.Game.design;
  var len = design.positions.length;
  for (var p = 0; p < len; p++) {
       var piece = board.getPiece(p);
       if ((piece != null) && (piece.player !== board.player)) {
           if (((checkDir)(board, piece.player, p, "n") === true) ||
               ((checkDir)(board, piece.player, p, "w") === true) ||
               ((checkDir)(board, piece.player, p, "e") === true)) {
               return true;
           }
           if (piece.type > 0) {
               if ((checkDir)(board, piece.player, p, "s") === true) {
                   return true;
               }
           }
       }
  }
  return false;
}

var CheckInvariants = Model.Game.CheckInvariants;

Model.Game.CheckInvariants = function(board) {
  if ((kish)(board) === true) {
      for (var i in board.moves) {
          var m = board.moves[i];
          var pos = null;
          for (var j in m.actions) {
               tp = m.actions[j][1];
               if (tp === null) {
                   pos = null;
                   break;
               } else {
                   pos = tp[0];
               }
          }
          if (pos !== null) {
              var b = board.apply(m);
              var piece = b.getPiece(pos);
              if (piece !== null) {
                  if (((checkDir)(b, board.player, pos, "n") === true) ||
                      ((checkDir)(b, board.player, pos, "w") === true) ||
                      ((checkDir)(b, board.player, pos, "e") === true)) {
                      m.failed = true;
                      break;
                  }
                  if (piece.type > 0) {
                      if ((checkDir)(b, board.player, pos, "s") === true) {
                          m.failed = true;
                          break;
                      }
                  }
              }
          }
      }
  }
  (CheckInvariants)(board);
}

})();
