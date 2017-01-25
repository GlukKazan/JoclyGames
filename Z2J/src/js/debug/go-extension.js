(function() {

var checkVersion = Model.Game.checkVersion;
var suicideMode = false;

Model.Game.checkVersion = function(design, name, value) {
  if (name == "go-extension") {
     if (value == "suicide") {
         suicideMode = true;
     }
  } else {
     (checkVersion)(design, name, value);
  }
}

var checkAlive = function(group, player, neigbors) {
  var design = Model.Game.design;
  for (var i = 0; i < group.length; i++) {
       var pos = group[i];
       for (var i = 0; i < design.dirs.length; i++) {
            var p = design.navigate(player, pos, design.dirs[i]);
            var ix = Model.find(neigbors, p);
            if (ix >= 0) {
                neigbors[ix] = null;
            }
            if (p !== null) {
                var piece = board.getPiece(p);
                if (piece === null) {
                    return true;
                } else {
                    ix = Model.find(group, p);
                    if ((ix < 0) && (piece.player === player)) {
                        group.push(p);
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
       var suicide = true;
       var group = [];
       var m = board.moves[i];
       if ((m.actions.length === 1) && (m.actions[0][0] === null)) {
           var pos    = m.actions[0][1][0];
           var player = m.actions[0][2][0].player;
           var design = Model.Game.design;
           var neigbors = [];
           for (var i = 0; i < design.dirs.length; i++) {
                var p = design.navigate(player, pos, design.dirs[i]);
                if (p !== null) {
                    var piece = board.getPiece(p);
                    if (piece !== null) {
                        if (piece.player === player) {
                            group.push(p);
                        } else {
                            neigbors.push(p);
                        }
                    } else {
                        suicide = false;
                    }
                }
           }
           while (neigbors.length > 0) {
                var p = neigbors.pop();
                if (p !== null) {
                    var q = board.getPiece(p);
                    var g = [ p ];
                    if ((checkAlive)(g, q.player, neigbors) === false) {
                        suicide = false;
                        while (g.length > 0) {
                            m.capturePiece(g.pop(), 1);
                        }
                    }
                }
           }
       }
       if (suicide === true) {
           if ((checkAlive)(group, player, neigbors) === true) {
               suicide = false;
           }
       }
       if (suicide === true) {
           if ((suicideMode === false) || (group.length === 0)) {
               m.failed = true;
           }
       }
  }
  (CheckInvariants)(board);
}

Model.Move.moveToString = function(move, part) {
  for (var i in move.actions) { 
       var fp = move.actions[i][0];
       var tp = move.actions[i][1];
       var p  = move.actions[i][2];
       if ((fp === null) && (tp !== null) && (p !== null)) {
           return p[0].getOwner() + " " + Model.Game.posToString(tp[0]);
       }
  }
  return "Pass";
}

})();
