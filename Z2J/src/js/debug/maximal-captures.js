(function() {

var checkVersion = Model.Game.checkVersion;
var mode = 0;

Model.Game.checkVersion = function(design, name, value) {
  if (name == "maximal-captures") {
     if (value == "false") {
         mode = 0;
     }
     if (value == "true") {
         mode = 1;
     }
     if (value == "2") {
         mode = 2;
     }
     if (mode === null) {
         design.failed = true;
     }
  } else {
     checkVersion(design, name, value);
  }
}

var PostActions = Model.Game.PostActions;

Model.Game.PostActions = function(board) {
  PostActions(board);
  if (mode !== 0) {
      var moves = [];
      var mx = 0;
      var mk = 0;
      for (var i in board.moves) {
           var vl = 0;
           var kv = 0;
           for (var j in board.moves[i].actions) {
                var fp = board.moves[i].actions[j][0];
                var tp = board.moves[i].actions[j][1];
                if (tp === null) {
                    var piece = board.getPiece(fp[0]);
                    if (piece !== null) {
                        if (piece.type > 0) {
                            kv++;
                        }
                        vl++;
                    }
                }
           }
           if (vl > mx) {
               mx = vl;
           }
           if (kv > mk) {
               mk = kv;
           }
      }
      for (var i in board.moves) {
           var vl = 0;
           var kv = 0;
           for (var j in board.moves[i].actions) {
                var fp = board.moves[i].actions[j][0];
                var tp = board.moves[i].actions[j][1];
                if (tp === null) {
                    var piece = board.getPiece(fp[0]);
                    if (piece !== null) {
                        if (piece.type > 0) {
                            kv++;
                        }
                        vl++;
                    }
                }
           }
           if ((mode === 2) && (mk > 0)) {
               if (kv == mk) {
                   moves.push(board.moves[i]);
               }
           } else {
               if (vl == mx) {
                   moves.push(board.moves[i]);
               }
           }
      }
      board.moves = moves;
  }
}

})();
