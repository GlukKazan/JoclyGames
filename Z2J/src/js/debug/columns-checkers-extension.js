(function() {

var checkVersion = Model.Game.checkVersion;

Model.Game.checkVersion = function(design, name, value) {
  if (name !== "columns-checkers-extension") {
     checkVersion(design, name, value);
  }
}

var PostActions = Model.Game.PostActions;

Model.Game.PostActions = function(board) {
  PostActions(board);
  for (var i in board.moves) {
       var m = board.moves[i];
       var move = null;
       var capturing = null;
       for (var j in m.actions) {
            if (m.actions[j][0] !== null) {
                if (m.actions[j][1] !== null) {
                    move = m.actions[j];
                } else {
                    capturing = m.actions[j];
                }
            }
       }
       if ((capturing !== null) && (move !== null)) {
            var enemy = board.getPiece(capturing[0][0]);
            if (enemy !== null) {
                var piece = enemy.pop();
                if (enemy.length > 0) {
                    capturing[1] = capturing[0];
                    capturing[2] = [ enemy ];
                }
                var friend = board.getPiece(move[0][0]);
                if (friend !== null) {
                    move[2] = [ piece ];
                    for (var k in friend) {
                         move[2].push(friend[k]);
                    }
                }
            }
       }
  }
}

})();
