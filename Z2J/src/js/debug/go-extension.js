(function() {

var checkVersion = Model.Game.checkVersion;
var suicideMode = false;

Model.Game.checkVersion = function(design, name, value) {
  if (name == "go-extension") {
     if (value == "suicide") {
         suicideMode = true;
     }
  } else {
     checkVersion(design, name, value);
  }
}

var checkAlive = function(group, player, neigbors) {
  var design = Model.Game.design;
  for (var i = 0; i < group.length; i++) {
       var pos = group[i];
       for (var j = 0; j < design.dirs.length; j++) {
            var p = design.navigate(player, pos, design.dirs[j]);
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
       if ((m.actions.length === 1) && (m.actions[0][0] === null) && (m.actions[0][1] !== null)) {
           var pos    = m.actions[0][1][0];
           var design = Model.Game.design;
           var neigbors = [];
           for (var j = 0; j < design.dirs.length; j++) {
                var p = design.navigate(board.player, pos, design.dirs[j]);
                if (p !== null) {
                    var piece = board.getPiece(p);
                    if (piece !== null) {
                        if (piece.player === board.player) {
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
                    if (checkAlive(g, q.player, neigbors) === false) {
                        suicide = false;
                        while (g.length > 0) {
                            m.capturePiece(g.pop(), 1);
                        }
                    }
                }
           }
       }
       if (suicide === true) {
           if (checkAlive(group, board.player, neigbors) === true) {
               suicide = false;
           }
       }
       if (suicide === true) {
           if ((suicideMode === false) || (group.length === 0)) {
               m.failed = true;
           } else {
               m.capturePiece(pos, 1);
               while (group.length > 0) {
                  m.capturePiece(g.pop(), 1);
               }
           }
       }
  }
  CheckInvariants(board);
}

Model.Move.moveToString = function(move, part) {
  if (move.actions.length === 0) return "tt";
  return _.chain(move.actions)
   .filter(function (action) {
       return (action[0] === null) && (action[1] !== null) && (action[2] !== null);
    })
   .map(function (action) {
       return Model.Game.posToString(action[1][0]);
    })
   .first()
   .value();
}

})();
