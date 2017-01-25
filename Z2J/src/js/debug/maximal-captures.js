(function() {

var checkVersion = Model.Game.checkVersion;
var mode = null;

Model.Game.checkVersion = function(aDesign, aName, aValue) {
  if (aName == "maximal-captures") {
     if (aValue == "false") {
         mode = 0;
     }
     if (aValue == "true") {
         mode = 1;
     }
     // TODO: aValue == "2"
     if (mode === null) {
         aDesign.failed = true;
     }
  } else {
     (checkVersion)(aDesign, aName, aValue);
  }
}

var PostActions = Model.Game.PostActions;

Model.Game.PostActions = function(board) {
  (PostActions)(board);
  if (mode !== 0) {
      var moves = [];
      var mx = 0;
      for (var i in board.moves) {
           var vl = 0;
           for (var j in board.moves[i].moves) {
                if (board.moves[i].moves[j][1] === null) {
                    vl++;
                }
           }
           if (vl > mx) {
               mx = vl;
           }
      }
      for (var i in board.moves) {
           var vl = 0;
           for (var j in board.moves[i].moves) {
                if (board.moves[i].moves[j][1] === null) {
                    vl++;
                }
           }
           if (vl == mx) {
                moves.push(board.moves[i]);
           }
      }
      board.moves = moves;
  }
}

})();
