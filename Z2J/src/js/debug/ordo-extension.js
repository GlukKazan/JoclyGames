(function() {

var checkVersion = Model.Game.checkVersion;

Model.Game.checkVersion = function(design, name, value) {
  if (name != "ordo-extension") {
     (checkVersion)(design, name, value);
  }
}

var getPos = function(move) {
  for (var i in move.actions) {
       var fp = move.actions[i][0];
       var tp = move.actions[i][1];
       if ((fp !== null) && (tp !== null)) {
           return tp;
       }
  }
  return null;
}

var buildGroup = function(group, player) {
  var design = Model.Game.design;
  for (var i = 0; i < group.length; i++) {
       var pos = group[i];
       for (var i = 0; i < design.dirs.length; i++) {
            var p = design.navigate(player, pos, design.dirs[i]);
            if (p !== null) {
                var piece = board.getPiece(p);
                if ((piece !== null) && (piece.player === player)) {
                    ix = Model.find(group, p);
                    if (ix < 0) {
                        group.push(p);
                    }
                }
            }
       }
  }
}

var checkCoherence = function(board, player, group) {
  var design = Model.Game.design;
  var len = design.positions.length;
  for (var p = 0; p < len; p++) {
       var piece = board.getPiece(p);
       if ((piece !== null) && (piece.player === player)) {
           ix = Model.find(group, p);
           if (ix < 0) {
               return false;
           }
       }
  }
  return true;
}

var CheckInvariants = Model.Game.CheckInvariants;

Model.Game.CheckInvariants = function(board) {
  for (var i in board.moves) {
       var m = board.moves[i];
       var b = board.apply(m);
       var p = (getPos)(m);
       if (p !== null) {
           var group = [ p ];
           (buildGroup)(group, board.player);
           if ((checkCoherence)(b, board.player, group) === false) {
               m.failed = true;
           }
       }
  }
  (CheckInvariants)(board);
}

})();
